import express from "express";
import logger from "../utils/logger";
import { setupMocks } from "../__mocks__/mockHelper";
import { Server } from "../server";
import { newDatabaseInstance } from "../database/__mocks__/database";
import { SysClassesRoutes } from "../modules/sys/classes/sys-class.routes";
import { getDBsConfigs } from "../configs/configurations";


jest.mock("../configs/configurations");
jest.mock("../utils/logger");
jest.mock("../modules/sys/classes/sys-class.routes");
jest.mock("express", () => {
  const actualExpress = jest.requireActual("express"); // Import actual express
  const mockExpressDefault = {
    listen: jest.fn().mockImplementation((port, callback) => {
      callback();
      logger.info(`Server is running on port ${port}`);
    }),
    use: jest.fn(),
  };

  return {
    __esModule: true,
    ...actualExpress,
    default: jest.fn(() => mockExpressDefault),
    json: jest.fn(),
    urlencoded: jest.fn(),
  };
});

beforeEach(() => {
  process.env = env;
  jest.clearAllMocks();
  setupMocks();
});

const env = process.env;
const mockRouters = [{ name: "test", path: "/test", router: SysClassesRoutes }];

describe("Server", () => {
  it("should start the server correctly", async () => {
    process.env = {
      ...process.env,
      APP_PORT: "4000",
      DATABASES_CONFIG_FILE_NAME: "databases",
    };

    const server = new Server(express(), mockRouters);
    await server.run();

    expect(getDBsConfigs).toHaveBeenCalledWith("databases");
    expect(newDatabaseInstance).toHaveBeenCalledWith({
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
    });
    expect(express().listen).toHaveBeenCalled();
    expect(express().listen).toHaveBeenCalledWith(4000, expect.any(Function));
    expect(logger.info).toHaveBeenCalledWith("Server is running on port 4000"); // Verifica se a mensagem foi chamada
  });

  it("should throw an error if DATABASES_CONFIG_FILE_NAME is not defined", async () => {
    process.env = {
      ...process.env,
      APP_PORT: "4000",
    };

    const server = new Server(express(), mockRouters);
    await expect(server.run()).rejects.toThrow(
      "DATABASES_CONFIG_FILE_NAME not found in .env file"
    );
  });

  it("should throw an error if the databases are not initialized", async () => {
    process.env = {
      ...process.env,
      APP_PORT: "4000",
      DATABASES_CONFIG_FILE_NAME: "wrong_config.json",
    };

    (getDBsConfigs as jest.Mock).mockResolvedValue([]);
    const server = new Server(express(), mockRouters);

    await expect(server.run()).rejects.toThrow("Databases not initialized");
  });

  it("should throw an error if the port is not defined", async () => {
    process.env = {
      ...process.env,
      DATABASES_CONFIG_FILE_NAME: "databases",
    };

    try {
      new Server(express(), mockRouters);
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("APP_PORT not found in .env file");
    }
  });
});
