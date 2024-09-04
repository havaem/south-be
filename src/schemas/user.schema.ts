import "dotenv/config";

import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import * as bcrypt from "bcrypt";
import { IsBoolean, IsEmail, Matches } from "class-validator";
import mongoose, { HydratedDocument } from "mongoose";

import { ELocale } from "@/constants";
import { REGEX } from "@/constants/regex";
import { ConfigService } from "@/shared/services/config.service";
import { getInvalidMessage, getRequiredMessage, getUniqueMessage } from "@/shared/utils";
import { toDto } from "@/shared/utils/toDto";

import { BaseSchema } from "./base.schema";
import { ProfileDocument } from "./profile.schema";
import { Role } from "./role.schema";

export type UserDocument = HydratedDocument<User>;

export class UserStatus {
    @IsBoolean()
    @ApiProperty()
    isVerified: boolean;

    @IsBoolean()
    @ApiProperty()
    isActive: boolean;

    @IsBoolean()
    @ApiProperty()
    isFirstLogin: boolean;
}

@Schema({
    timestamps: true,
    versionKey: false,
    toJSON: {
        virtuals: true,
    },
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
            message: ({ path }) => getInvalidMessage(path),
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
            message: ({ path }) => getInvalidMessage(path),
        },
    })
    username: string;

    @ApiHideProperty()
    @Matches(REGEX.password, {
        message: ({ property }) => getInvalidMessage(property),
    })
    @Prop({
        type: String,
        required: [true, ({ path }) => getRequiredMessage(path)],
        validate: {
            validator: (v: string) => REGEX.password.test(v),
            message: ({ path }) => getInvalidMessage(path),
        },
    })
    password: string;

    profile: ProfileDocument;

    @Prop([
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role",
            default: [],
        },
    ])
    roles: Role[];

    @ApiProperty({
        type: UserStatus,
    })
    @Prop({
        _id: false,
        type: {
            isVerified: Boolean,
            isActive: Boolean,
            isFirstLogin: Boolean,
        },
        default: {
            isVerified: false,
            isActive: true,
            isFirstLogin: true,
        },
    })
    status: {
        isVerified: boolean;
        isActive: boolean;
        isFirstLogin: boolean;
    };

    @ApiProperty({
        enum: ELocale,
        default: ELocale.VI,
    })
    @Prop({
        type: String,
        enum: ELocale,
        default: ELocale.VI,
    })
    locale: ELocale;

    comparePassword: (password: string) => Promise<boolean>;
}

const UserSchema = SchemaFactory.createForClass(User);
UserSchema.methods["toDto"] = toDto;
UserSchema.virtual("profile", {
    ref: "Profile",
    localField: "_id",
    foreignField: "user",
    justOne: true,
});

type UserProps = keyof User;

export const UserPopulate = (data?: UserProps[]) => {
    const defaultOptions: UserProps[] = ["_id", "username", "email"];
    return {
        select: data ? defaultOptions.concat(data).join(" ") : defaultOptions.join(" "),
    };
};

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
                    //* if user is new or password is modified
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
