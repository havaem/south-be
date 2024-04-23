import { User } from "@/schemas";
import { AppAbility } from "@/shared/services/casl.service";

import { EAction } from "./action";

export const PERMISSIONS = {
    USER_GET_ALL: (ability: AppAbility) => ability.can(EAction.MANAGE, User),
    USER_GET_BY_ID: (ability: AppAbility) => {
        console.log(ability);
        return ability.can(EAction.READ, User);
    },
};
