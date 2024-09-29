import { loadEnvVariables } from "./configs/configurations";
import { Server } from "./server";
import logger from "./utils/logger";
import { getAppRouters } from "./utils/routers";


loadEnvVariables();

const routersDefinition = getAppRouters();
const server = new Server(routersDefinition);

logger.debug("Server started");

Promise
    .resolve(server.run())
