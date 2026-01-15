export interface ICurrency {
  code: string;
  name: string;
  symbol: string;
}

export interface ILanguage {
  name: string;
}

export interface IBorderCountry {
  name: string;
  alpha3Code: string;
}

export interface ICountry {
  name: string;
  nativeName: string;
  flag: string;
  alpha3Code: string;
  capital: string;
  region: string;
  subregion: string;
  population: number;
  topLevelDomain: string[];
  currencies: ICurrency[];
  languages: ILanguage[];
  flags: {
    svg: string;
    png: string;
  };
  borders: string[];
  borderCountries?: IBorderCountry[];
}
