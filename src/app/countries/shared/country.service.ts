import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private url = 'https://restcountries.com/v2/all';

  constructor(private http: HttpClient) {}

  getCountries() {
    return this.http.get(this.url);
  }
}
