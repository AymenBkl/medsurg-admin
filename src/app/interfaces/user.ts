import { Address } from "./address";
import { PaymentDetail } from "./paymentDetail";
import { Referal } from "./referal";

export interface User {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    username: string;
    role: string;
    token: string;
    imageUrl: string;
    setup: boolean;
    emailVerified: boolean;
    phoneNumber:number;
    addresses:Address[];
    paymentDetail: PaymentDetail;
    status:string;
    referalCode: string;
}
