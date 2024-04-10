import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { MESSAGE_KEY } from "@/constants";

export interface Response<T> {
    data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    constructor(private reflector: Reflector) {}
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        const message = this.reflector.getAllAndOverride<boolean>(MESSAGE_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        return next.handle().pipe(map((data) => ({ data, message: message ?? "Successfully" })));
    }
}
