import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../common/cart-item';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list-grid.component.html',
 // templateUrl: './product-list-table.component.html',
 // templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})

export class ProductListComponent implements OnInit{

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number =1;
  searchMode: boolean = false;

  //new properties for pagination
  thePageNumber: number =1;
  thePageSize: number = 10;
  theTotalElements: number =0;

  previousKeyword: string="";

  constructor(private productService:ProductService,
              private cartService: CartService,
              private route: ActivatedRoute){}

  ngOnInit(): void{
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode){
      this.handleSearchProducts();
    }
    else{
      this.handleListProducts();
    }
  }

  handleSearchProducts(){
    const theKeyword: string= this.route.snapshot.paramMap.get('keyword')!;

    //if we have a different keyword than previous then set thePageNumber to 1

    if(this.previousKeyword != theKeyword){
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    console.log(`keyword=${theKeyword}`)

    //now search for the products using keyword
    this.productService.searchProductsPaginate(this.thePageNumber -1,
                                                this.thePageSize,
                                                theKeyword).subscribe(this.processResult());
  }

  handleListProducts() {
    //check if "id" parameter is available
    const hasCategoryId:boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId){
      //get the "id" param string. convert string to a number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }
    else{
      //not category id available... default to category id 1
      this.currentCategoryId =1;
    }

    //check if we have a different category than previous
    //Note: Angular will reuse a component if it is currently being viewed

    //if we have a different category id than previous
    //then set thePageNumber back to 1
    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber=1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);

    //now get the products for the given category id
    //pagination component in angular pages are 1 base however, in Spring Data REST, the pages are zero based.
    this.productService.getProductListPaginate(this.thePageNumber -1,
                                                this.thePageSize,
                                                this.currentCategoryId)
                                                .subscribe(this.processResult());
  }

  updatePageSize(pageSize: string){
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  processResult(){
    return(data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number +1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  addToCart(theProduct: Product){
    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);

    //ToDo ... do the real work
    const theCartItem = new CartItem(theProduct.id,
                                      theProduct.name,          
                                      theProduct.imageUrl,      
                                      theProduct.unitPrice,     
                                      1  );

    this.cartService.addToCart(theCartItem);
  }
}

