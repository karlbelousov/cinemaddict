import { generateFilms } from '../mock/films';

export default class FilmsModel {
  #films = generateFilms();

  get films() {
    return this.#films;
  }
}
