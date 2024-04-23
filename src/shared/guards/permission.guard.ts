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
import { isDocument } from "../utils";

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private caslAbilityFactory: CaslAbilityFactory,
        private readonly userService: UserService,
    ) {}

    parseCondition(permissions: Permission[], currentUser: IUserRequest) {
        const data = permissions.map((permission: PermissionDocument) => {
            if (permission.conditions["userId"]) {
                const parsedVal = render(permission.conditions["userId"], currentUser);
                if (isDocument<Permission>(permission)) {
                    const rawPermission = permission.toJSON();
                    return {
                        ...rawPermission,
                        conditions: {
                            // ...rawPermission.conditions,
                            _id: parsedVal,
                        },
                    };
                }
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

        const { user: currentUser }: { user: IUserRequest } = context.switchToHttp().getRequest();

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
                    console.log({
                        action,
                        fields,
                        subject,
                        reason: description,
                        conditions,
                    });
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

        return permissionHandlers.every((handler) => this.execPermissionHandler(handler, ability));
    }

    private execPermissionHandler(handler: PermissionHandler, ability: AppAbility) {
        if (typeof handler === "function") {
            console.log("handler(ability): ", handler(ability));
            return handler(ability);
        }
        return handler.handle(ability);
    }
}
