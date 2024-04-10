import { Module } from "@nestjs/common";

import { UserSchemaModule } from "@/schemas";

import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
    imports: [UserSchemaModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
