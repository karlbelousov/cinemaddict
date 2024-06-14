import {render, replace, remove} from '../framework/render.js';
import FilmDetailsView from '../view/films-details-view.js';
import { UpdateType, UserAction } from '../const.js';

export default class FilmDetailsPresenter  {
  #container = null;

  #changeData = null;
  #closeButtonClickHandler = null;
  #escKeyDownHandler = null;

  #filmDetails = null;

  #film = null;
  #comment = null;

  #viewData = {
    emotion: null,
    comment: null,
    scrollPosition: 0
  };

  constructor(container, changeData, closeButtonClickHandler, escKeyDownHandler) {
    this.#container = container;
    this.#changeData = changeData;
    this.#closeButtonClickHandler = closeButtonClickHandler;
    this.#escKeyDownHandler = escKeyDownHandler;
  }

  init = (film, comment) => {
    this.#film = film;
    this.#comment = comment;

    const prevFilmDetails = this.#filmDetails;

    this.#filmDetails = new FilmDetailsView(
      this.#film,
      this.#comment,
      this.#viewData,
      this.#updateViewData
    );

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

    this.#filmDetails.setScrollPosition();

    remove(prevFilmDetails);
  };

  destroy = () => {
    remove(this.#filmDetails);
  };

  #updateViewData = (viewData) => {
    this.#viewData = {...viewData};
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
