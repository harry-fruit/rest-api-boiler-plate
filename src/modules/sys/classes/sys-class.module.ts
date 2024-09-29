import { SysClassesController } from "./sys-class.controller";
import { SysClassesService } from "./sys-class.service";
import { SysClassesRepository } from "./sys-class.repository";
import { Database } from "../../../database/database";
import { DBType } from "../../../enums/database.enum";


export class SysClassModule {
  protected dbs: Database[];

  constructor(dbs: Database[]) {
    this.dbs = dbs;
  }

  public createController(): SysClassesController {
    const repository = new SysClassesRepository(this.getRepositoryDB());
    const service = new SysClassesService(repository);
    const controller = new SysClassesController(service);

    return controller;
  }

  private getRepositoryDB(): Database {
    const db = this.dbs.find(
      (db) =>
        db.getDBConfigs().dbType === DBType.SQL &&
        db.getDBConfigs().schema === process.env.NODE_ENV
    );

    if (!db) throw new Error("Database not found");

    return db;
  }

}
