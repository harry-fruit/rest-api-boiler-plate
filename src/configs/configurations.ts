import dotenv from "dotenv";
import { readFile } from "fs/promises";
import { resolve } from "path";
import { DBConfig } from "../types/database";
import { existsSync } from "fs";

export const loadEnvVariables = () => {
  const envFileName = getEnvFileName();
  const path = resolve(__dirname, "..", "..", envFileName);

  dotenv.config({ path });
  console.log(`Loading .env '${envFileName}'`); //TODO: Logar somente em DEBUG
};

const getEnvFileName = () => {
  const { NODE_ENV } = process.env;

  if (!NODE_ENV) {
    throw new Error("'NODE_ENV' is not set");
  }
  
  const envFileName = `.env.${NODE_ENV.toLocaleLowerCase()}`;
  const envFilePath = resolve(__dirname, "..", "..", envFileName);

  if (!existsSync(envFilePath)) {
    throw new Error(`Environment file '${envFileName}' not found`);
  }

  return envFileName;
};


export const getDBsConfigs = async(fileName: string): Promise<DBConfig[]> => {
  const configsPath = resolve(__dirname, "databases");
  const configJSON = await readFile(resolve(configsPath, `${fileName}.json`), "utf8");
  const dbsConfigs = JSON.parse(configJSON);
  
  if (!dbsConfigs) {
    throw new Error(`Databases config file not found: ${fileName}.json`);
  }

  return dbsConfigs;
}