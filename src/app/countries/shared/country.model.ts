export interface ICountry {
  name: string;
  alpha3Code: string;
  capital: string;
  region: string;
  subregion: string;
  population: number;
  flag: string;
  flags: ICountryFlags;
  borders: string[];
  nativeName: string;
  topLevelDomain: string[];
  currencies: ICountryCurrency[];
  languages: ICountryLanguage[];
}

interface ICountryFlags {
  svg: string;
  png: string;
}

interface ICountryCurrency {
  code: string;
  name: string;
  symbol: string;
}

export interface ICountryLanguage {
  name: string;
}
