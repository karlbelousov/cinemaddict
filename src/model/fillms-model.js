import { generateFilms } from '../mock/films';

export default class FilmsModel {
  films = generateFilms();

  getFilms() {
    return this.films;
  }
}
