import { getDBsConfigs } from '../configs/__mocks__/configurations';
import { newDatabaseInstance } from '../database/__mocks__/database';


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
