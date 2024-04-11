interface IUserJwt {
    _id: string;
    email: string;
}
interface IUserRequest extends IUserJwt {
    roles: string[];
}
