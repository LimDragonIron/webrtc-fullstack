import type { ConfigType } from '@nestjs/config';
import { registerAs } from '@nestjs/config';

export const authConfig = registerAs('auth', () => ({
  access: {
    secret: process.env.JWT_ACCESS_SECRET ?? '',
    expireIn: process.env.JWT_ACCESS_EXPIRE_IN ?? '30m',
  },
  refresh: {
    secret: process.env.JWT_REFRESH_SECRET ?? '',
    expireIn: process.env.JWT_REFRESH_EXPIRE_IN ?? '30d',
  },
}));

export type AuthConfig = ConfigType<typeof authConfig>;

const generateDatabaseUrl = (
  host = 'localhost',
  port = 3306,
  user = 'root',
  password = '1234',
  schema = 'webrtc',
) => {
  return `mysql://${user}:${password}@${host}:${port}/${schema}`;
};

export const databaseConfig = registerAs('database', () => ({
  url: generateDatabaseUrl(
    process.env.DATABASE_HOST,
    +process.env.DATABASE_PORT,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    process.env.DATABASE_SCHEMA,
  ),
}));

export type DatabaseConfig = ConfigType<typeof databaseConfig>;

const generateRedisDatabaseUrl = (host = 'redis://localhost', port = 6379) => {
  return `${host}:${port}`;
};

export const redisConfig = registerAs('redis', () => ({
  url: generateRedisDatabaseUrl(
    process.env.REDIS_DATABASE_HOST,
    +process.env.REDIS_DATABASE_PORT,
  ),
}));

export const loggerConfig = registerAs("logger", () => ({
  level: process.env.LOG_LEVEL ?? "error",
}))

export type LoggerConfig = ConfigType<typeof loggerConfig>

export type RedisDatabaseConfig = ConfigType<typeof redisConfig>;

export const configuration = [authConfig, databaseConfig, redisConfig, loggerConfig];
