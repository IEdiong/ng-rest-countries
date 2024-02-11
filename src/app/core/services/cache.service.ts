import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private cache = new Map<string, any>();

  constructor() {}

  put(url: string, data: any) {
    this.cache.set(url, data);
  }

  get(url: string): any | undefined {
    return this.cache.get(url);
  }

  // If the cache needs to be invalidated
  clear() {
    this.cache.clear();
  }
}
