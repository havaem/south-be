import { applyDecorators, Delete, Get, HttpCode, Patch, Post, Put, RequestMethod } from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiOkResponse,
    ApiParam,
    ApiUnauthorizedResponse,
} from "@nestjs/swagger";

import { PERMISSIONS } from "@/constants";

import { CheckPermissions } from "./permission.decorator";
import { Public } from "./public.decorator";
import { ResponseMessage } from "./response-message.decorator";

interface IProps {
    publicRoute?: boolean;
    method?: keyof typeof RequestMethod;
    path?: string;
    responseMessage?: string;
    responseStatus?: number;
    permissions?: (keyof typeof PERMISSIONS)[];
}
export const Api = ({
    publicRoute,
    method,
    path,
    responseMessage,
    responseStatus,
    permissions,
}: IProps): MethodDecorator => {
    const decorators: Array<ClassDecorator | MethodDecorator | PropertyDecorator> = [];

    if (publicRoute) decorators.push(Public());
    else {
        decorators.push(ApiBearerAuth());
        decorators.push(ApiUnauthorizedResponse({ description: "Unauthorized" }));
    }

    switch (method) {
        case "GET":
            decorators.push(Get(path));
            break;
        case "POST":
            decorators.push(Post(path));
            break;
        case "PUT":
            decorators.push(Put(path));
            break;
        case "DELETE":
            decorators.push(Delete(path));
            break;
        case "PATCH":
            decorators.push(Patch(path));
            break;
        default:
            decorators.push(Get(path));
            break;
    }

    if (path.split(":").length > 1)
        decorators.push(
            ApiParam({
                name: path.split(":")[1],
                type: "string",
                description: "MongoDB ObjectId",
            }),
        );

    if (permissions) {
        decorators.push(CheckPermissions(...permissions.map((permission) => PERMISSIONS[permission])));
        decorators.push(ApiForbiddenResponse({ description: "Forbidden" }));
    }
    decorators.push(ResponseMessage(responseMessage));
    decorators.push(HttpCode(responseStatus));

    switch (responseStatus) {
        case 200:
            decorators.push(ApiOkResponse({ description: responseMessage }));
            break;
        case 201:
            decorators.push(ApiCreatedResponse({ description: responseMessage }));
            break;
        default:
            decorators.push(ApiOkResponse({ description: responseMessage }));
            break;
    }

    return applyDecorators(...decorators);
};
