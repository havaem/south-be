import { Document } from "mongoose";

export function isDocument<T>(document: any): document is Document<T> {
    return document instanceof Document;
}
