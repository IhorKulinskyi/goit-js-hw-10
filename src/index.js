import './css/styles.css';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const debouncedOnInput = debounce(onSearchInput, DEBOUNCE_DELAY);

refs.input.addEventListener('input', debouncedOnInput);

function onSearchInput(e) {
  if (e.target.value.trim() === '') {
    refs.countryList.innerHTML = '';
    return;
  } else {
    return fetchCountries(e.target.value.trim()).then(result => {
      if (result.status === 404) {
        Notify.failure('Oops, there is no country with that name');
        return;
      }
      updateCountryList(result);
    });
  }
}

function updateCountryList(countries) {
  refs.countryList.innerHTML = '';
  if (countries.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }
  if (countries.length <= 10 && countries.length >= 2) {
    countries.forEach(country => updateCountryPreviewInfo(country));
  } else {
    countries.forEach(country => updateCountryInfo(country));
  }
}

function updateCountryInfo(country) {
  refs.countryList.insertAdjacentHTML(
    'beforeend',
    `<li><div class="country-card">
    <h2 class="country-name">${country.name.official}</h2>
    <img src="${
      country.flags.svg
    }" width="180" alt="Country Image" class="country-image">
    <div class="country-info">
      <p><strong>Capital:</strong>${country.capital.join(', ')}</p>
      <p><strong>Population:</strong>${country.population}</p>
      <p><strong>Languages:</strong>${Object.values(country.languages).join(
        ', '
      )}</p>
    </div>
  </div></li>`
  );
}

function updateCountryPreviewInfo(country) {
  refs.countryList.insertAdjacentHTML(
    'beforeend',
    `<li><div class="preview-card">
    <img src="${country.flags.svg}" alt="Country Flag" width="30" height="20" class="country-flag">
    <h3 class="country-name">${country.name.official}</h3>
  </div></li>`
  );
}
