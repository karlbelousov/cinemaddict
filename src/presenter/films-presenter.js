import SortView from '../view/sort-view.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmListEmptyView from '../view/film-list-empty-view.js';
import LoadingView from '../view/loading-view.js';
import FilmPresenter from './film-presenter.js';
import FilmDetailsPresenter from './film-details-presenter.js';
import {render, remove} from '../framework/render.js';
import { sortFilmsByDate, sortFilmsByRating } from '../utils/film.js';
import {filter} from '../utils/filter.js';
import { FILMS_COUNT_PER_STEP, SortType, UpdateType, UserAction, FilterType } from '../const.js';

export default class FilmsPresenter {
  #sortComponent = null;
  #filmsContainer = new FilmsView();
  #filmsList = new FilmsListView();
  #filmsListContainer = new FilmsListContainerView();
  #loadingComponent = new LoadingView();
  #showMoreButton = null;
  #filmListEmpty = null;

  #container = null;
  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;

  #selectedFilm = null;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;

  #filmPresenter = new Map();
  #filmDetailsPresenter = null;
  #isLoading = true;

  #renderedFilmsCount = FILMS_COUNT_PER_STEP;

  constructor(container,  filmsModel, commentsModel, filterModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;
    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    this.#renderFilmBoard();
  };

  get films() {
    this.#filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[this.#filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortFilmsByDate);
      case SortType.RATING:
        return filteredFilms.sort(sortFilmsByRating);
    }

    return filteredFilms;
  }

  #renderFilmBoard = () => {
    if (this.#isLoading) {
      this.#renderLoading(this.#container);
      return;
    }

    const films = this.films;
    const filmCount = films.length;

    if (this.films.length === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderSort(this.#container);
    this.#renderFilmListContainer(this.#container);
    this.#renderFilms(films.slice(0, Math.min(filmCount, this.#renderedFilmsCount)));

    if (filmCount > this.#renderedFilmsCount) {
      this.#renderShowMoreButton(this.#filmsList.element);
    }
  };

  #clearFilmBoard = ({resetRenderedFilmsCount = false, resetSortType = false} = {}) => {
    const filmsCount = this.films.length;
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    remove(this.#showMoreButton);
    remove(this.#filmsContainer);
    remove(this.#sortComponent);

    if (resetRenderedFilmsCount) {
      this.#renderedFilmsCount = FILMS_COUNT_PER_STEP;
    } else {
      this.#renderedFilmsCount = Math.min(filmsCount, this.#renderedFilmsCount);
    }

    if (this.#filmListEmpty) {
      remove(this.#filmListEmpty);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #renderNoFilms = () => {
    this.#filmListEmpty = new FilmListEmptyView(this.#filterType);
    render(this.#filmListEmpty, this.#container);
  };

  #renderLoading = (container) => {
    render(this.#loadingComponent, container);
  };

  #renderFilmListContainer = (container) => {
    render(this.#filmsContainer, container);
    render(this.#filmsList, this.#filmsContainer.element);
    render(this.#filmsListContainer, this.#filmsList.element);
  };

  #handleViewAction = (actionType, updateType, updateFilm, updateComment) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, updateFilm);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(updateType, updateComment);
        this.#filmsModel.updateFilm(updateType, updateFilm);
        break;
      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(UpdateType, updateComment);
        this.#filmDetailsPresenter.clearViewData();
        this.#filmsModel.updateFilm(updateType, updateFilm);
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
        remove(this.#loadingComponent);
        this.#renderFilmBoard();
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
    this.#sortComponent = new SortView(this.#currentSortType);
    render(this.#sortComponent, container);
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

    if (isCommentLoadingError) {
      document.addEventListener('keydown', this.#onCtrlEnterDown);
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
    document.removeEventListener('keydown', this.#onCtrlEnterDown);
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

  #onCtrlEnterDown = (evt) => {
    if (evt.key === 'Enter' && (evt.metaKey || evt.ctrlKey)) {
      evt.preventDefault();
      this.#filmDetailsPresenter.createComment();
    }
  };
}
