// src/utils/cache.js
const cache = new Map();

export const getCache = (key) => {
  const item = cache.get(key);
  if (!item) {
    return null;
  }
  if (Date.now() > item.expiry) {
    cache.delete(key);
    return null;
  }
  return item.data;
};

export const setCache = (key, data, ttl) => {
  const expiry = Date.now() + ttl;
  cache.set(key, { data, expiry });
};
