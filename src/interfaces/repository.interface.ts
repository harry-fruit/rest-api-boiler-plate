import { IAppResponse } from "./app-response.interface";
import { ORMDTO } from "../types/orm";

export interface IRepository<Entity> {
    save(payload: ORMDTO<Entity>): Promise<IAppResponse<Entity>>;
    getById(id: number): Promise<IAppResponse<Entity>>;
    delete(id: number): Promise<IAppResponse<Entity>>;
}
