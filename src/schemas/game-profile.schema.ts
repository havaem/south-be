import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import mongoose, { HydratedDocument } from "mongoose";

import { toDto } from "@/shared/utils/toDto";

import { BaseSchema } from "./base.schema";
import { GameObjectDocument } from "./game-object.schema";
import { User, UserPopulate } from "./user.schema";

export type GameProfileDocument = HydratedDocument<GameProfile>;

@Schema({
    timestamps: true,
    versionKey: false,
})
export class GameProfile extends BaseSchema {
    @ApiProperty({
        type: User,
        required: true,
    })
    @IsString()
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: User.name,
        required: true,
        unique: true,
        autopopulate: UserPopulate(),
    })
    user: User | string;

    @ApiProperty({
        type: String,
        default: null,
        description: "GameObject Id",
    })
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: "GameObject",
        default: null,
    })
    hero: GameObjectDocument | string;
}

const GameProfileSchema = SchemaFactory.createForClass(GameProfile);
GameProfileSchema.methods["toDto"] = toDto;

const GameProfileSchemaModule = MongooseModule.forFeatureAsync([
    {
        name: GameProfile.name,
        useFactory: () => {
            const schema = GameProfileSchema;
            return schema;
        },
    },
]);

export { GameProfileSchema, GameProfileSchemaModule };
