import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";
import { HydratedDocument } from "mongoose";

import { ConfigService } from "@/shared/services/config.service";
import { getUniqueMessage } from "@/shared/utils";

import { BaseSchema } from "./base.schema";

export type UserDocument = HydratedDocument<User>;

@Schema({
    timestamps: true,
    versionKey: false,
})
export class User extends BaseSchema {
    @Prop({
        type: String,
        required: [true, getUniqueMessage("username")],
    })
    username: string;

    @Prop({
        type: String,
        required: [true, ({ path }) => getUniqueMessage(path)],
    })
    password: string;

    comparePassword: (password: string) => Promise<boolean>;
}

const UserSchema = SchemaFactory.createForClass(User);

const UserSchemaModule = MongooseModule.forFeatureAsync([
    {
        name: User.name,
        useFactory: (cfg: ConfigService) => {
            const schema = UserSchema;

            schema.methods.comparePassword = async function (password: string) {
                return bcrypt.compare(password, this.password);
            };

            schema.pre("save", async function (next) {
                try {
                    if (this.isModified("password") || this.isNew) {
                        this.password = await bcrypt.hash(this.password, cfg.appConfig.saltRounds);
                    }
                    next();
                } catch (error) {
                    next(error);
                }
            });
            return UserSchema;
        },
        inject: [ConfigService],
    },
]);

export { UserSchema, UserSchemaModule };
