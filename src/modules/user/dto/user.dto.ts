import { Exclude } from "class-transformer";

import { User } from "@/schemas/user.schema";

export class UserDto extends User {
    @Exclude()
    password: string;
}
