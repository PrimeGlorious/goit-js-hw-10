import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInputText, DEBOUNCE_DELAY));

function onInputText(e) {
  if (!e.target.value.trim()) {
    return (countryListReset());
  }

  fetchCountries(e.target.value.trim())
    .then(r => {
      renderCountriesList(r);
    })
    .catch(error => {
      if (error.message === '404') {
        Notiflix.Notify.failure('Oops, there is no country with that name');
        countryListReset()
      }
      console.log(error);
    });
};

function renderCountriesList(countries) {
  countryListReset();

  if (countries.length > 10) {
    return Notiflix.Notify.info(
      `"Too many matches found. Please enter a more specific name."`
    );
  }
  const markup = countries
    .map(country => {
        return `<li>
        <div style="display:flex; align-items:center"><div style="display:inline-flex; align-items:center"><img src="${country.flags.svg}" alt="flag" width = 40></div>
        <h1 class="title"; style="font-size:20px; padding-left:10px", "line-height:1.5">${country.name.official}</h1></div>
        </li>`;
    })
    .join('');
  refs.countryList.insertAdjacentHTML('beforeend', markup);

  const markupInfo = countries.map(country => {
    if (countries.length === 1) {
      const title = document.querySelector('.title');
      title.style.fontSize = '40px';
       return `<li>
        <p><b>Capital:</b> ${country.capital}</p>
      </li>
      <li>
        <p><b>Population:</b> ${country.population}</p>
      </li>
      <li>
        <p><b>Languages:</b> ${Object.values(country.languages)}</p>
      </li>`;
    }
  }).join('');
   refs.countryInfo.insertAdjacentHTML('beforeend', markupInfo);
};

function countryListReset() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
};