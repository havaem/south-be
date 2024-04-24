import { AppAbility } from "../services/casl.service";

export interface IUserJwt {
    _id: string;
    email: string;
}
export interface IUserRequest extends IUserJwt {
    ability: AppAbility;
}
