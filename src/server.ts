import express, { Express } from "express";
import { getDBsConfigs } from "./configs/configurations";
import { Database, newDatabaseInstance } from "./database/database";
import { AppRouter } from "./router";
import { AppRoutersDefinition } from "./utils/routers";
import logger from "./utils/logger";


export class Server {
    public readonly port: number;
    public routers: AppRoutersDefinition[];
    private app: Express;
    private dbs?: Database[];

    constructor(app: Express, routers: AppRoutersDefinition[]) {
        this.app = app;
        this.routers = routers;
        this.port = this.getPort();
    }
    
    public async run() {
        this.dbs = await this.getDatabases();
        this.setAppRouters();

        this.app.listen(this.port, () => {
            logger.info(`Server is running on port ${this.port}`);
        });
    }

    private async getDatabases(): Promise<Database[]> {
        const { DATABASES_CONFIG_FILE_NAME } = process.env;

        if (!DATABASES_CONFIG_FILE_NAME) {
            throw new Error("DATABASES_CONFIG_FILE_NAME not found in .env file");
        }

        const dbsConfig = await getDBsConfigs(DATABASES_CONFIG_FILE_NAME); //TODO: Pegar nome do arquivo a partir do .env
        const databases: Database[] = [];
        
        for (let dbConfig of dbsConfig) {
            databases.push(await newDatabaseInstance(dbConfig));
            logger.debug(`[${dbConfig.dbType} - ${dbConfig.schema} - ${dbConfig.orm}] Database ${dbConfig.dbName} initialized`);
        }

        return databases;
    }

    private setAppRouters() {
        if (!this.dbs || this.dbs.length === 0) {
            throw new Error("Databases not initialized");
        }

        const appRouter = new AppRouter(this.app, this.dbs);
        appRouter.setRoutes(this.routers);
        logger.debug("App routers set");
    }

    private getPort(): number {
        const port = process.env.APP_PORT;
        
        if (!port) {
            throw new Error("APP_PORT not found in .env file");
        }

        return parseInt(port);
    }

}
