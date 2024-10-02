import { DataSource, DataSourceOptions, DeepPartial, EntityTarget, ObjectLiteral } from "typeorm";
import {  DBConfig, DBDataSource } from "../../types/database";
import { PaginationQueryDTO } from "../../dtos/paginated-query.dto";
import { PaginatedQueryResult } from "../../types/paginated-query";
import { IORMDatabase } from "../../interfaces/orm-database.interface";
import { SysClasses } from "../../modules/sys/classes/sys-class.entity";
import { SysStatus } from "../../modules/sys/statuses/sys-status.model";
import { SysCategory } from "../../modules/sys/categories/sys-category.model";
import { SysTypes } from "../../modules/sys/types/sys-type.model";


enum TypeORMDialects {
    POSTGRES = "postgres",
    MSSQL = "mssql" 
}


export class TypeORMDatabase implements IORMDatabase {
    public dataSource: DBDataSource;
    public config: DBConfig;

    constructor(config: DBConfig) {
        this.config = config;
        this.dataSource = this.getDataSource();
    }
    
    public async initialize(): Promise<void> {
        try { 
            this.dataSource = await this.dataSource.initialize();

            if (this.config.synchronize) {
                await this.dataSource.synchronize();
            }

        } catch (error) {
            console.log(error);
        }
    }

    public async getById <Entity>(
        id: number, 
        model: EntityTarget<ObjectLiteral>
    ): Promise<Entity | null> {
        const entity = await this.dataSource.manager.findOne(model, { where: { id } });
        return entity as Entity | null;
    }

    public async getAll <Entity>(
        model: EntityTarget<ObjectLiteral>, 
        pagination: PaginationQueryDTO
    ): Promise<PaginatedQueryResult<Entity>> {
        const { page, limit } = pagination;

        const entities = await this.dataSource.manager.find(model, { 
            take: limit, 
            skip: (page - 1) * limit
        });

        return { 
            page, 
            limit,
            count: entities.length,
            data: entities as Entity[] 
        };
    }

    public async save <Entity>(payload: DeepPartial<Entity>, model: EntityTarget<Entity>): Promise<Entity> { 
        const entity = await this.dataSource.manager.save(model, payload);
        return entity as Entity;
    }

    public async delete(id: number, model: EntityTarget<ObjectLiteral>): Promise<void> {
        await this.dataSource.manager.delete(model, { id });
    }

    public async softDelete(id: number, model: EntityTarget<ObjectLiteral>): Promise<void> {
        await this.dataSource.manager.softDelete(model, { id });
    }

    protected getDataSource(): DataSource {
        return this.dataSource || new DataSource(this.getConfig());
    }

    protected getConfig(): DataSourceOptions {
        const { dialect, host, port, dbName, username, password, synchronize, logging, schema } = this.config;
        const isDebug = process.env.DEBUG?.toLowerCase() === "true";

        return {
            type: dialect as TypeORMDialects.POSTGRES | TypeORMDialects.MSSQL,
            host,
            port,
            username,
            password,
            database: dbName,
            synchronize,
            schema,
            logging: logging ?? isDebug,
            entities: [SysClasses, SysTypes, SysCategory, SysStatus]
        }
    }

}
