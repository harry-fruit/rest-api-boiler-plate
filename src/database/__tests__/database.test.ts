import { DBType } from "../../enums/database.enum";
import { SysClasses } from "../../modules/sys/classes/sys-class.entity";
import { DBConfig } from "../../types/database";
import { Database } from "../database";
import { FakeEntityData } from "../orms/__mocks__/typeorm.database";
import { TypeORMDatabase } from "../orms/typeorm.database";


jest.mock("../orms/typeorm.database");
jest.mock("../../modules/sys/classes/sys-class.entity");

beforeEach(() => {
  jest.clearAllMocks();
});

let dbConfig: DBConfig

describe("Database", () => {

  describe("SQL Database", () => {
    beforeAll(() => {
      dbConfig = {
        unique: "PG_DATABASE",
        dialect: "postgres",
        host: "localhost",
        port: 5432,
        username: "admin",
        password: "admin",
        dbName: "tasks_module",
        schema: "DEV",
        synchronize: true,
        logging: false,
        orm: "TYPEORM",
        dbType: DBType.SQL,
      };
    });

    it("should instantiate a database", () => {
      const databaseInstance = new Database(dbConfig);

      expect(databaseInstance.database).toBeDefined();
      expect(TypeORMDatabase).toHaveBeenCalledWith(dbConfig);
      expect(databaseInstance).toBeDefined();
    });
  
    it("should initialize the database", async () => {
      const databaseInstance = new Database(dbConfig);
      
      expect(databaseInstance.database).toBeDefined();
      expect(databaseInstance.database.isInitialized).toBeFalsy();
      await databaseInstance.initialize();
      expect(databaseInstance.database.isInitialized).toBeTruthy();
    });

    it("should return the database configurations", () => {
      const databaseInstance = new Database(dbConfig);
      const dbConfigs = databaseInstance.getDBConfigs();

      expect(dbConfigs).toBeDefined();
      expect(dbConfigs.unique).toBe(dbConfig.unique);
      expect(dbConfigs.schema).toBe(dbConfig.schema);
      expect(dbConfigs.dbName).toBe(dbConfig.dbName);
      expect(dbConfigs.dbType).toBe(dbConfig.dbType);
      expect(dbConfigs.orm).toBe(dbConfig.orm);
      expect(dbConfigs.dialect).toBe(dbConfig.dialect);
    });

    it("should get entity by id", async () => {
      const id = 1;
      const databaseInstance = new Database(dbConfig);
      const entity: SysClasses | null = await databaseInstance.getById(id, SysClasses);

      expect(entity).toBeDefined();
      expect(entity?.id).toBe(id);
      expect(entity?.uniqueCode).toBe("TEST_CODE");
      expect(entity?.description).toBe("TEST_DESCRIPTION");
    });

    it("should get all entities paginated", async () => {
      const page = 1
      const limit = 10
      const databaseInstance = new Database(dbConfig);
      const entities = await databaseInstance.getAll<FakeEntityData>(SysClasses, { page, limit });

      expect(entities).toBeDefined();
      expect(entities.page).toBe(page);
      expect(entities.limit).toBe(limit);
      expect(entities.count).toBe(10);
      expect(entities.data).toBeDefined();

      for (let i = 0; i < entities.data.length; i++) {
        expect(entities.data[i].id).toBe(i + 1);
        expect(entities.data[i].uniqueCode).toBe(`TEST_CODE_${i + 1}`);
        expect(entities.data[i].description).toBe(`TEST_DESCRIPTION_${i + 1}`);
      }
      
    });

  });


  it("should throw an error if Database type is not supported", async () => {
    try {
      new Database({
        ...dbConfig,
        dbType: "WRONG_DB_TYPE" as DBType,
      });
      
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("Database type not supported");
    }
  });
});
