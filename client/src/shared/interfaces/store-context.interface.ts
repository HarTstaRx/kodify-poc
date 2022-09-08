export interface CacheInterface {
  nick?: string;
  id: string;
}

export interface StoreContextInterface {
  cache: CacheInterface;
  changeCache: (newCache: Partial<CacheInterface>) => void;
}
