import { AbilityBuilder, createMongoAbility, ExtractSubjectType, InferSubjects, MongoAbility } from "@casl/ability";
import { Injectable } from "@nestjs/common";

import { EAction } from "@/constants/aciton";
import { ERole } from "@/constants/role";
import { Role, User } from "@/schemas";

type Subjects = InferSubjects<typeof Role | typeof User> | "all";

export type AppAbility = MongoAbility<[EAction, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
    createForUser(user: IUserRequest) {
        const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

        if (user.roles.includes(ERole.ADMIN)) {
            can(EAction.MANAGE, "all");
        }

        //* Role
        can(EAction.UPDATE, User, ["password"], { _id: user._id });

        return build({
            detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
        });
    }
}
