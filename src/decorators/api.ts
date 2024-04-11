import { applyDecorators, Delete, Get, HttpCode, Patch, Post, Put, RequestMethod } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiUnauthorizedResponse } from "@nestjs/swagger";

import { Public } from "./public.decorator";
import { ResponseMessage } from "./response-message";

interface IProps {
    publicRoute?: boolean;
    method?: keyof typeof RequestMethod;
    path?: string;
    responseMessage?: string;
    responseStatus?: number;
}
export const Api = ({ publicRoute, method, path, responseMessage, responseStatus }: IProps): MethodDecorator => {
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
