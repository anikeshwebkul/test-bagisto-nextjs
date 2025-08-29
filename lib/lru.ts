import { LRUCache } from "lru-cache";

const ONE_MINUTE = 1000 * 60;

const options = {
  max: 100, // Max 100 items
  ttl: ONE_MINUTE, // 1 minutes TTL
  allowStale: true,
};

const lruCache = new LRUCache<string, any>(options);

export default lruCache;
