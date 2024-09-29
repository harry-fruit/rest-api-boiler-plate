import { ErrorDefinition, ErrorType } from "../enums/error-handler.enum";

export type FormatedError = {
    type: ErrorType;
    message: string;
    definition: ErrorDefinition;
}