import { Router } from "express";
import { Database } from "../database/database";



export abstract class AbstractAppRouter {
    protected readonly dbs: Database[];

    constructor (dbs: Database[]) {
        this.dbs = dbs;
    }

    public abstract setRoutes(dbs: Database[]): void;
    public abstract getRoute(): Router;
}
