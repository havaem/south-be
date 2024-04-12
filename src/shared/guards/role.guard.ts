import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { Roles } from "@/decorators";
import { UserService } from "@/modules/user/user.service";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly userService: UserService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get(Roles, context.getHandler());
        if (!roles) return true;

        const request = context.switchToHttp().getRequest();
        const { _id }: IUserRequest = request.user;
        const user = await this.userService.findOne(
            { _id },
            {
                populate: {
                    path: "roles",
                    select: "name",
                },
            },
        );
        if (!user) return false;
        request.user.roles = user.roles.map((role) => role.name);
        return true;
    }
}
