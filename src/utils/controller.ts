import { Request } from "express";

export class ControllerUtils {

    public static getIdFromParams (req: Request): number | null {
        let id: any = req.params.id;
            
        if (!id || isNaN(parseInt(id))) return null;

        return parseInt(id);
    }

}