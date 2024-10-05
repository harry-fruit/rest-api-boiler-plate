import { getDBsConfigs } from '../configs/__mocks__/configurations';
import { newDatabaseInstance } from '../database/__mocks__/database';
import logger from '../utils/logger';


//TODO: Refazer helpers
// Configuração padrão dos mocks
export const setupMocks = () => {
  getDBsConfigs.mockResolvedValue([
    { dbType: 'postgres', schema: 'public', orm: 'typeorm', dbName: 'test_db' },
  ]);

  // Mock newDatabaseInstance
  newDatabaseInstance.mockResolvedValue({
    query: jest.fn(),
    close: jest.fn(),
  });
};


export const setupExpressMocks = () => {
  jest.mock("express", () => {
    const actualExpress = jest.requireActual("express"); // Import actual express
    const mockExpressDefault = {
      listen: jest.fn().mockImplementation((port, callback) => {
        callback();
        logger.info(`Server is running on port ${port}`);
      }),
      // listen: jest.fn(),
      use: jest.fn(),
    };
  
    // Mock the default export (express function) and include named exports
    return {
      __esModule: true,
      ...actualExpress,
      default: jest.fn(() => mockExpressDefault),
      json: jest.fn(),
      urlencoded: jest.fn(),
    };
  });
}