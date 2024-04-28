import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import * as bcrypt from "bcrypt";
import { Type } from "class-transformer";
import {
    IsBoolean,
    IsEmail,
    IsNotEmptyObject,
    IsObject,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    MinLength,
    ValidateNested,
} from "class-validator";
import mongoose, { HydratedDocument } from "mongoose";

import { REGEX } from "@/constants/regex";
import { ConfigService } from "@/shared/services/config.service";
import {
    getInvalidMessage,
    getMaxLengthMessage,
    getMinLengthMessage,
    getRequiredMessage,
    getUniqueMessage,
} from "@/shared/utils";
import { toDto } from "@/shared/utils/toDto";

import { BaseSchema } from "./base.schema";
import { Role } from "./role.schema";

export type UserDocument = HydratedDocument<User>;

export class UserName {
    @ApiProperty({
        required: true,
        description: "First name of the user",
    })
    @IsString({ message: ({ property }) => getInvalidMessage(property) })
    @MinLength(3, { message: ({ property }) => getMinLengthMessage(property, 3) })
    @MaxLength(20, { message: ({ property }) => getMaxLengthMessage(property, 20) })
    first: string;

    @ApiProperty({
        required: false,
        description: "Middle name of the user",
    })
    @IsString({ message: ({ property }) => getInvalidMessage(property) })
    @MinLength(3, { message: ({ property }) => getMinLengthMessage(property, 3) })
    @MaxLength(20, { message: ({ property }) => getMaxLengthMessage(property, 20) })
    @IsOptional()
    middle: string;

    @ApiProperty({
        required: false,
        description: "Last name of the user",
    })
    @MinLength(3, { message: ({ property }) => getMinLengthMessage(property, 3) })
    @MaxLength(20, { message: ({ property }) => getMaxLengthMessage(property, 20) })
    @IsString({ message: ({ property }) => getInvalidMessage(property) })
    @IsOptional()
    last: string;

    @ApiProperty({
        description: "1: first middle last, -1: last middle first",
    })
    @IsOptional()
    display: number;
}

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
})
export class User extends BaseSchema {
    @ApiProperty({
        type: UserName,
    })
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => UserName)
    @Prop({
        _id: false,
        type: {
            first: {
                type: String,
                required: [true, ({ path }) => getRequiredMessage(path)],
                minlength: [3, getMinLengthMessage("First name", 3)],
                maxlength: [20, getMaxLengthMessage("First name", 20)],
            },
            middle: {
                type: String,
                minlength: [3, getMinLengthMessage("Middle name", 3)],
                maxlength: [20, getMaxLengthMessage("Middle name", 20)],
            },
            last: {
                type: String,
                minlength: [3, getMinLengthMessage("Last name", 3)],
                maxlength: [20, getMaxLengthMessage("Last name", 20)],
            },
            display: {
                type: Number,
                required: [true, ({ path }) => getRequiredMessage(path)],
                enum: {
                    values: [1, -1],
                    message: ({ path }) => getInvalidMessage(path),
                },
                default: 1,
            },
        },
    })
    name: {
        first: string;
        middle: string;
        last: string;
        //* 1: first middle last
        //* -1: last middle first
        display: number;
    };

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
