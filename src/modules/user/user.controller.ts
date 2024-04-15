import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { Api } from "@/decorators";

import { CreateUserDto } from "./dto/create-user.dto";
import { UserService } from "./user.service";

@ApiTags("user")
@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Api({
        method: "GET",
        path: "/",
        responseMessage: "List of users",
        permissions: ["USER_GET_ALL"],
    })
    findAll() {
        return this.userService.find();
    }
}
