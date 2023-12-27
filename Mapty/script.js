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

class Workout {
  date = new Date();
  id = Math.random();

  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }
}

class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
  }
}

class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
  }

  calcSpeed() {
    this.speed = this.distance / this.duration;
  }
}

const areNumbers = (...args) => args.every(arg => Number.isFinite(arg));

const arePositive = (...args) => args.every(arg => arg > 0);

class App {
  #map;
  #mapEvent;
  workouts = [];

  constructor() {
    this._getPosition();
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField);
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), console.warn);
    }
  }

  _loadMap(position) {
    const userCoordsSnapshot = [position.coords.latitude, position.coords.longitude];

    this.#map = L.map('map').setView(userCoordsSnapshot, 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on('click', this._showForm.bind(this));
  }

  _showForm(event) {
    this.#mapEvent = event;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(event) {
    event.preventDefault();

    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;

    let workout;

    if (type === 'running') {
      const cadence = +inputCadence.value;
      if (!areNumbers(distance, duration, cadence)) return alert('Distance must be a positive number');
      if (!arePositive(distance, duration, cadence)) return alert('Distance/Duration must be greater than zero');

      workout = new Running([this.#mapEvent.latlng.lat, this.#mapEvent.latlng.lng], distance, duration, cadence);
    }

    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      if (!areNumbers(distance, duration, elevation)) return alert('Distance must be a positive number');
      if (!arePositive(distance, duration)) return alert('Distance/Duration must be greater than zero');

      workout = new Cycling([this.#mapEvent.latlng.lat, this.#mapEvent.latlng.lng], distance, duration, elevation);
    }

    this.workouts.push(workout);
    this.renderWorkoutMarker(workout, type);
    resetActivityFormInputs();
  }

  renderWorkoutMarker(workout, type) {
    L.marker(workout.coords, {
      opacity: 0.85,
    })
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          autoClose: false,
          closeOnClick: false,
          minWidth: 150,
          maxWidth: 250,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(type)
      .openPopup();
  }
}

const app = new App();

const EMPTY_INPUT = '';

function resetActivityFormInputs() {
  clearInputs(inputCadence, inputDistance, inputDuration, inputElevation);
}

function clearInputs(...inputs) {
  inputs.forEach(input => (input.value = EMPTY_INPUT));
}
