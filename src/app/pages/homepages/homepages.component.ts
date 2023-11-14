import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ICategory } from 'src/app/interface/category';
import { IProducts } from 'src/app/interface/products';
import { CartService } from 'src/app/service/cart.service';
import { CategoryService } from 'src/app/service/category.service';
import { ProductsService } from 'src/app/service/products.service';


@Component({
  selector: 'app-homepages',
  templateUrl: './homepages.component.html',
  styleUrls: ['./homepages.component.scss']
})
export class HomepagesComponent {

  products: any = null
  category: any= null
  allCategory!: ICategory[];
  user: any = null
  cartItem: any = null
  quantity: number = 1
 


  page: number = 1;
  tabSize: number = 8;
  tabSizes: number[] = [4, 6, 8, 10, 100]
  count: number = 0
  constructor(private productsSevri: ProductsService,
    private cate: CategoryService,
    private cartService: CartService,
    private navigate: Router,
    private toastr: ToastrService) {
    this.productsSevri.getAllProducts().subscribe((response: any) => {
      this.products = response.products.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      // console.log(response.products);
    })
    this.cate.getAllCategory().subscribe((response: any) => {
      this.category = response.data
      this.allCategory = response.data;

      // console.log(response);


    })
  }
  onHandleSubmit() {
    this.cate.getAllCategory().subscribe((response: any) => {
      console.log(response.data)
      this.category = response.data
      this.allCategory = response.data
    }
    )
  }
  onHandleLimit(event: any) {
    this.tabSize = event.target.value;
    console.log(event.target.value)
    this.page = 1
    this.onHandleSubmit()
    // console.log(this.onHandleSubmit());

  }

  onHandlesPage(event: any) {
    this.page = event;
    this.onHandleSubmit()

  }

  formatCurrency(value: number): string {
    const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    });

    return formatter.format(value);
  }


  handleAddToCart() {
    this.user = JSON.parse(localStorage.getItem("user") as string)?.data
    if (!this.user) {
      this.toastr.info("Bạn cần đăng nhập để thực hiện hàng động này", "Nhắc nhở")
    }
    else {
      const cartItem = {
        userId: this.user._id, 
        productId: this.products._id, 
        quantity: 1, 
        total: this.products.price / 100 * (100 - this.products.price)
      }

      this.cartService.create(cartItem).subscribe((resp) => {
        this.toastr.success(resp.message,"Chúc mừng")
        this.navigate.navigate(['/cart'])
      })
      
    }
  }


}
