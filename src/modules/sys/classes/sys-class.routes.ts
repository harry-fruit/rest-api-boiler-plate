import { SysClassModule } from "./sys-class.module";
import { Database } from "../../../database/database";
import { Router } from "express";
import { AbstractAppRouter } from "../../../abstract/abstract-app-router";


export class SysClassesRoutes extends AbstractAppRouter{
    private router: Router;
    public static readonly path = "v1/sys/classes";
    public static readonly routerName = "SysClassesRoutes";


    constructor(dbs: Database[]) {
        super(dbs);
        this.router = Router();
        
        this.setRoutes();
    }

    public setRoutes() {
        const module = new SysClassModule(this.dbs);
        const controller = module.createController();

        this.router.post("/", controller.create.bind(controller));
        this.router.get("/:id", controller.getById.bind(controller));
        this.router.get("/", controller.getAll.bind(controller));
        this.router.put("/", controller.update.bind(controller));
        this.router.delete("/:id", controller.delete.bind(controller));
    }

    public getRoute(): Router {
        return this.router;
    }

}
