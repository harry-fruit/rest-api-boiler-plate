import * as configurations from "../configurations";
import { resolve } from "path";
import { config } from "dotenv";
import logger from "../../utils/logger";
import fs from "fs";
import fsPromise from "fs/promises";

jest.mock("../../utils/logger");
jest.mock("dotenv", () => {
  return {
    config: jest.fn().mockImplementation(() => {
      process.env.THIS_IS = "A_TEST";
    }),
  };
});
jest.mock("path", () => {
  return {
    resolve: jest.fn().mockImplementation((...args: string[]) => {
      return args.join("/");
    }),
  };
});


beforeEach(() => {
  jest.clearAllMocks();
});

describe("Configurations", () => {
  describe("loadEnvVariables", () => {
    it("should load the .env variables correctly", () => {
      process.env = {
        ...process.env,
        NODE_ENV: "test",
      };

      const getEnvFileNameSpy = jest.spyOn(configurations, "getEnvFileName");

      configurations.loadEnvVariables();

      expect(config).toHaveBeenCalled();
      expect(resolve).toHaveBeenCalled();
      expect(getEnvFileNameSpy).toHaveBeenCalled();
      expect(process.env.NODE_ENV).toBe("test");
      expect(process.env.THIS_IS).toBe("A_TEST");
      expect(logger.debug).toHaveBeenCalledWith("Loading .env '.env.test'");
    });
  });

  describe("getEnvFileName", () => {
    it("should return the correct file name", () => {
      process.env = {
        ...process.env,
        NODE_ENV: "test",
      };

      const getEnvFileName = configurations.getEnvFileName();

      expect(getEnvFileName).toBe(".env.test");
      expect(resolve).toHaveBeenCalled();
      expect(process.env.NODE_ENV).toBe("test");
    });

    it("should throw an error if NODE_ENV is not set", () => {
      process.env = {
        ...process.env,
        NODE_ENV: "",
      };

      try {
        configurations.getEnvFileName();
      } catch (error: any) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe("'NODE_ENV' is not set");
        expect(resolve).not.toHaveBeenCalled();
        expect(process.env.NODE_ENV).toBe("");
      }
    });

    it("should throw an error if the environment file is not found", () => {
      process.env = {
        ...process.env,
        NODE_ENV: "test123",
      };

      const existsSyncSpy = jest.spyOn(fs, "existsSync");

      try {
        configurations.getEnvFileName();
      } catch (error: any) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe("Environment file '.env.test123' not found");
        expect(resolve).toHaveBeenCalled();
        expect(process.env.NODE_ENV).toBe("test123");
        expect(existsSyncSpy).toHaveBeenCalled();
      }
    });
  });

  describe("getDBsConfigs", () => {
    it("should return the database configs correctly", async () => {
      const fileName = "databases";

      const existsSyncSpy = jest.spyOn(fs, "existsSync");
      const readFileSpy = jest.spyOn(fsPromise, "readFile");
      const jsonSpy = jest.spyOn(JSON, "parse");

      await configurations.getDBsConfigs(fileName);

      expect(existsSyncSpy).toHaveBeenCalled();
      expect(readFileSpy).toHaveBeenCalled();
      expect(jsonSpy).toHaveBeenCalled();
    });

    it("should throw an error if the database configs file is not found", async () => {
      const fileName = "wrong_databases";

      const existsSyncSpy = jest.spyOn(fs, "existsSync");
      const readFileSpy = jest.spyOn(fsPromise, "readFile");
      const jsonSpy = jest.spyOn(JSON, "parse");

      try {
        await configurations.getDBsConfigs(fileName);
      } catch (error: any) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe(
          "Databases config file not found: wrong_databases"
        );
        expect(existsSyncSpy).toHaveBeenCalled();
        expect(readFileSpy).not.toHaveBeenCalled();
        expect(jsonSpy).not.toHaveBeenCalled();
      }
    });

    it("should throw an error if the database configs file is empty", async () => {
      const fileName = "databases";

      const existsSyncSpy = jest.spyOn(fs, "existsSync");
      const readFileSpy = jest.spyOn(fsPromise, "readFile");
      const jsonSpy = jest.spyOn(JSON, "parse");

      jsonSpy.mockReturnValue(null);

      try {
        await configurations.getDBsConfigs(fileName);
      } catch (error: any) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe(
          "Databases config file not found: databases"
        );
        expect(existsSyncSpy).toHaveBeenCalled();
        expect(readFileSpy).toHaveBeenCalled();
        expect(jsonSpy).toHaveBeenCalled();
        expect(jsonSpy.mock.results[0].value).toBe(null);
      }
    });
  });
});
