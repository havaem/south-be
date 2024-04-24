import { ForbiddenError } from "@casl/ability";
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";

import { AppAbility } from "@/shared/services/casl.service";

@Catch(ForbiddenError)
export class CaslExceptionFilter implements ExceptionFilter {
    catch(exception: ForbiddenError<AppAbility>, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const statusCode = HttpStatus.FORBIDDEN;

        response.status(statusCode).json({
            statusCode,
            message: "Forbidden resource",
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
