import { PaginationQueryDTO } from "../dtos/paginated-query.dto";
import { DBType } from "../enums/database.enum";
import { DBConfig } from "../types/database";
import { ORMDatabase, ORMDTO, ORMModel } from "../types/orm";
import { PaginatedQueryResult } from "../types/paginated-query";
import { TypeORMDatabase } from "./orms/typeorm.database";


export class Database {
    public database: ORMDatabase;
    private config: DBConfig;
    
    constructor(config: DBConfig){
        this.config = config;
        this.database = this.getDatabase();
    }

    private getDatabase(): ORMDatabase {
        return this.database || this.getORMDatabase();
    }

    public async initialize(): Promise<void> {
        if (!this.database) throw new Error("Database not instantiated");
        await this.database.initialize();
    }

    private getORMDatabase(): ORMDatabase {
        switch (this.config.dbType) {
            case DBType.SQL:
                return this.getRelationalDB();
            default:
                throw new Error("Database type not supported");
        }
    }

    public getDBConfigs(): Pick<DBConfig, "unique" | "dbName" | "dbType" | "orm" | "dialect" | "schema"> {
        return {
            unique: this.config.unique,
            schema: this.config.schema,
            dbName: this.config.dbName,
            dbType: this.config.dbType,
            orm: this.config.orm,
            dialect: this.config.dialect,
        }
    }

    private getRelationalDB(): ORMDatabase {
        switch (this.config.orm) {
            default:
                return new TypeORMDatabase(this.config);
        }
    }
    
    public async getById <Entity>(id: number, model: ORMModel): Promise<Entity | null> {
        return this.database.getById(id, model);
    }

    public async getAll <Entity>(model: ORMModel, pagination: PaginationQueryDTO): Promise<PaginatedQueryResult<Entity>> {
        return this.database.getAll(model, pagination);
    }

    public async save <Entity>(payload: ORMDTO<Entity>, model: ORMModel): Promise<Entity> {
        return this.database.save(payload, model as any);
    }

    public async delete(id: number, model: ORMModel): Promise<void> {
        this.database.delete(id, model);
    }

    public async softDelete(id: number, model: ORMModel): Promise<void> {
        this.database.softDelete(id, model);
    }

}

export const newDatabaseInstance = async (config: DBConfig): Promise<Database> => {
    const database = new Database(config);
    await database.initialize();

    return database;
}
