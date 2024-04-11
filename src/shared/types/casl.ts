import { AppAbility } from "../services/casl.service";

interface IPermissionHandler {
    handle(ability: AppAbility): boolean;
}

type PermissionHandlerCallback = (ability: AppAbility) => boolean;

export type PermissionHandler = IPermissionHandler | PermissionHandlerCallback;
