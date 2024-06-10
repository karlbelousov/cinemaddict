import SortView from '../view/sort-view.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmListEmptyView from '../view/film-list-empty-view.js';
import FilmPresenter from './film-presenter.js';
import FilmDetailsPresenter from './film-details-presenter.js';

import {render, remove, replace} from '../framework/render.js';
import { updateItem } from '../utils/common.js';
import { sortFilmsByDate, sortFilmsByRating } from '../utils/film.js';
import { FILMS_COUNT_PER_STEP, SortType } from '../const.js';

export default class FilmsPresenter {
  #sortComponent = null;
  #filmsContainer = new FilmsView();
  #filmsList = new FilmsListView();
  #filmsListContainer = new FilmsListContainerView();
  #showMoreButton = new ShowMoreButtonView();

  #container = null;
  #filmsModel = null;
  #commentsModel = null;

  #films = [];
  #sourcedFilms = [];

  #selectedFilm = null;
  #currentSortType = SortType.DEFAULT;

  #filmPresenter = new Map();
  #filmDetailsPresenter = null;

  #renderedFilmsCount = FILMS_COUNT_PER_STEP;

  constructor(container,  filmsModel, commentsModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
  }

  init = () => {
    this.#films = [...this.#filmsModel.films];
    this.#sourcedFilms = [...this.#filmsModel.films];

    this.#renderFilmBoard();
  };

  #renderFilmBoard = () => {
   if (this.#films.length === 0) {
      render(new FilmListEmptyView(), this.#container);
      return;
    }

    this.#renderSort(this.#container);
    this.#renderFilmListContainer(this.#container);
    this.#renderFilmList();
  }

  #renderFilmListContainer = (container) => {
    render(this.#filmsContainer, container);
    render(this.#filmsList, this.#filmsContainer.element);
    render(this.#filmsListContainer, this.#filmsList.element);
  }

  #handleFilmChange = (updatedFilm) => {
    this.#films = updateItem(this.#films, updatedFilm);
    this.#sourcedFilms = updateItem(this.#sourcedFilms, updatedFilm);

    if (this.#filmPresenter.get(updatedFilm.id)) {
      this.#filmPresenter.get(updatedFilm.id).init(updatedFilm);
    }

    if (this.#filmDetailsPresenter && this.#selectedFilm.id === updatedFilm.id) {
      this.#selectedFilm = updatedFilm;
      this.#renderFilmDetails();
    }
  }

  #sortFilms = (sortType) => {
    switch (sortType) {
      case SortType.DATE:
        this.#films.sort(sortFilmsByDate);
        break;
      case SortType.RATING:
        this.#films.sort(sortFilmsByRating);
        break;
      default:
        this.#films = [...this.#sourcedFilms];
    };

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortFilms(sortType);
    this.#clearFilmList();
    this.#renderSort(this.#container);
    this.#renderFilmList();
  }

  #renderSort = (container) => {
    if (!this.#sortComponent) {
      this.#sortComponent = new SortView(this.#currentSortType);
      render(this.#sortComponent, container);
    } else {
      const updatedSortComponent = new SortView(this.#currentSortType);
      replace(updatedSortComponent, this.#sortComponent);
      this.#sortComponent = updatedSortComponent;
    }

    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderFilmList = () => {
    this.#renderFilms(
      0,
      Math.min(this.#films.length, FILMS_COUNT_PER_STEP),
      this.#filmsListContainer
    );

    if (this.#films.length > FILMS_COUNT_PER_STEP) {
      this.#renderShowMoreButton(this.#filmsList.element);
    }
  }

  #clearFilmList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmsCount = FILMS_COUNT_PER_STEP;
    remove(this.#showMoreButton);
  }

  #renderShowMoreButton = (container) => {
    render(this.#showMoreButton, container);
    this.#showMoreButton.setButtonClickHandler(() =>
      this.#handleShowMoreButtonClick()
    );
  }

  #renderFilms = (from, to, container) => {
    this.#films
    .slice(from, to)
    .forEach((film) => this.#renderFilm(film, container));
  }

  #renderFilm = (film, container) => {
    const filmPresenter = new FilmPresenter(
      container,
      this.#handleFilmChange,
      this.#addFilmDetails,
      this.#onEscKeyDown,
    );
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  }

  #handleShowMoreButtonClick = () => {
    this.#renderFilms(
      this.#renderedFilmsCount,
      this.#renderedFilmsCount + FILMS_COUNT_PER_STEP,
      this.#filmsListContainer
    );

    this.#renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if (this.#renderedFilmsCount >= this.#films.length) {
      this.#showMoreButton.element.remove();
      this.#showMoreButton.removeElement();
    }
  }

  #renderFilmDetails = () => {
    const comments = [...this.#commentsModel.get(this.#selectedFilm)];

    if (!this.#filmDetailsPresenter) {
      this.#filmDetailsPresenter = new FilmDetailsPresenter(
        this.#container.parentElement,
        this.#handleFilmChange,
        this.#removeFilmDetails,
        this.#onEscKeyDown,
      );
    }

    console.log(this.#filmDetailsPresenter);

    this.#filmDetailsPresenter.init(this.#selectedFilm, comments);
  }

  #addFilmDetails = (film) => {
    if (this.#selectedFilm && this.#selectedFilm.id === film.id) {
      return;
    }

    if (this.#selectedFilm && this.#selectedFilm.id !== film.id) {
      this.#removeFilmDetails();
    }

    this.#selectedFilm = film
    this.#renderFilmDetails();

    document.body.classList.add('hide-overflow');
  };

  #removeFilmDetails = () => {
    this.#filmDetailsPresenter.destroy();
    this.#filmDetailsPresenter = null;
    this.#selectedFilm = null;

    document.body.classList.remove('hide-overflow');
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#removeFilmDetails();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };
}
