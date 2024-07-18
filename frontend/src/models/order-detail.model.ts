import { Product } from "./product.model";

export interface OrderDetail {
    product: Product;
    quantity: number;
    price: number;
    note: string;
}