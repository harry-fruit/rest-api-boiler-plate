import { NextFunction, Request, Response } from "express";
import { HttpResponse } from "../../../utils/http-response";
import { StatusCodes } from "http-status-codes"
import { plainToInstance } from "class-transformer";
import { CreateSysClassDTO, UpdateSysClassDTO } from "./sys-class.dto";
import { validate } from "class-validator";
import { SysClassesService } from "./sys-class.service";
import { IController } from "../../../interfaces/controller.interface";
import { PaginationQueryDTO } from "../../../dtos/paginated-query.dto";
import { ControllerUtils } from "../../../utils/controller";

export class SysClassesController implements IController {
    private sysClassesService: SysClassesService;

    constructor(sysClassesService: SysClassesService) {
        this.sysClassesService = sysClassesService;
    }

    public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = ControllerUtils.getIdFromParams(req);
            
            if (!id) { 
                HttpResponse.sendError(res, { statusCode: StatusCodes.BAD_REQUEST, errors: ["invalid ID"] });
                return;
            }

            const { result, error } = await this.sysClassesService.getById(id);

            if (error) {
                HttpResponse.sendError(res, error.toHTTPResponse());
                return;
            }
            
            if (!result) {
                HttpResponse.sendError(res, { statusCode: StatusCodes.NOT_FOUND, errors: ["not found"] });
                return;
            }

            HttpResponse.send(res, { statusCode: StatusCodes.OK, data: result });
        
        } catch (error) {
            next(error);
        }

    }

    public async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dto = plainToInstance(PaginationQueryDTO, req.query);
            const errors = await validate(dto);
    
            if (errors.length > 0) {
                HttpResponse.sendError(res, { statusCode: StatusCodes.BAD_REQUEST, errors: errors });
                return;
            }
            
            const { result, error } = await this.sysClassesService.getAll(dto);

            if (error) {
                HttpResponse.sendError(res, error.toHTTPResponse());
                return;
            }

            HttpResponse.send(res, { statusCode: StatusCodes.OK, data: result });
        } catch (error) {
            next(error);
        }
    }

    public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dto = plainToInstance(CreateSysClassDTO, req.body);
            const errors = await validate(dto);
    
            if (errors.length > 0) {
                HttpResponse.sendError(res, { statusCode: StatusCodes.BAD_REQUEST, errors: errors });
                return;
            }
    
            const { result, error } = await this.sysClassesService.create(dto);
    
            if (error) {
                HttpResponse.sendError(res, error.toHTTPResponse());
                return;
            }
    
            HttpResponse.send(res, { statusCode: StatusCodes.CREATED, data: result });
        } catch (error) {
            next(error);
        }
    }

    public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dto = plainToInstance(UpdateSysClassDTO, req.body);
            const errors = await validate(dto);
        
            if (errors.length > 0) {
                HttpResponse.sendError(res, { statusCode: StatusCodes.BAD_REQUEST, errors: errors });
                return;
            }
    
            const { result, error } = await this.sysClassesService.update(dto);
    
            if (error) {
                HttpResponse.sendError(res, error.toHTTPResponse());
                return;
            }
    
            HttpResponse.send(res, { statusCode: StatusCodes.OK, data: result });
        } catch (error) {
            next(error);
        }
    }    

    public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = ControllerUtils.getIdFromParams(req);
            
            if (!id) { 
                HttpResponse.sendError(res, { statusCode: StatusCodes.BAD_REQUEST, errors: ["invalid ID"] });
                return;
            }

            const { error } = await this.sysClassesService.delete(id);

            if (error) {
                HttpResponse.sendError(res, error.toHTTPResponse());
                return;
            }
            
            HttpResponse.send(res, { statusCode: StatusCodes.OK, message: "deleted" });
        } catch (error) {
            next(error);
        }
    }

}
