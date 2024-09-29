import { Database } from "../../../database/database";
import { DBType } from "../../../enums/database.enum";
import { IAppResponse } from "../../../interfaces/app-response.interface";
import { IRepository } from "../../../interfaces/repository.interface";
import { DBDependency } from "../../../types/database";
import { ORMDTO } from "../../../types/orm";
import { PaginatedQueryResult } from "../../../types/paginated-query";
import { AppResponse } from "../../../utils/app-response";
import { SysClasses } from "./sys-class.entity";

export class SysClassesRepository implements IRepository<SysClasses> {
    public readonly db: Database;
    public static readonly dependsOn: DBDependency[] = [{ type: DBType.SQL }];
    
    constructor(db: Database) {
        this.db = db
    }

    async save(payload: ORMDTO<SysClasses>): Promise<IAppResponse<SysClasses>> {
        try {
            const result = await this.db.save<SysClasses>(payload, SysClasses);
            return AppResponse.handle({ result });
        } catch (error: any) {
            return AppResponse.handle({ error });
        }
    }

    async getById(id: number): Promise<IAppResponse<SysClasses>> {
        try {
            const result = await this.db.getById<SysClasses>(id, SysClasses);
            return AppResponse.handle({ result });
        } catch (error: any) {
            return AppResponse.handle({ error });
        }
    }

    async getAll(paginationParams: any): Promise<IAppResponse<PaginatedQueryResult<SysClasses> | SysClasses>> {
        try {
            const result = await this.db.getAll<SysClasses>(SysClasses, paginationParams);
            return AppResponse.handle({ result });
        } catch (error: any) {
            return AppResponse.handle({ error });
        }
    }

    async delete(id: number): Promise<IAppResponse<SysClasses>> {
        try {
            await this.db.delete(id, SysClasses);
            return AppResponse.handle();
        } catch (error: any) {
            return AppResponse.handle({ error });
        }
    }

    async softDelete(id: number): Promise<IAppResponse<SysClasses>> {
        try {
            await this.db.softDelete(id, SysClasses);
            return AppResponse.handle();
        } catch (error: any) {
            return AppResponse.handle({ error });
        }
    }

}