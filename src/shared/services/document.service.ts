import { NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CountOptions } from "mongodb";
import {
    CreateOptions,
    Document,
    FilterQuery,
    Model,
    MongooseBaseQueryOptions,
    QueryOptions,
    UpdateQuery,
} from "mongoose";

import { convertMessage } from "../utils";

type MongoDBQueryOptions<T> = (CountOptions & MongooseBaseQueryOptions<T>) | null;

export class DatabaseService<T extends Document> {
    constructor(
        @InjectModel("ModelName") private readonly model: Model<T>,
        private readonly messages: Record<string, string>,
    ) {}

    get _model() {
        return this.model;
    }

    name() {
        return this.model.modelName;
    }

    count(filter?: FilterQuery<T>, options?: MongoDBQueryOptions<T>) {
        return this.model.countDocuments(filter, options);
    }

    create(data: Partial<T>): Promise<T> {
        return this.model.create(data);
    }

    createMany(data: Array<Partial<T>>, options?: CreateOptions): Promise<T[]> {
        return this.model.create(data, options);
    }

    countAll(options?: QueryOptions<T>) {
        return this.model.estimatedDocumentCount(options);
    }

    find(filter: FilterQuery<T> = {}, options?: QueryOptions<T>) {
        return this.model.find(filter, null, options);
    }

    /**
     * Find a document based on the filter and options provided
     * @param filter {FilterQuery<T>} - filter conditions
     * @param options {QueryOptions<T>} - query options
     * @returns {Promise<Array<T>>} - returns an array of documents if found
     * @throws {NotFoundException} - throws NotFoundException if no documents are found
     */
    async _find(filter: FilterQuery<T> = {}, options?: QueryOptions<T>): Promise<Array<T>> {
        const result = await this.find(filter, options);
        if (result.length === 0) throw new NotFoundException(this.messages["NOT_FOUND"] ?? this.name() + "NOT_FOUND");
        return result;
    }

    async findById(id: string): Promise<T | null> {
        return this.model.findById(id);
    }

    /**
     * Find a document by id and throw NotFoundException if not found
     * @param id {string} - id of the document
     * @returns {Promise<T>} - returns the document if found
     * @throws {NotFoundException} - throws NotFoundException if document is not found
     */
    async _findById(id: string): Promise<T> {
        const result = await this.model.findById(id);
        if (!result)
            throw new NotFoundException(this.messages["NOT_FOUND"] ?? convertMessage(this.name() + "_NOT_FOUND"));
        return result;
    }

    /**
     * Find a single document based on the filter and options provided
     * @param filter {FilterQuery<T>} - filter conditions
     * @param options {QueryOptions<T>} - query options
     * @returns {Promise<T | null>} - returns the document if found, null otherwise
     */
    async findOne(filter: FilterQuery<T>, options?: QueryOptions<T>): Promise<T | null> {
        return this.model.findOne(filter, null, options);
    }

    /**
     * Find a single document based on the filter and options provided and throw NotFoundException if not found
     * @param filter {FilterQuery<T>} - filter conditions
     * @param options {QueryOptions<T>} - query options
     * @returns {Promise<T>} - returns the document if found
     * @throws {NotFoundException} - throws NotFoundException if document is not found
     */
    async _findOne(filter: FilterQuery<T>, options?: QueryOptions<T>): Promise<T> {
        const result = await this.findOne(filter, options);
        if (!result)
            throw new NotFoundException(this.messages["NOT_FOUND"] ?? convertMessage(this.name() + "_NOT_FOUND"));
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
