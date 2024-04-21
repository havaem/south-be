import { ExtractSubjectType } from "@casl/ability";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { IS_PUBLIC_KEY } from "@/constants";
import { CHECK_PERMISSION_KEY, EAction } from "@/constants/action";
import { UserService } from "@/modules/user/user.service";

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

    // parseCondition(permissions: PermissionDocument[], currentUser: User) {
    //     const data = permissions.map((permission) => {
    //         if (permission.conditions && Object.keys(permission.conditions).length) {
    //             // const parsedVal = render(permission.conditions, currentUser);
    //             return {
    //                 ...permission,
    //                 // conditions: { created_by: +parsedVal },
    //             };
    //         }
    //         return permission;
    //     });
    //     return data;
    // }

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
            user.roles
                .map((role) => role.permissions)
                .flat()
                .map(({ action, fields, subject, description, conditions }) => {
                    console.log({
                        action: EAction[action] as any,
                        fields,
                        subject: subject as ExtractSubjectType<Subjects>,
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
                }),
        );

        return permissionHandlers.every((handler) => this.execPermissionHandler(handler, ability));
    }

    private execPermissionHandler(handler: PermissionHandler, ability: AppAbility) {
        if (typeof handler === "function") {
            return handler(ability);
        }
        return handler.handle(ability);
    }
}
