import { PaginatedQueryResult } from "../types/paginated-query";
import { ErrorHandler } from "../utils/error-handler";

export interface IAppResponse<Entity> {
    result: Entity | PaginatedQueryResult<Entity> | null;
    error: ErrorHandler | null;
}