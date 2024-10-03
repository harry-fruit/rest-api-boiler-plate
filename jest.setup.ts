// jest.setup.ts

// Mock de módulos
jest.mock('./src/configs/configurations');
jest.mock('./src/database/database');
jest.mock('./src/router');
jest.mock('./src/utils/logger');

// Você pode adicionar configurações globais aqui