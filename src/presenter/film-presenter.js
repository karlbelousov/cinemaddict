import {render, replace, remove} from '../framework/render.js';
import FilmCardView from '../view/film-card-view.js';

export default class FilmPresenter {
  #filmListContainer = null;

  #clickCarHandler = null;
  #escKeyDownHandler = null;
  #changeData = null;

  #filmCard = null;
  #film = null;

  constructor(filmListContainer, clickCardHandler, escKeyDownHandler, changeData) {
    this.#filmListContainer = filmListContainer;
    this.#clickCarHandler = clickCardHandler;
    this.#escKeyDownHandler= escKeyDownHandler;
    this.#changeData = changeData;
  }

  init = (film) => {
    const prevFilmCard = this.#filmCard;

    this.#film = film;
    this.#filmCard = new FilmCardView(this.#film);
    this.#filmCard.setFilmCardClickHandler(() => {
      this.#clickCarHandler(this.#film);
      document.addEventListener('keydown', this.#escKeyDownHandler);
    });
    this.#filmCard.setWatchlistButtonClickHandler(this.#watchlistButtonHandler);
    this.#filmCard.setWatchedButtonClickHandler(this.#watchedButtonHandler);
    this.#filmCard.setFavoriteButtonClickHandler(this.#favoriteButtonHandler);

    if (prevFilmCard === null) {
      render(this.#filmCard, this.#filmListContainer.element);
      return;
    }

    replace(this.#filmCard, prevFilmCard);

    remove(prevFilmCard);
  };

  destroy = () => {
    remove(this.#filmCard);
  };

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
