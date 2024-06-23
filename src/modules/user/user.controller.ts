import { ForbiddenError, subject } from "@casl/ability";
import { Body, Controller, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { EAction } from "@/constants";
import { Api, User } from "@/decorators";
import { MongoId } from "@/decorators/validator.decorator";
import { IUserRequest } from "@/shared/types";

import { UserDto } from "./dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserService } from "./user.service";

@ApiTags("user")
@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.addPost(createUserDto);
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

    @Api({
        method: "GET",
        path: "/:id",
        responseMessage: "User details",
        permissions: ["USER_GET_BY_ID"],
    })
    async findById(@User() user: IUserRequest, @Param("id", MongoId) id: string) {
        ForbiddenError.from(user.ability).throwUnlessCan(EAction.READ, subject("User", { _id: id }));
        const response = await this.userService._findById(id);
        return response.toDto(UserDto);
    }
}
