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

  _setDescription() {
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDay()}`;
  }
}

class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
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
    this._setDescription();
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
  DEFAULT_ZOOM_LEVEL = 13;

  constructor() {
    this._getPosition();
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField);
    containerWorkouts.addEventListener('click', this._moveToMap.bind(this));
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), console.warn);
    }
  }

  _loadMap(position) {
    const userCoordsSnapshot = [position.coords.latitude, position.coords.longitude];

    this.#map = L.map('map').setView(userCoordsSnapshot, this.DEFAULT_ZOOM_LEVEL);

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

  _hideForm() {
    form.classList.add('hidden');
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

    this._hideForm();
    this.workouts.push(workout);
    this._renderWorkoutMarker(workout);
    this._renderWorkout(workout);
    resetActivityFormInputs();
  }

  _renderWorkoutMarker(workout) {
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
      .setPopupContent(`${workout.type === 'running' ? '🏃' : '🚴'} ${workout.description}`)
      .openPopup();
  }

  _renderWorkout(workout) {
    let html = `
      <li class="workout workout--${workout.type}" data-id="${workout.id}">
        <h2 class="workout__title">${workout.description}</h2>
        <div class="workout__details">
          <span class="workout__icon">${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${workout.duration}</span>
          <span class="workout__unit">min</span>
        </div>
    `;

    if (workout.type === 'running') {
      html += `
          <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${parseInt(workout.pace)}</span>
          <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">🦶🏼</span>
          <span class="workout__value">${workout.cadence}</span>
          <span class="workout__unit">spm</span>
        </div>
      </li>
    `;
    }

    if (workout.type === 'cycling') {
      html += `
            <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${parseInt(workout.speed)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevationGain}</span>
            <span class="workout__unit">m</span>
          </div>
        </li> 
      `;
    }

    form.insertAdjacentHTML('afterend', html);
  }

  _moveToMap(event) {
    const clickedWorkout = event.target.closest('.workout');
    if (!clickedWorkout) return;
    const workout = this.workouts.find(workout => workout.id === +clickedWorkout.dataset.id);
    this.#map.setView([workout.coords[0], workout.coords[1]], this.DEFAULT_ZOOM_LEVEL, {
      animate: true,
      duration: 1,
    });
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
