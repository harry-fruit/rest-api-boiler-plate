import { Express, json, urlencoded } from "express";
import { Database } from "./database/database";
import { AppRoutersDefinition } from "./utils/routers";
import logger from "./utils/logger";


type SetRoutesParams = {
    app: Express
    dbs: Database[]
    routersDefinition: AppRoutersDefinition[]
}

export const setMiddlewares = (app: Express): void =>{
    app.use(json());
    app.use(urlencoded({ extended: true }));
}


export const setRouters = ({ app, dbs, routersDefinition }: SetRoutesParams) => {
    for (let routerDefinition of routersDefinition) {
        const { name, path, router } = routerDefinition;

        const routerInstance = new router(dbs);
        app.use(path, routerInstance.getRoute());
        
        logger.debug(`[${name}] Router set`);
    }
}