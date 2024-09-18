import { createMongoAbility, ForcedSubject, MongoAbility, RawRuleOf } from "@casl/ability";
import { Injectable } from "@nestjs/common";

import { ESubject } from "@/constants";
import { EAction } from "@/constants/action";

export const subjects = [...Object.values(ESubject), "all"] as const;
export type Subjects = (typeof subjects)[number] | ForcedSubject<Exclude<(typeof subjects)[number], "all">>;

export type AppAbility = MongoAbility<[EAction, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
    createAbility = (rules: RawRuleOf<AppAbility>[]) => createMongoAbility<AppAbility>(rules);
    // createForUser(user: IUserRequest) {
    //     const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);
    //     // if (user.roles.includes(ERole.ADMIN)) {
    //     //     can(EAction.MANAGE, "all");
    //     // }
    //     can(EAction.UPDATE, User, ["password"], { _id: user._id });
    //     return build({
    //         detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
    //     });
    // }
}
