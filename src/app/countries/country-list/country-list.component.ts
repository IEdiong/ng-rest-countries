import { Component, OnInit } from '@angular/core';
import { ICountry } from '../shared/country.model';
import { CountryService } from '../shared/country.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'rc-country-list',
  templateUrl: './country-list.component.html',
  styles: [
    `
      // THE LOADING EFFECT
      .skeleton {
        background-color: #e2e5e7;
        // The shine that's going to move across the skeleton:
        background-image: linear-gradient(
          90deg,
          rgba(#fff, 0),
          rgba(#fff, 0.5),
          rgba(#fff, 0)
        );
        background-size: 40px 100%; // width of the shine
        background-repeat: no-repeat; // No need to repeat the shine effect
        background-position: left -40px top 0; // Place shine on the left side, with offset on the left based on the width of the shine - see background-size
        animation: shine 1s ease infinite; // increase animation time to see effect in 'slow-mo'
      }

      @keyframes shine {
        to {
          // Move shine from left to right, with offset on the right based on the width of the shine - see background-size
          background-position: right -40px top 0;
        }
      }
    `,
  ],
})
export class CountryListComponent implements OnInit {
  countries$: Observable<ICountry[]> | undefined;
  isLoading: boolean = true;
  hasError: boolean = false;

  constructor(private countryService: CountryService) {}

  ngOnInit(): void {
    this.countries$ = this.countryService.countries$;
    this.isLoading = false;
  }
}
