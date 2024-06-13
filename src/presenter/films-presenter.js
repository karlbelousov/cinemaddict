import SortView from '../view/sort-view.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmListEmptyView from '../view/film-list-empty-view.js';
import FilmPresenter from './film-presenter.js';
import FilmDetailsPresenter from './film-details-presenter.js';

import {render, remove, replace} from '../framework/render.js';
import { sortFilmsByDate, sortFilmsByRating } from '../utils/film.js';
import { FILMS_COUNT_PER_STEP, SortType, UpdateType, UserAction } from '../const.js';

export default class FilmsPresenter {
  #sortComponent = null;
  #filmsContainer = new FilmsView();
  #filmsList = new FilmsListView();
  #filmsListContainer = new FilmsListContainerView();
  #showMoreButton = null;
  #filmListEmpty = new FilmListEmptyView();

  #container = null;
  #filmsModel = null;
  #commentsModel = null;

  #selectedFilm = null;
  #currentSortType = SortType.DEFAULT;

  #filmPresenter = new Map();
  #filmDetailsPresenter = null;

  #renderedFilmsCount = FILMS_COUNT_PER_STEP;

  constructor(container,  filmsModel, commentsModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    this.#renderFilmBoard();
  };

  get films() {
    switch (this.#currentSortType) {
      case SortType.DATE:
        return [...this.#filmsModel.films].sort(sortFilmsByDate);
      case SortType.RATING:
        return [...this.#filmsModel.films].sort(sortFilmsByRating);
    }

    return this.#filmsModel.films;
  }

  #renderFilmBoard = () => {
    if (this.films.length === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderSort(this.#container);
    this.#renderFilmListContainer(this.#container);
    const filmsCount = this.films.length;
    const films = this.films.slice(0, Math.min(filmsCount, this.#renderedFilmsCount));
    this.#renderFilms(films);

    if (filmsCount > this.#renderedFilmsCount) {
      this.#renderShowMoreButton(this.#filmsList.element);
    }
  };

  #clearFilmBoard = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    remove(this.#showMoreButton);
    remove(this.#filmListEmpty);
    remove(this.#filmsContainer);
  };

  #renderNoFilms = () => {
    render(this.#filmListEmpty, this.#container);
  };

  #renderFilmListContainer = (container) => {
    render(this.#filmsContainer, container);
    render(this.#filmsList, this.#filmsContainer.element);
    render(this.#filmsListContainer, this.#filmsList.element);
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmPresenter.get(data.id).init(data);
        if (this.#filmDetailsPresenter && this.#selectedFilm.id === data.id) {
          this.#selectedFilm = data;
          this.#renderFilmDetails();
        }
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearFilmBoard();
    this.#renderFilmBoard();
  };

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
  };

  #renderShowMoreButton = (container) => {
    this.#showMoreButton = new ShowMoreButtonView();
    this.#showMoreButton.setButtonClickHandler(this.#handleShowMoreButtonClick);
    render(this.#showMoreButton, container);
  };

  #renderFilms = (films) => {
    films.forEach((film) => this.#renderFilm(film));
  };

  #renderFilm = (film) => {
    const filmPresenter = new FilmPresenter(
      this.#filmsListContainer.element,
      this.#handleViewAction,
      this.#addFilmDetails,
      this.#onEscKeyDown,
    );
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  };

  #handleShowMoreButtonClick = () => {
    const filmsCount = this.films.length;
    const newRenderedFilmsCount = Math.min(filmsCount, this.#renderedFilmsCount + FILMS_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmsCount, newRenderedFilmsCount);

    this.#renderFilms(films);
    this.#renderedFilmsCount = newRenderedFilmsCount;

    if (this.#renderedFilmsCount >= filmsCount) {
      remove(this.#showMoreButton);
    }
  };

  #renderFilmDetails = () => {
    const comments = this.#commentsModel.get(this.#selectedFilm);

    if (!this.#filmDetailsPresenter) {
      this.#filmDetailsPresenter = new FilmDetailsPresenter(
        this.#container.parentElement,
        this.#handleViewAction,
        this.#removeFilmDetails,
        this.#onEscKeyDown,
      );
    }

    this.#filmDetailsPresenter.init(this.#selectedFilm, comments);
  };

  #addFilmDetails = (film) => {
    if (this.#selectedFilm && this.#selectedFilm.id === film.id) {
      return;
    }

    if (this.#selectedFilm && this.#selectedFilm.id !== film.id) {
      this.#removeFilmDetails();
    }

    this.#selectedFilm = film;
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
