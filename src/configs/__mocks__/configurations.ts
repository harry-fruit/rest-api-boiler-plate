import { DBType } from "../../enums/database.enum";

export const getDBsConfigs = jest.fn().mockReturnValue([
  {
    unique: "PG_DATABASE",
    dialect: "postgres",
    host: "localhost",
    port: 5432,
    username: "admin",
    password: "admin",
    dbName: "tasks_module",
    schema: "DEV",
    synchronize: true,
    logging: false,
    orm: "TYPEORM",
    dbType: DBType.SQL,
  },
]);

export const loadEnvVariables = jest.fn();
export const getEnvFileName = jest.fn();