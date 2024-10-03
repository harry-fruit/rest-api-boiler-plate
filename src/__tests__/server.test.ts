import express from 'express';
import { setupMocks } from '../__mocks__/mockHelper';
import { Server } from '../server';
import { getDBsConfigs } from '../configs/__mocks__/configurations';
import { newDatabaseInstance } from '../database/__mocks__/database';
import logger from '../utils/__mocks__/logger';
import { SysClassesRoutes } from '../modules/sys/classes/__mocks__/sys-class.routes';

// const mockListen = jest.fn((port, callback) => {
//   callback(); // Simula a chamada do callback imediatamente
// });

// Mock the express() function and the listen method on the app instance
jest.mock('express', () => {
  const mockApp = {
    listen: jest.fn(),
    use: jest.fn(),
  };
  return () => mockApp; // Return the mock app when express() is called
});

beforeEach(() => {
  jest.resetAllMocks();
  setupMocks();
  process.env = { ...process.env, APP_PORT: '4000', DATABASES_CONFIG_FILE_NAME: 'dbConfig.json' };
});

describe('Server', () => {
  it('should start the server correctly', async () => {
    const mockRouters = [
      { name: 'test', path: '/test', router: SysClassesRoutes },
    ];
    
    const server = new Server(mockRouters);

    await server.run();

    expect(getDBsConfigs).toHaveBeenCalledWith('dbConfig.json');
    expect(newDatabaseInstance).toHaveBeenCalledWith({
      dbType: 'postgres',
      schema: 'public',
      orm: 'typeorm',
      dbName: 'test_db',
    });
    expect(express().listen).toHaveBeenCalledWith('4000', expect.any(Function));
    // expect(logger.info).toHaveBeenCalledWith('Server is running on port 4000');
  });

  // Other tests...
});
