import { IAppResponse } from "./app-response.interface";
import { ORMDTO } from "../types/orm";
import { PaginatedQueryResult } from "../types/paginated-query";


export interface IService<Entity> {
    create(payload: ORMDTO<Entity>): Promise<IAppResponse<Entity>>;
    update(payload: ORMDTO<Entity>): Promise<IAppResponse<Entity>>;
    getById(id: number): Promise<IAppResponse<Entity>>;
    getAll(paginationParams: any): Promise<IAppResponse<PaginatedQueryResult<Entity> | Entity>>;
    delete(id: number): Promise<IAppResponse<Entity>>;
}
