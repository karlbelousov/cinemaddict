import Observable from '../framework/observable.js';
import { generateFilms } from '../mock/films';

export default class FilmsModel extends Observable {
  #apiServices = null;
  #films = generateFilms();

  constructor(apiServices) {
    super();
    this.#apiServices = apiServices;

    this.#apiServices.get().then((films) => {
      console.log(films);
    });
  }

  get films() {
    return this.#films;
  }

  updateFilm = (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Cant\'t update unexisting film');
    }

    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1),
    ];

    this._notify(updateType, update);
  };
}
