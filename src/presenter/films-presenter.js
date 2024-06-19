import SortView from '../view/sort-view.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmListEmptyView from '../view/film-list-empty-view.js';
import LoadingView from '../view/loading-view.js';

import FilmPresenter from './film-presenter.js';
import FilmDetailsPresenter from './film-details-presenter.js';

import {render, remove, replace} from '../framework/render.js';
import { sortFilmsByDate, sortFilmsByRating } from '../utils/film.js';
import {filter} from '../utils/filter.js';
import { FILMS_COUNT_PER_STEP, SortType, UpdateType, UserAction, FilterType } from '../const.js';

export default class FilmsPresenter {
  #sortComponent = null;
  #films = new FilmsView();
  #filmList = new FilmsListView();
  #filmListContainer = new FilmsListContainerView();
  #loading = new LoadingView();
  #showMoreButton = new ShowMoreButtonView();
  #filmListEmpty = new FilmListEmptyView();

  #container = null;
  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;

  #selectedFilm = null;
  #currentSortType = SortType.DEFAULT;
  #isLoading = true;

  #filmPresenter = new Map();
  #filmDetailsPresenter = null;

  #renderedFilmsCount = FILMS_COUNT_PER_STEP;

  constructor(container,  filmsModel, commentsModel, filterModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }


  get films() {
    const filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;

    const filteredFilms = filter[filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortFilmsByDate);
      case SortType.RATING:
        return filteredFilms.sort(sortFilmsByRating);
    }

    return filteredFilms;
  }

  init = () => {
    this.#renderFilmBoard();
  };

  #handleViewAction = async (actionType, updateType, updateFilm, updateComment) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        await this.#filmsModel.updateOnServer(updateType, updateFilm);
        break;
      case UserAction.DELETE_COMMENT:
        await this.#commentsModel.delete(updateType, updateFilm, updateComment);
        break;
      case UserAction.ADD_COMMENT:
        await this.#commentsModel.add(updateType, updateFilm, updateComment);
        this.#filmDetailsPresenter.clearViewData();
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        if (this.#filmPresenter.get(data.id)) {
          this.#filmPresenter.get(data.id).init(data);
        }
        if (this.#filmDetailsPresenter && this.#selectedFilm.id === data.id) {
          this.#selectedFilm = data;
          this.#renderFilmDetails();
        }
        if (this.#filterModel.filter !== FilterType.ALL) {
          this.#handleModelEvent(UpdateType.MINOR);
        }
        break;
      case UpdateType.MINOR:
        this.#clearFilmBoard();
        this.#renderFilmBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearFilmBoard({resetRenderedFilmsCount: true, resetSortType: true});
        this.#renderFilmBoard();
        if (this.#filmDetailsPresenter && this.#selectedFilm.id === data.id) {
          this.#selectedFilm = data;
          this.#renderFilmDetails();
        }
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loading);
        this.#renderFilmBoard();
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    const films = this.films.slice(0, Math.min(this.films.length, FILMS_COUNT_PER_STEP));
    this.#clearFilmList();
    this.#renderSort(this.#container);
    this.#renderFilmList(films);
  };

  #handleShowMoreButtonClick = () => {
    const filmsCount = this.films.length;

    const newRenderedFilmsCount = Math.min(filmsCount, this.#renderedFilmsCount + FILMS_COUNT_PER_STEP);

    const films = this.films.slice(this.#renderedFilmsCount, newRenderedFilmsCount);

    this.#renderFilms(films, this.#filmListContainer);

    this.#renderedFilmsCount = newRenderedFilmsCount;

    if (this.#renderedFilmsCount >= filmsCount) {
      remove(this.#showMoreButton);
    }
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#removeFilmDetails();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #onCtrlEnterDown = (evt) => {
    if (evt.key === 'Enter' && (evt.metaKey || evt.ctrlKey)) {
      evt.preventDefault();
      this.#filmDetailsPresenter.createComment();
    }
  };

  #renderFilmBoard = () => {
    const films = this.films.slice(0, Math.min(this.films.length, FILMS_COUNT_PER_STEP));

    if (this.#isLoading) {
      this.#renderLoading(this.#container);
      return;
    }

    if (!this.#isLoading && this.films.length === 0) {
      this.#renderNoFilms(this.#container);
      return;
    }

    this.#renderSort(this.#container);
    this.#renderFilmListContainer(this.#container);
    this.#renderFilmList(films);
  };

  #clearFilmBoard = ({resetRenderedFilmsCount = false, resetSortType = false} = {}) => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    remove(this.#showMoreButton);
    remove(this.#filmListEmpty);

    if (resetRenderedFilmsCount) {
      this.#renderedFilmsCount = FILMS_COUNT_PER_STEP;
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
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

  #renderNoFilms = () => {
    this.#filmListEmpty = new FilmListEmptyView(this.#filterModel.filter);
    render(this.#filmListEmpty, this.#container);
  };

  #renderLoading = (container) => {
    render(this.#loading, container);
  };

  #renderFilmListContainer = (container) => {
    render(this.#films, container);
    render(this.#filmList, this.#films.element);
    render(this.#filmListContainer, this.#filmList.element);
  };

  #renderFilmList(films) {
    this.#renderFilms(
      films,
      this.#filmListContainer
    );

    if (this.films.length > FILMS_COUNT_PER_STEP) {
      this.#renderShowMoreButton(this.#filmList.element);
    }
  }

  #clearFilmList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmsCount = FILMS_COUNT_PER_STEP;
    remove(this.#showMoreButton);
  };

  #renderShowMoreButton = (container) => {
    render(this.#showMoreButton, container);
    this.#showMoreButton.setButtonClickHandler(this.#handleShowMoreButtonClick);
  };

  #renderFilms = (films, container) => {
    films.forEach((film) => this.#renderFilm(film, container));
  };

  #renderFilm = (film, container) => {
    const filmPresenter = new FilmPresenter(
      container,
      this.#handleViewAction,
      this.#addFilmDetails,
      this.#onEscKeyDown,
    );
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  };

  #renderFilmDetails = async () => {
    const comments = await this.#commentsModel.get(this.#selectedFilm);

    const isCommentLoadingError = !comments;

    if (!this.#filmDetailsPresenter) {
      this.#filmDetailsPresenter = new FilmDetailsPresenter(
        this.#container.parentElement,
        this.#handleViewAction,
        this.#removeFilmDetails,
        this.#onEscKeyDown,
      );
    }

    if (!isCommentLoadingError) {
      document.addEventListener('keydown', this.#onCtrlEnterDown);
    }

    this.#filmDetailsPresenter.init(this.#selectedFilm, comments, isCommentLoadingError);
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
    document.removeEventListener('keydown', this.#onCtrlEnterDown);

    this.#filmDetailsPresenter.destroy();
    this.#filmDetailsPresenter = null;
    this.#selectedFilm = null;

    document.body.classList.remove('hide-overflow');
  };
}
