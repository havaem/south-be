import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import * as mongoose from "mongoose";

abstract class DbSession<T> {
    public abstract start(): Promise<void>;
    public abstract commit(): Promise<void>;
    public abstract end(): Promise<void>;
    public abstract abort(): Promise<void>;

    public abstract get session(): T;
}

@Injectable()
export class DatabaseSession implements DbSession<mongoose.ClientSession> {
    constructor(
        @InjectConnection()
        private readonly connection: mongoose.Connection,
    ) {}

    private _session: mongoose.ClientSession | null = null;

    get session() {
        return this._session;
    }

    public async start() {
        if (this._session) {
            if (this._session.inTransaction()) {
                await this._session.abortTransaction();
                await this._session.endSession();
                throw new Error("Session already in transaction");
            }
            await this._session.endSession();
        }
        this._session = await this.connection.startSession();
        this._session.startTransaction({
            readConcern: { level: "majority" },
            writeConcern: { w: "majority" },
            readPreference: "primary",
            retryWrites: true,
        });
    }

    public async commit() {
        if (!this._session) {
            throw new Error("Session not started");
        }
        await this._session.commitTransaction();
    }

    public async end() {
        if (!this._session) {
            throw new Error("Session not started");
        }
        await this._session.endSession();
    }

    public async abort() {
        if (!this._session) {
            throw new Error("Session not started");
        }
        await this._session.abortTransaction();
    }
}
