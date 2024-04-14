import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { IS_PUBLIC_KEY } from "@/constants";
import { Roles } from "@/decorators";
import { UserService } from "@/modules/user/user.service";

import { IUserRequest } from "../types";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly userService: UserService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) return true;

        const roles = this.reflector.get(Roles, context.getHandler());
        if (!roles) return true;

        const request = context.switchToHttp().getRequest();
        const { _id }: IUserRequest = request.user;
        const user = await this.userService.findOne(
            { _id },
            {
                populate: {
                    path: "roles",
                    select: "name permissions",
                    populate: {
                        path: "permissions",
                    },
                },
            },
        );

        if (!user) return false;
        request.user.roles = user.roles;
        // request.user.document = user;

        return true;
    }
}
