import { DataSource, DataSourceOptions, DeepPartial, EntityTarget, ObjectLiteral } from "typeorm";
import { TypeORMDatabase } from "../database/orms/typeorm.database";


//TODO: Deverão ser acrescentados outros tipos de orms
export type ORMModel = EntityTarget<ObjectLiteral> //Modelo do ORM
export type ORMDTO<Entity> = DeepPartial<Entity>; //DTO do ORM
export type ORMDBConfig = DataSourceOptions;
export type ORMDatabase = TypeORMDatabase;
