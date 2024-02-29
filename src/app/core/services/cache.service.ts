import { Injectable } from '@angular/core';
import { ICountry } from '@shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private cache = new Map<string, ICountry[]>();

  put(url: string, data: ICountry[]) {
    this.cache.set(url, data);
  }

  get(url: string): ICountry[] | undefined {
    return this.cache.get(url);
  }

  // If the cache needs to be invalidated
  clear() {
    this.cache.clear();
  }
}
