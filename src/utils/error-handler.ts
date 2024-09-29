import { QueryFailedError } from "typeorm";
import { StatusCodes } from "http-status-codes";
import { HttpResponseData } from "./http-response";
import { ErrorDefinition, ErrorType } from "../enums/error-handler.enum";
import { FormatedError } from "../types/error-handler";


export class ErrorHandler {
    public baseError: any;
    public formatedError: any;
    public errorType: ErrorType;

    constructor(err: any) {
        this.baseError = err;
        this.errorType = this.getErrorType();
        this.formatedError = this.getFormated();
    }

    public toHTTPResponse(): HttpResponseData {
        return {
            statusCode: this.getStatusCode(),
            message: this.formatedError.message,
            errors: [this.formatedError.definition]
        }
    }

    private getFormated(): FormatedError {
        switch (this.errorType) {
            case ErrorType.TYPEORM:
                return this.formatTypeORMError();
            case ErrorType.UNHANDLED:
                return this.formatUnhandledError();
            default:
                return this.formatHandledError();
        }
    }

    private formatHandledError(): FormatedError {
        return {
            type: this.errorType,
            message: ((this.baseError.message as string | undefined) || "unknown error").toLowerCase(),
            definition: ErrorDefinition.UNHANDLED
        }
    }

    private formatUnhandledError(): FormatedError {
        return {
            type: ErrorType.UNHANDLED,
            message: ((this.baseError.message as string | undefined) || "unknown error").toLowerCase(),
            definition: ErrorDefinition.UNHANDLED //TODO - Refact this := Should be set according to the error type
        }
    }

    private formatTypeORMError(): FormatedError {
        switch (this.baseError.driverError.code) {
            case "23505":
                return {
                    type: ErrorType.TYPEORM,
                    message: ((this.baseError.driverError.detail as string | undefined) || "unique constraint violation").toLowerCase(),
                    definition: ErrorDefinition.UNIQUE_CONSTRAINT_VIOLATION
                }
            default:
                return {
                    type: ErrorType.TYPEORM,
                    message: this.baseError.message || "unknow error",
                    definition: ErrorDefinition.UNHANDLED
                };
        }
    }

    private getStatusCode(): number {
        if (this.errorType === ErrorType.TYPEORM) {
            switch (this.formatedError.definition){
                case ErrorDefinition.UNIQUE_CONSTRAINT_VIOLATION:
                    return StatusCodes.BAD_REQUEST;
                default:
                    return StatusCodes.INTERNAL_SERVER_ERROR;
            }
        }

        if (this.errorType === ErrorType.NOT_FOUND) {
            return StatusCodes.NOT_FOUND;
        }

        return StatusCodes.INTERNAL_SERVER_ERROR;
    }

    public getErrorType(): ErrorType {
        if (this.baseError instanceof QueryFailedError) {
            return ErrorType.TYPEORM;
        } else if (this.baseError?.type) {
            return this.baseError.type;
        }

        return ErrorType.UNHANDLED;
    }
 

}