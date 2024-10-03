import { getDBsConfigs } from '../configs/__mocks__/configurations';
import { newDatabaseInstance } from '../database/__mocks__/database';
import logger from '../utils/__mocks__/logger';
import { AppRouter } from './router';

// Configuração padrão dos mocks
export const setupMocks = () => {
  // Mock getDBsConfigs
  getDBsConfigs.mockResolvedValue([
    { dbType: 'postgres', schema: 'public', orm: 'typeorm', dbName: 'test_db' },
  ]);

  // Mock newDatabaseInstance
  newDatabaseInstance.mockResolvedValue({
    query: jest.fn(),
    close: jest.fn(),
  });
};
