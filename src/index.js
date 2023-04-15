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
  const query = e.target.value.trim();
  if (query === '') {
    refs.countryList.innerHTML = '';
    return;
  } else {
    return fetchCountries(query).then(result => {
      if (result.status === 404) {
        refs.countryList.innerHTML = '';
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
    updateCountryInfo(countries[0]);
  }
}

function updateCountryInfo(country) {
  const roundedPopulation = roundPopulation(country.population);
  refs.countryList.insertAdjacentHTML(
    'beforeend',
    `<li><div class="country-card">
    <h2 class="country-name">${country.name.official}</h2>
    <img src="${
      country.flags.svg
    }" width="180" alt="Country Image" class="country-image">
    <div class="country-info">
      <p><strong>Capital:</strong> ${country.capital.join(', ')}</p>
      <p><strong>Population:</strong> ${roundedPopulation}</p>
      <p><strong>Languages:</strong> ${Object.values(country.languages).join(
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

  const lastCountry = refs.countryList.lastElementChild;
  lastCountry.addEventListener('click', () => {
    refs.input.value = country.name.official;
    onSearchInput({ target: { value: country.name.official } });
  });
}

function roundPopulation(population) {
  var billion = 1000000000;
  var million = 1000000;
  var thousand = 1000;

  if (population >= billion) {
    var roundedPopulation = Math.round((population / billion) * 10) / 10;
    return roundedPopulation + ' billion';
  } else if (population >= million) {
    var roundedPopulation = Math.round((population / million) * 10) / 10;
    return roundedPopulation + ' million';
  } else if (population >= thousand) {
    var roundedPopulation = Math.round((population / thousand) * 10) / 10;
    return roundedPopulation + ' thousand';
  } else {
    return population + ' people';
  }
}
