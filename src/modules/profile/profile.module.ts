import { Module } from "@nestjs/common";

import { ProfileSchemaModule } from "@/schemas/profile.schema";

import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";

@Module({
    imports: [ProfileSchemaModule],
    controllers: [ProfileController],
    providers: [ProfileService],
    exports: [ProfileService],
})
export class ProfileModule {}
