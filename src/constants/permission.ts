import { Role } from "@/schemas";
import { AppAbility } from "@/shared/services/casl.service";

import { EAction } from "./action";

export const PERMISSIONS = {
    USER_GET_ALL: (ability: AppAbility) => ability.can(EAction.CREATE, Role),
};
