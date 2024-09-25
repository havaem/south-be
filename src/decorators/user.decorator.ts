import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});
export const UserWS = createParamDecorator((_data, ctx: ExecutionContext) => {
    const client = ctx.switchToWs().getClient();
    return client.handshake.auth;
});
