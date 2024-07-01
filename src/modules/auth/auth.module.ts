import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";

import { ProfileModule } from "../profile/profile.module";
import { RoleModule } from "../role/role.module";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
    imports: [UserModule, RoleModule, HttpModule, ProfileModule],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}
