import express from "express";
import { setupMocks } from "../__mocks__/mockHelper";
import { Server } from "../server";
import { getDBsConfigs } from "../configs/__mocks__/configurations";
import { newDatabaseInstance } from "../database/__mocks__/database";
import { SysClassesRoutes } from "../modules/sys/classes/__mocks__/sys-class.routes";
import logger from "../utils/logger"; // o caminho para o seu logger

const mockRouters = [{ name: "test", path: "/test", router: SysClassesRoutes }];
const env = process.env;

jest.mock("../utils/logger", () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
}));

jest.mock("express", () => {
  const mockApp = {
    listen: jest.fn().mockImplementation((port, callback) => {
      callback();
      logger.info(`Server is running on port ${port}`);
    }),
    use: jest.fn(),
  };
  return () => mockApp;
});

beforeEach(() => {
  process.env = env;
  jest.clearAllMocks();
  setupMocks();
});

describe("Server", () => {

  it("should start the server correctly", async () => {
    process.env = {
      ...process.env,
      APP_PORT: "4000",
      DATABASES_CONFIG_FILE_NAME: "dbConfig.json",
    };

    const server = new Server(express(), mockRouters);
    await server.run();

    expect(getDBsConfigs).toHaveBeenCalledWith("dbConfig.json");
    expect(newDatabaseInstance).toHaveBeenCalledWith({
      dbType: "postgres",
      schema: "public",
      orm: "typeorm",
      dbName: "test_db",
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
    console.log(process.env.DATABASES_CONFIG_FILE_NAME);

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

    getDBsConfigs.mockResolvedValue([]);
    const server = new Server(express(), mockRouters);

    await expect(server.run()).rejects.toThrow("Databases not initialized");
    expect(getDBsConfigs).toHaveBeenCalledWith("wrong_config.json");
  });

  it("should throw an error if the port is not defined", async () => {
    process.env = {
      ...process.env,
      DATABASES_CONFIG_FILE_NAME: "dbConfig.json",
    };
    
    try {
      new Server(express(), mockRouters);
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("APP_PORT not found in .env file");
    }
  });
});
