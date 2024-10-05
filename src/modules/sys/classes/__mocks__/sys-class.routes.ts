import { Database } from "../../../../database/database";

export const SysClassesRoutes = jest.fn().mockImplementation((dbs: Database[]) => {
    return {
        setRoutes: jest.fn(),
        getRoute: jest.fn(),
    };
});