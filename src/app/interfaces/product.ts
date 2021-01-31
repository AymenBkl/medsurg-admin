import { MainProduct } from "./mainProduct";

export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    mainProduct: MainProduct;
}
