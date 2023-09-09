export interface ICountry {
  name: string;
  capital: string;
  region: string;
  population: number;
  flag: string;
  flags: ICountryFlags;
  borders: string[];
}

interface ICountryFlags {
  svg: string;
  png: string;
}

/*
const countryData = [
  {
    name: 'Germany',
    capital: 'Berlin',
    region: 'Europe',
    population: 83240525,
    flags: {
      svg: 'https://flagcdn.com/de.svg',
      png: 'https://flagcdn.com/w320/de.png',
    },
  },
];
*/
