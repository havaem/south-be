import { BadRequestException, Injectable, PipeTransform, UnprocessableEntityException } from "@nestjs/common";
import { isMongoId } from "class-validator";

import { getInvalidMessage } from "@/shared/utils";

@Injectable()
export class MongoId implements PipeTransform<string> {
    transform(value: string): string {
        if (!isMongoId(value)) throw new BadRequestException(getInvalidMessage("id"));
        return value;
    }
}
@Injectable()
export class MongoIdOptional implements PipeTransform<string> {
    transform(value: string): string {
        if (value && !isMongoId(value)) throw new UnprocessableEntityException(getInvalidMessage("id"));
        return value;
    }
}
