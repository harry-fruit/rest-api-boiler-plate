import { Server } from "./server";
import logger from "./utils/logger";
import { getAppRouters } from "./utils/routers";

const routersDefinition = getAppRouters();
const server = new Server(routersDefinition);

logger.debug("Server started");
server.run();