export const getAppRouters = jest.fn().mockReturnValue([
    {
        name: "SysClassesRoutes",
        path: "v1/sys/classes",
        router: jest.fn(),
    },
]);