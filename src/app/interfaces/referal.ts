import { Order } from "./order";
import { User } from "./user";

export interface Referal {
    _id: string;
    owner: User;
    orders: Order[];
    code: string;
    commision: number;
}