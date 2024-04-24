import { ExtractSubjectType } from "@casl/ability";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { render } from "mustache";

import { IS_PUBLIC_KEY } from "@/constants";
import { CHECK_PERMISSION_KEY, EAction } from "@/constants/action";
import { UserService } from "@/modules/user/user.service";
import { Permission, PermissionDocument } from "@/schemas";

import { AppAbility, CaslAbilityFactory, Subjects } from "../services/casl.service";
import { IUserRequest } from "../types";
import { PermissionHandler } from "../types/casl";

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private caslAbilityFactory: CaslAbilityFactory,
        private readonly userService: UserService,
    ) {}

    parseCondition(permissions: Permission[], currentUser: IUserRequest) {
        const data = permissions.map((permission: PermissionDocument) => {
            if (permission.conditions && Object.keys(permission.conditions).length > 0) {
                return {
                    ...permission.toJSON(),
                    conditions: Object.entries(permission.conditions).reduce((acc, [key, value]) => {
                        acc[key] = render(value, currentUser);
                        return acc;
                    }, {}),
                };
            }
            return permission;
        });
        return data;
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) return true;

        const permissionHandlers =
            this.reflector.get<PermissionHandler[]>(CHECK_PERMISSION_KEY, context.getHandler()) || [];

        //* If there is no permission requirement, then the user has access
        if (permissionHandlers.length === 0) return true;

        const request = context.switchToHttp().getRequest();
        const { user: currentUser }: { user: IUserRequest } = request;

        const user = await this.userService.findOne(
            { _id: currentUser._id },
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

        const ability = this.caslAbilityFactory.createAbility(
            this.parseCondition(user.roles.map((role) => role.permissions).flat(), currentUser).map(
                ({ action, fields, subject, description, conditions }) => {
                    // console.log({
                    //     action,
                    //     fields,
                    //     subject,
                    //     reason: description,
                    //     conditions,
                    // });
                    return {
                        action: action as EAction,
                        fields: fields.length ? fields : undefined,
                        subject: subject as ExtractSubjectType<Subjects>,
                        reason: description,
                        conditions,
                    };
                },
            ),
        );
        request.user.ability = ability;

        return permissionHandlers.every((handler) => this.execPermissionHandler(handler, ability));
    }

    private execPermissionHandler(handler: PermissionHandler, ability: AppAbility) {
        if (typeof handler === "function") return handler(ability);

        return handler.handle(ability);
    }
}
