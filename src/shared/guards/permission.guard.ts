import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { IS_PUBLIC_KEY } from "@/constants";
import { CHECK_PERMISSION_KEY } from "@/constants/aciton";

import { AppAbility, CaslAbilityFactory } from "../services/casl.service";
import { PermissionHandler } from "../types/casl";

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private caslAbilityFactory: CaslAbilityFactory,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) return true;

        const permissionHandlers =
            this.reflector.get<PermissionHandler[]>(CHECK_PERMISSION_KEY, context.getHandler()) || [];

        const { user } = context.switchToHttp().getRequest();
        console.log("user: ", user);
        const ability = this.caslAbilityFactory.createForUser(user);

        return permissionHandlers.every((handler) => this.execPermissionHandler(handler, ability));
    }

    private execPermissionHandler(handler: PermissionHandler, ability: AppAbility) {
        if (typeof handler === "function") {
            return handler(ability);
        }
        return handler.handle(ability);
    }
}
