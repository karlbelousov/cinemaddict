import { UpdateType } from '../const.js';
import Observable from '../framework/observable.js';

export default class FilmsModel extends Observable {
  #apiServices = null;
  #films = [];

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
    this._notify(UpdateType.INIT);
  };

  get films() {
    return this.#films;
  }

  update = async (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    try {
      const response = await this.#apiServices.update(update);

      const updatedFilm = this.#adaptToClient(response);

      this.#films = [
        ...this.#films.slice(0, index),
        updatedFilm,
        ...this.#films.slice(index + 1),
      ];

      this._notify(updateType, updatedFilm);
    } catch {
      throw new Error('Can\'t update film');
    }
  };

  #adaptToClient = (film) => {
    const adaptedFilm = {
      ...film,
      filmInfo: {
        ...film['film_info'],
        ageRating: film['film_info']['age_rating'],
        totalRating: film['film_info']['total_rating'],
        alternativeTitle: film['film_info']['alternative_title'],
        release: {
          ...film['film_info']['release'],
          releaseCountry: film['film_info']['release']['release_country']
        }
      },
      userDetails: {
        ...film['user_details'],
        alreadyWatched: film['user_details']['already_watched'],
        watchingDate: film['user_details']['watching_date']
      }
    };

    delete adaptedFilm['film_info'];
    delete adaptedFilm['user_details'];
    delete adaptedFilm.filmInfo['age_rating'];
    delete adaptedFilm.filmInfo['total_rating'];
    delete adaptedFilm.filmInfo['alternative_title'];
    delete adaptedFilm.filmInfo.release['release_country'];
    delete adaptedFilm.userDetails['already_watched'];
    delete adaptedFilm.userDetails['watching_date'];

    return adaptedFilm;
  };
}
