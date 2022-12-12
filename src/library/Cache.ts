import { RedisClientType, createClient } from "redis";
import { config } from "../config/config";
import Logger from "../library/Logger";

export class RedisCache {
    private readonly cache: RedisClientType;
    private ttl: number;

    constructor(ttl: number) {
        this.ttl = ttl;
        this.cache = createClient({
            url: config.redis.url
        });

        this.cache.on('error', (err) => {
            Logger.error(err);
        });

        this.cache.on('connect', () => {
            Logger.info('Redis connection established');
        });

        this.cache.on('ready', () => {
            Logger.info('Redis ready');
        });

        this.cache.on('reconnecting', () => {
            Logger.info('Redis reconnecting');
        });

        this.cache.connect().then(() => {
            Logger.info('Redis connected');
        }).catch((err) => {
            Logger.error(err);
        }
        );
    }
}
