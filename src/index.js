import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener(
  'input',
  debounce(handleSearch, DEBOUNCE_DELAY)
);

function handleSearch() {
  removeMarkup();
  const nameToSearch = refs.searchBox.value.trim();

  if (nameToSearch !== '') {
    fetchCountries(nameToSearch)
      .then(data => {
        if (data.length > 10) {
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else {
          createMarkup(data);
        }
      })
      .catch(error =>
        Notify.failure('Oops, there is no country with that name')
      );
  }
}

function createMarkup(countries) {
  createCountriesListMarkup(countries);
  if (countries.length === 1) {
    createCountryInfoMarkup(countries[0]);
  }
}

function createCountriesListMarkup(countries) {
  const countriesListMarkup = countries
    .map(({ flags, name }) => {
      return `<li class="country-item">
         <img class="country-flag" src="${flags.svg}" alt="">
         <p class="country-name">${name.official}</p>
      </li>`;
    })
    .join('');

  refs.countryList.insertAdjacentHTML('beforeend', countriesListMarkup);
}
function createCountryInfoMarkup(country) {
  const { capital, population, languages } = country;

  const infoMarkup = `<ul class="list">
  <li class="info-item"><p><span class="info-title">Capital: </span>${capital}</p></li>
  <li class="info-item"><p><span class="info-title">Population: </span>${population}</p></li>
  <li class="info-item"><p><span class="info-title">Languages: </span>${Object.values(
    languages
  )}</p></li>
</ul>`;

  refs.countryInfo.insertAdjacentHTML('beforeend', infoMarkup);
}
function removeMarkup() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
