export const getDBsConfigs = jest.fn().mockResolvedValue([
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
    dbType: "SQL",
  },
]);

export const loadEnvVariables = jest.fn().mockName("mock_loadEnvVariables");
