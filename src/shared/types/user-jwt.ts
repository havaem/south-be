import { Role, User } from "@/schemas";

export interface IUserJwt {
    _id: string;
    email: string;
}
export interface IUserRequest extends IUserJwt {
    roles: Role[];
    document: User;
}
