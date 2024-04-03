import { NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CountOptions } from "mongodb";
import { Document, FilterQuery, Model, MongooseBaseQueryOptions, QueryOptions, UpdateQuery } from "mongoose";

type MongoDBQueryOptions<T> = (CountOptions & MongooseBaseQueryOptions<T>) | null;

export class DatabaseService<T extends Document> {
    constructor(
        @InjectModel("ModelName") private readonly model: Model<T>,
        private readonly messages: Record<string, string>,
    ) {}

    name() {
        return this.model.modelName;
    }

    count(filter?: FilterQuery<T>, options?: MongoDBQueryOptions<T>) {
        return this.model.countDocuments(filter, options);
    }

    countAll(options?: QueryOptions<T>) {
        return this.model.estimatedDocumentCount(options);
    }

    find(filter: FilterQuery<T> = {}, options?: QueryOptions<T>) {
        return this.model.find(filter, null, options);
    }

    findById(id: string): Promise<T | null> {
        return this.model.findById(id);
    }

    async _findById(id: string): Promise<T> {
        const result = await this.model.findById(id);
        if (!result) throw new NotFoundException(this.messages["NOT_FOUND"] ?? this.name() + "NOT_FOUND");
        return result;
    }

    updateOne(filter?: FilterQuery<T>, update?: UpdateQuery<T>, options?: MongoDBQueryOptions<T>) {
        return this.model.updateOne(filter, update, options);
    }

    updateMany(filter?: FilterQuery<T>, update?: UpdateQuery<T>, options?: MongoDBQueryOptions<T>) {
        return this.model.updateMany(filter, update, options);
    }

    updateAndFind(filter?: FilterQuery<T>, update?: UpdateQuery<T>, options?: QueryOptions<T>) {
        return this.model.findOneAndUpdate(filter, update, options);
    }

    deleteOne(filter?: FilterQuery<T>, options?: MongoDBQueryOptions<T>) {
        return this.model.deleteOne(filter, options);
    }

    deleteAndFind(filter?: FilterQuery<T>, options?: QueryOptions<T>) {
        return this.model.findOneAndDelete(filter, options);
    }

    deleteMany(filter?: FilterQuery<T>, options?: MongoDBQueryOptions<T>) {
        return this.model.deleteMany(filter, options);
    }

    async _updateById(id: string, data: UpdateQuery<T>) {
        const result = await this.model.findByIdAndUpdate(id, data, {
            new: true,
        });
        if (!result) throw new NotFoundException(this.messages["NOT_FOUND"] ?? this.name() + "NOT_FOUND");
        return result;
    }

    async remove(id: string) {
        const result = await this._updateById(id, {
            deletedAt: new Date(),
        });
        return result;
    }

    async delete(id: string) {
        const result = await this.model.findByIdAndDelete(id);
        if (!result) throw new NotFoundException(this.messages["NOT_FOUND"] ?? this.name() + "NOT_FOUND");
        return result;
    }
}
