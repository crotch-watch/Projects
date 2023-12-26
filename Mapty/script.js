'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

let map;
let marker;
let mapEvent;

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function (data) {
    const userCoordsSnapshot = [data.coords.latitude, data.coords.longitude];

    map = L.map('map').setView(userCoordsSnapshot, 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    marker = L.marker(userCoordsSnapshot)
      .addTo(map)
      .bindPopup('Running')
      .openPopup();

    map.on('click', function (event) {
      mapEvent = event;
      form.classList.remove('hidden');
      inputDistance.focus();
    });
  }, console.warn);
}

form.addEventListener('submit', event => {
  event.preventDefault();

  L.marker([mapEvent.latlng.lat, mapEvent.latlng.lng], {
    opacity: 0.85,
  })
    .addTo(map)
    .bindPopup('Running');
  L.popup({ autoClose: false });

  resetActivityFormInputs();
});

const EMPTY_INPUT = '';

function resetActivityFormInputs() {
  clearInputs(inputCadence, inputDistance, inputDuration, inputElevation);
}

function clearInputs(...inputs) {
  inputs.forEach(input => (input.value = EMPTY_INPUT));
}

inputType.addEventListener('change', event => {
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
});
