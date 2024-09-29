import { ValidationError } from "class-validator";
import { Response } from "express";
import { getReasonPhrase } from "http-status-codes"

export interface HttpResponseData {
    statusCode: number;
    message?: string;
    data?: any;
    errors?: any[];
}


export class HttpResponse {

    public static send(res: Response, httpResponseData: HttpResponseData): void {
        const { statusCode, message, data } = httpResponseData;
        
        res.status(statusCode).json({
            statusCode: statusCode,
            message: (message || getReasonPhrase(statusCode)),
            data: (data || null)
        });
    }

    public static sendError(res: Response, httpResponseData: HttpResponseData): void {
        const { statusCode, message, errors } = httpResponseData;
        
        res.status(statusCode).json({
            statusCode: statusCode,
            message: (message || getReasonPhrase(statusCode)),
            errors: this.getErrors(errors)
        });
    }

    private static getErrors(errors: any[] | undefined): any[] {
        const result: any[] = [];
        
        if (!errors || errors.length === 0) {
            return result;
        }
        
        for (let error of errors) {

            if (error instanceof ValidationError) {
                result.push({
                    property: error.property,
                    constraints: error.constraints
                });
            } else {
                result.push(error);
            }

        }

        return result;
    }

}