import { ForbiddenError } from "@casl/ability";
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";

import { AppAbility } from "@/shared/services/casl.service";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    catch(exception: ForbiddenError<AppAbility>, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const statusCode = HttpStatus.BAD_REQUEST;

        response.status(statusCode).json({
            statusCode,
            message: exception.message,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
