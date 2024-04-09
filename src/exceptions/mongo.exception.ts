import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { MongoError, MongoServerError } from "mongodb";
import { Error } from "mongoose";

import { convertMessage, getInvalidMessage } from "@/shared/utils";

@Catch(MongoError, MongoServerError, Error.ValidationError)
export class MongoExceptionFilter implements ExceptionFilter {
    catch(exception: MongoServerError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const statusCode = HttpStatus.BAD_REQUEST;
        let message: string[] | string | undefined = exception.message || undefined;

        if (exception.kind == "ObjectId") message = getInvalidMessage("ID");
        switch (exception.code) {
            case 11000:
                message = [];
                for (const p in exception.keyValue) {
                    message.push(convertMessage(`${p}_IS_EXIST`));
                }
                break;
        }
        if (exception.errors) {
            message = [];
            for (const p in exception.errors) {
                message.push(convertMessage(exception.errors[p].properties.message));
            }
        }

        response.status(statusCode).json({
            statusCode,
            message,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
