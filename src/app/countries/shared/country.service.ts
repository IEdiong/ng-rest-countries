import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICountry } from './country.model';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private url = 'https://restcountries.com/v2/all';

  constructor(private http: HttpClient) {}

  getCountries() {
    return this.http.get<ICountry[]>(this.url);
  }

  getCountry(name: string) {
    // const url = `https://restcountries.com/v3.1/alpha/${cioc}`;
    const url = `https://restcountries.com/v2/name/${name}?fullText=true`;

    return this.http.get<ICountry[]>(url);
  }
}
