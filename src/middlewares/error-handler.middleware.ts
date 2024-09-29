import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../utils/errorHandlers/BadRequestError";
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";
import { InternalServerError } from "../utils/errorHandlers/InternalServerError";
import { NotFoundError } from "../utils/errorHandlers/NotFoundError";
//TODO: Refactor this

type ErrorConstructor = new (...args: any[]) => Error;
const errorTypes = new Map<ErrorConstructor, string>([
  [PrismaClientKnownRequestError, "PrismaClientKnownRequestError"],
  [PrismaClientValidationError, "PrismaClientValidationError"],
  [InternalServerError, "InternalServerError"],
  [BadRequestError, "BadRequestError"],
  [NotFoundError, "NotFoundError"],
  [TypeError, "TypeError"],
  [Error, "Error"]
]);

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    const { statusCode, getBody } = getErrorHandlerInstance(error);
    console.log(error); //TODO: Format the error message
    res.status(statusCode).send(getBody());
}

const getErrorHandlerInstance = (error: any) => {
    const errorType = getErrorType(error);
    
    //todo: Refactor this
    if (errorType === "PrismaClientKnownRequestError") {
        switch (error.code) {
            case "P2002":
                return new BadRequestError(`Unique field constraint failed on the fields '${error.meta.target.join(", ")}' at '${error.meta.modelName}'`);
            default:
                return new InternalServerError("Something went wrong");
        }
    } 
    
    //todo: Refactor this
    if (errorType === "BadRequestError") { return error; };
    if (errorType === "NotFoundError") { return error; };

    return new InternalServerError("Something went wrong");
}

const getErrorType = (error: any): string => {
    let errorType: string = "Error";

    for (const [type, name] of errorTypes) {
        if (error instanceof type) {
            errorType = name;
            break;
        }
    }

    return errorType;
}
