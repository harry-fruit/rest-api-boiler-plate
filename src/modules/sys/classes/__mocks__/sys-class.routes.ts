import { Router } from "express";
import { Database } from "../../../../database/database";
import { AbstractAppRouter } from "../../../../abstract/abstract-app-router";

export class SysClassesRoutes extends AbstractAppRouter {
    private router: Router;
    static path = 'v1/sys/classes';
    static routerName = 'SysClassesRoutes';

  
    constructor(dbs: Database[]) {
        super(dbs);
        this.router = jest.fn<Router, any[]>()();
    }
  
    setRoutes = jest.fn();
    getRoute = jest.fn<Router, any[]>().mockReturnValue(jest.fn<Router, any[]>()());
  }