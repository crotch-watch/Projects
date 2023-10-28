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

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function (data) {
    const map = L.map('map').setView(
      [data.coords.latitude, data.coords.latitude],
      13
    );

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker([data.coords.latitude, data.coords.longitude], {
      opacity: 0.85,
    })
      .addTo(map)
      .bindPopup('Running')
      .openPopup();

    map.on('click', function (event) {
      L.marker([event.latlng.lat, event.latlng.lng], {
        opacity: 0.85,
      })
        .addTo(map)
        .bindPopup('Running');

      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: 'running-popup',
      });
    });
  }, console.warn);
}
