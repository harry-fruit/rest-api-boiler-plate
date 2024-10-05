import { execute } from "..";
import { loadEnvVariables } from "../configs/configurations";
import { getAppRouters } from "../utils/routers";
import logger from "../utils/logger";


jest.mock("../configs/configurations");
jest.mock("../utils/logger");
jest.mock("../utils/routers");
jest.mock("../server");
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

describe("Index", () => {
  it("should set up the .env variables correctly", async () => {
    await execute();
    expect(getAppRouters).toHaveBeenCalled();
    expect(loadEnvVariables).toHaveBeenCalled();
    expect(logger.debug).toHaveBeenCalledWith("Server started");
  });
});
