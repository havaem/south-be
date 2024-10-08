import { AppAbility } from "@/shared/services/casl.service";

import { EAction } from "./action";
import { ESubject } from "./casl";

export const PERMISSIONS = {
    USER_GET_ALL: (ability: AppAbility) => ability.can(EAction.MANAGE, ESubject.USER),
    USER_GET_BY_ID: (ability: AppAbility) => ability.can(EAction.READ, ESubject.USER),

    ROLE_CREATE: (ability: AppAbility) => ability.can(EAction.CREATE, ESubject.ROLE),

    POST_CREATE: (ability: AppAbility) => ability.can(EAction.CREATE, ESubject.POST),

    GAME_OBJECT_GET_BY_ID: (ability: AppAbility) => ability.can(EAction.READ, ESubject.GAME_OBJECT),
    GAME_OBJECT_UPDATE_BY_ID: (ability: AppAbility) => ability.can(EAction.UPDATE, ESubject.GAME_OBJECT),
};
