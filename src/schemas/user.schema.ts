import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import * as bcrypt from "bcrypt";
import { IsEmail, Matches } from "class-validator";
import { HydratedDocument } from "mongoose";

import { REGEX } from "@/constants";
import { ConfigService } from "@/shared/services/config.service";
import { getInvalidMessage, getRequiredMessage, getUniqueMessage } from "@/shared/utils";
import { toDto } from "@/shared/utils/toDto";

import { BaseSchema } from "./base.schema";

export type UserDocument = HydratedDocument<User>;

@Schema({
    timestamps: true,
    versionKey: false,
})
export class User extends BaseSchema {
    @ApiProperty({
        example: "example@gmail.com",
        required: true,
    })
    @IsEmail({}, { message: ({ property }) => getInvalidMessage(property) })
    @Prop({
        type: String,
        unique: [true, ({ path }) => getUniqueMessage(path)],
        required: [true, ({ path }) => getRequiredMessage(path)],
        validate: {
            validator: (v: string) => REGEX.email.test(v),
            message: ({ value }) => `${value} is not a valid email!`,
        },
    })
    email: string;

    @ApiProperty({
        example: "example",
        required: true,
    })
    @Matches(REGEX.username, {
        message: ({ property }) => getInvalidMessage(property),
    })
    @Prop({
        type: String,
        default: function () {
            return this.email.split("@")[0] + Math.floor(Math.random() * 1000);
        },
        required: [true, ({ path }) => getRequiredMessage(path)],
        validate: {
            validator: (v: string) => REGEX.username.test(v),
            message: ({ value }) => `${value} is not a valid username!`,
        },
    })
    username: string;

    @ApiProperty({
        example: "example123Aa",
        required: true,
    })
    @Matches(REGEX.password, {
        message: ({ property }) => getInvalidMessage(property),
    })
    @Prop({
        type: String,
        required: [true, ({ path }) => getRequiredMessage(path)],
        validate: {
            validator: (v: string) => REGEX.password.test(v),
            message: ({ value }) => `${value} is not a valid password!`,
        },
    })
    password: string;

    comparePassword: (password: string) => Promise<boolean>;
}

const UserSchema = SchemaFactory.createForClass(User);
UserSchema.methods["toDto"] = toDto;

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
