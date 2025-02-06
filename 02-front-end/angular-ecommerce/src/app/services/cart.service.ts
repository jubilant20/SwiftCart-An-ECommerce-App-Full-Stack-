import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(theCartItem: CartItem){
    //check if we have already have thhe item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = new CartItem("", "", "", 0);

    if(this.cartItems.length>0){
      //find the item in the cart based on item id

    //check if we found it
    }
    
  }
}
