import { ClassConstructor, plainToInstance } from "class-transformer";
import { Document } from "mongoose";

export function toDto<T>(this: Document, dto: ClassConstructor<T>) {
    return plainToInstance(dto, JSON.parse(JSON.stringify(this.toObject())));
}
