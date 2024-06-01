import {render, replace, remove} from '../framework/render.js';
import FilmDetailsView from '../view/films-details-view.js';

export default class FilmDetailsPresenter  {
  #container = null;

  #changeData = null;
  #closeButtonClickHandler = null;
  #escKeyDownHandler = null;

  #filmDetails = null;

  #film = null;
  #comment = null;

  constructor(container, closeButtonClickHandler, escKeyDownHandler, changeData) {
    this.#container = container;
    this.#closeButtonClickHandler = closeButtonClickHandler;
    this.#escKeyDownHandler = escKeyDownHandler;
    this.#changeData = changeData;
  }

  init = (film, comment) => {
    this.#film = film;
    this.#comment = comment;

    const prevFilmDetails = this.#filmDetails;

    this.#filmDetails = new FilmDetailsView(this.#film, this.#comment);
    this.#filmDetails.setFilmDetailsCloseButton(() => {
      this.#closeButtonClickHandler();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    });
    this.#filmDetails.setWatchlistButtonClickHandler(this.#watchlistButtonHandler);
    this.#filmDetails.setWatchedButtonClickHandler(this.#watchedButtonHandler);
    this.#filmDetails.setFavoriteButtonClickHandler(this.#favoriteButtonHandler);

    if (prevFilmDetails === null) {
      render(this.#filmDetails, this.#container);
      return;
    }

    replace(this.#filmDetails, prevFilmDetails);

    remove(prevFilmDetails);
  }

  destroy = () => {
    remove(this.#filmDetails);
  }

  #watchlistButtonHandler = () => {
    this.#changeData({
      ...this.#film,
      userDetails: {
        ...this.#film.userDetails,
        watchlist: !this.#film.userDetails.watchlist
      },
    })
  }

  #watchedButtonHandler = () => {
    this.#changeData({
      ...this.#film,
      userDetails: {
        ...this.#film.userDetails,
        alreadyWatched: !this.#film.userDetails.alreadyWatched
      },
    })
  }

  #favoriteButtonHandler = () => {
    this.#changeData({
      ...this.#film,
      userDetails: {
        ...this.#film.userDetails,
        favorite: !this.#film.userDetails.favorite
      },
    })
  }
}
