import { User } from "./user";

export interface Message {
    message : string;
    to : User;
    from : User;
}