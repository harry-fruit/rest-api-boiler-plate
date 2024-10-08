export type FakeEntityData = {
    id: number;
    uniqueCode: string;
    description: string;
}

export const TypeORMDatabase = jest.fn().mockImplementation(() => {
  let initialized = false;

  return {
    get isInitialized() {
      return initialized;
    },
    initialize: jest.fn().mockImplementation(() => {
      initialized = true;
      return Promise.resolve();
    }),
    getById: jest.fn().mockReturnValue(
      Promise.resolve({
        id: 1,
        uniqueCode: "TEST_CODE",
        description: "TEST_DESCRIPTION",
      })
    ),
    getAll: jest.fn().mockReturnValue(Promise.resolve({
        page: 1,
        limit: 10,
        count: 10,
        data: getAllFakeData
    })),
    save: jest.fn(({ uniqueCode, description }: Partial<FakeEntityData>) => {
      const id = Math.floor(Math.random() * 20) + 1;
      return Promise.resolve({
        id,
        uniqueCode,
        description
      });
    }),
    delete: jest.fn().mockResolvedValue(undefined),
    softDelete: jest.fn().mockResolvedValue(undefined),
  };
});

export const getAllFakeData = [...Array(10).keys()].map(i => ({
  id: i + 1,
  uniqueCode: `TEST_CODE_${i + 1}`,
  description: `TEST_DESCRIPTION_${i + 1}`,
}));
