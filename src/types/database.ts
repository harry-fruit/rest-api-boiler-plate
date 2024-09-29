import { DataSource as TypeORMDataSource } from "typeorm";
import { Database } from "../database/database";
import { DBDialects, DBORMs, DBType } from "../enums/database.enum";


export type DBDependency = {
    orm?: DBORMs;
    dialect?: DBDialects;
    type: DBType;
}

export type DatabaseInstanceDefinition = {
    orm: DBORMs;
    dialect: DBDialects;
    instance: Database;
    type: DBType;
}

export type SQLDatabaseConfig = {
    unique: string;
    dbType: DBType;
    dialect: string;
    host: string;
    port: number;
    username: string;
    password: string;
    dbName: string;
    synchronize: boolean;
    logging: boolean;
    orm: string;
    schema: string;
}


export type DBDataSource = TypeORMDataSource //| Mongoose Datasource;
export type DBConfig = SQLDatabaseConfig;