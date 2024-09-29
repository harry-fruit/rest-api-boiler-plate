import { AbstractAppRouter } from "../abstract/abstract-app-router";
import { Database } from "../database/database";
import { SysClassesRoutes } from "../modules/sys/classes/sys-class.routes";

export type AppRoutersDefinition = {
    name: string;
    path: string;
    router: new (dbs: Database[]) => AbstractAppRouter;
}

export const getAppRouters = (): AppRoutersDefinition[] => {
    return [
        { name: SysClassesRoutes.routerName, path: SysClassesRoutes.path, router: SysClassesRoutes },
    ]
}