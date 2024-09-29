import { SysClasses } from "./sys-class.entity";
import { SysClassesRepository } from "./sys-class.repository";
import { CreateSysClassDTO, UpdateSysClassDTO } from "./sys-class.dto";
import { ErrorHandler } from "../../../utils/error-handler";
import { ORMDTO } from "../../../types/orm";
import { PaginationQueryDTO } from "../../../dtos/paginated-query.dto";
import { PaginatedQueryResult } from "../../../types/paginated-query";
import { IAppResponse } from "../../../interfaces/app-response.interface";
import { ErrorType } from "../../../enums/error-handler.enum";
import { IService } from "../../../interfaces/service.interface";
import { AppResponse } from "../../../utils/app-response";

export class SysClassesService implements IService<SysClasses>{
    private sysClassesRepository: SysClassesRepository;

    constructor(sysClassesRepository: SysClassesRepository) {
        this.sysClassesRepository = sysClassesRepository;
    }

    async create(payload: ORMDTO<SysClasses>): Promise<IAppResponse<SysClasses>> {
        try {
            return await this.sysClassesRepository.save(payload as CreateSysClassDTO);
        } catch (error: any) {
            return AppResponse.handle({ error });
        }
    }

    async update(payload: ORMDTO<SysClasses>): Promise<IAppResponse<SysClasses>> {
        try {
            const { result: existent, error } = await this.sysClassesRepository.getById((payload as UpdateSysClassDTO).id);

            if (error) {
                return AppResponse.handle({ error });
            }

            if (!existent) {
                return { result: null, error: new ErrorHandler({ message: "sysclass not found", type: ErrorType.NOT_FOUND }) };
            }

            return await this.sysClassesRepository.save(payload);
        } catch (error: any) {
            return AppResponse.handle({ error });
        }
    }

    async getById(id: number): Promise<IAppResponse<SysClasses>> {
        try {
            return await this.sysClassesRepository.getById(id);
        } catch (error: any) {
            return AppResponse.handle({ error });
        }
    }

    async getAll(pagination: PaginationQueryDTO): Promise<IAppResponse<PaginatedQueryResult<SysClasses> | SysClasses>> {
        try {
            return await this.sysClassesRepository.getAll(pagination);
        } catch (error: any) {
            return AppResponse.handle({ error });
        }
    }

    async delete(id: number): Promise<IAppResponse<SysClasses>> {
        try {
            const { result: existent, error } = await this.sysClassesRepository.getById(id);

            if (error) { return AppResponse.handle({ error }); }

            if (!existent) {
                return { result: null, error: new ErrorHandler({ 
                    message: "sysclass not found", 
                    type: ErrorType.NOT_FOUND 
                }) };
            }

            return await this.sysClassesRepository.softDelete(id);
        } catch (error: any) {
            return AppResponse.handle({ error });
        }
    }

}