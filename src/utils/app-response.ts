import { IAppResponse } from "../interfaces/app-response.interface";


export class AppResponse {
    public static handle<Entity>(params?: Partial<IAppResponse<Entity>>): IAppResponse<Entity> {
        if (!params) {
            return { result: null, error: null };
        }
        
        const { result, error } = params;
        
        if (error) {
            return { result: null, error: error };
        }

        return { result: (result || null), error: null };
    }
}
