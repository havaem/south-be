import { createMongoAbility, InferSubjects, MongoAbility, RawRuleOf } from "@casl/ability";
import { Injectable } from "@nestjs/common";

import { EAction } from "@/constants/action";
import { Role, User } from "@/schemas";

export type Subjects = InferSubjects<typeof Role | typeof User> | "all";

export type AppAbility = MongoAbility<[EAction, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
    createAbility = (rules: RawRuleOf<AppAbility>[]) => createMongoAbility<AppAbility>(rules);
    //* FOR EXAMPLE
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
