import { Router } from "express";
import { Database } from "../database/database";

export interface IAppRouter {
    readonly path: string;
    readonly dbs: Database[];
    
    getRoute(): Router;
    setRoutes(dbs: Database[]): void;
}