import { Price, Product } from "./Product";

export interface Addon extends Product {
    order: number;
    productId: string;
    prices:AddonPrice[];
  }
  

export interface AddonPrice extends Price {
  amount: number;
}
