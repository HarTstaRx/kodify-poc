export interface CacheInterface {
  userId: string;
  nick?: string;
  lastMessageId?: string;
}

export interface StoreContextInterface {
  cache: CacheInterface;
  changeCache: (newCache: Partial<CacheInterface>) => void;
}
