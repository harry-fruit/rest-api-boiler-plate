import { Express, json, urlencoded } from "express";
import { Database } from "./database/database";
import { AppRoutersDefinition } from "./utils/routers";
import logger from "./utils/logger";


export class AppRouter {
    private app: Express;
    private dbs: Database[];
    
    constructor(app: Express, dbs: Database[]) {
        this.app = app;
        this.dbs = dbs;
    }

    public setRoutes(routersDefinition: AppRoutersDefinition[]): void {
        this.setMiddlewares();
        
        for (let routerDefinition of routersDefinition) {
            const { name, path, router } = routerDefinition;

            const routerInstance = new router(this.dbs);
            this.app.use(path, routerInstance.getRoute());
            
            logger.debug(`[${name}] Router set`);
        }

        // TODO: Add error handler
        // Middleware - Error handler
        // app.use(errorHandler);

    }

    private setMiddlewares(): void {
        this.app.use(json());
        this.app.use(urlencoded({ extended: true }));
    }

}