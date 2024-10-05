import { loadEnvVariables } from "./configs/configurations";
import { Server } from "./server";
import logger from "./utils/logger";
import { getAppRouters } from "./utils/routers";
import express from "express";

export const execute = async () => {
    loadEnvVariables();
    
    const routersDefinition = getAppRouters();
    const server = new Server(express(), routersDefinition);
    
    logger.debug("Server started");
    await server.run();
};

Promise
    .resolve(execute())
