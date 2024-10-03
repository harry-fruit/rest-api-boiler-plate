export const newDatabaseInstance = jest.fn().mockResolvedValue({
    // Propriedades mockadas conforme a interface Database
    query: jest.fn(),
    // close: jest.fn(),
  });