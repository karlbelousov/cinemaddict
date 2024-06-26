import {render, replace, remove} from '../framework/render.js';
import FilmCardView from '../view/film-card-view.js';
import { UpdateType, UserAction } from '../const.js';

export default class FilmPresenter {
  #container = null;

  #clickCardHandler = null;
  #escKeyDownHandler = null;
  #changeData = null;

  #filmCard = null;
  #film = null;

  constructor(container,  changeData, clickCardHandler, escKeyDownHandler) {
    this.#container = container;
    this.#changeData = changeData;
    this.#clickCardHandler = clickCardHandler;
    this.#escKeyDownHandler = escKeyDownHandler;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmCard = this.#filmCard;

    this.#filmCard = new FilmCardView(this.#film);

    this.#filmCard.setFilmCardClickHandler(() => {
      this.#clickCardHandler(this.#film);
      document.addEventListener('keydown', this.#escKeyDownHandler);
    });
    this.#filmCard.setWatchlistButtonClickHandler(this.#watchlistButtonHandler);
    this.#filmCard.setWatchedButtonClickHandler(this.#watchedButtonHandler);
    this.#filmCard.setFavoriteButtonClickHandler(this.#favoriteButtonHandler);

    if (prevFilmCard === null) {
      render(this.#filmCard, this.#container.element);
      return;
    }

    replace(this.#filmCard, prevFilmCard);

    remove(prevFilmCard);
  };

  destroy = () => {
    remove(this.#filmCard);
  };

  setFilmUpdated = () => {
    this.#filmCard.updateElement({
      isDisabled: true
    });
  };

  setAborting = () => {
    this.#filmCard.updateElement({
      isDisabled: false
    });

    this.#filmCard.shakeControls();
  };

  #watchlistButtonHandler = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MAJOR,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          watchlist: !this.#film.userDetails.watchlist
        },
      });
  };

  #watchedButtonHandler = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MAJOR,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          alreadyWatched: !this.#film.userDetails.alreadyWatched
        },
      });
  };

  #favoriteButtonHandler = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MAJOR,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          favorite: !this.#film.userDetails.favorite
        },
      });
  };
}
