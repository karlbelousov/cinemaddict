import Observable from '../framework/observable.js';
import { generateFilms } from '../mock/films';

export default class FilmsModel extends Observable {
  #apiServices = null;
  #films = generateFilms();

  constructor(apiServices) {
    super();
    this.#apiServices = apiServices;
  }

  init = async () => {
    try {
      const films = await this.#apiServices.get();
      this.#films = films.map(this.#adaptToClient);
    } catch {
      this.#films = [];
    }
  };

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

  #adaptToClient = (film) => {
    const adaptedFilm = {
      ...film,
      filmInfo: {
        ...film['film_info'],
        ageRating: film['film_info']['age_rating'],
        totalRating: film['film_info']['total_rating'],
        alternativeTitle: film['film_info']['alternative_title'],
        userDetails: {
          ...film['user_details'],
          alreadyWatched: film['user_details']['already_watched'],
          watchingDate: film['user_details']['watching_date']
        }
      }
    };

    delete adaptedFilm['film_info'];
    delete adaptedFilm['user_details'];
    delete adaptedFilm.filmInfo['age_rating'];
    delete adaptedFilm.filmInfo['total_rating'];
    delete adaptedFilm.filmInfo['alternative_title'];
    delete adaptedFilm.userDetails['already_watched'];
    delete adaptedFilm.userDetails['watching_dat'];

    return adaptedFilm;
  };
}
