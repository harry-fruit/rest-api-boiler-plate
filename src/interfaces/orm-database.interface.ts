import { PaginationQueryDTO } from "../dtos/paginated-query.dto";
import { DBConfig, DBDataSource } from "../types/database";
import { ORMDTO, ORMModel } from "../types/orm";
import { PaginatedQueryResult } from "../types/paginated-query";

export interface IORMDatabase {
    dataSource: DBDataSource;
    config: DBConfig;

    initialize(): void;
    getById<Entity>(id: number, model: ORMModel): Promise<Entity | null>;
    getAll<Entity>(model: ORMModel, pagination: PaginationQueryDTO): Promise<PaginatedQueryResult<Entity>>;
    save<Entity>(payload: ORMDTO<Entity>, model: ORMModel): Promise<Entity>;
    delete(id: number, model: ORMModel): Promise<void>;
    softDelete(id: number, model: ORMModel): Promise<void>;
};
