import SortView from '../view/sort-view.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmListEmptyView from '../view/film-list-empty-view.js';
import FilmPresenter from './film-presenter.js';
import FilmDetailsPresenter from './film-details-presenter.js';

import {render, remove} from '../framework/render.js';
import { updateItem } from '../utils/common.js';
import { FILMS_COUNT_PER_STEP } from '../const.js';

export default class FilmsPresenter {
  #sortComponent = new SortView()
  #filmsContainer = new FilmsView();
  #filmsList = new FilmsListView();
  #filmsListContainer = new FilmsListContainerView();
  #showMoreButton = new ShowMoreButtonView();
  #filmListTmpty = new FilmListEmptyView();
  #filmDetails = null;

  #container = null;
  #filmsModel = null;
  #commentsModel = null;

  #films = [];

  #selectedFilm = null;

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
    this.#renderFilmBoard();
  };

  #renderFilmBoard = () => {
   if (this.#films.length === 0) {
      this.#renderFilmListEmpty();
      return;
    }

    this.#renderSort();
    render(this.#filmsContainer, this.#container);
    this.#renderFilmList();
  }

  #handleFilmChange = (updatedFilm) => {
    this.#films = updateItem(this.#films, updatedFilm);
    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm);
  }

  #renderSort = () => {
    render(this.#sortComponent, this.#container);
  }

  #renderFilmListEmpty = () => {
    render(this.#filmListTmpty, this.#filmsContainer.element);
  }

  #renderFilmList = () => {
    render(this.#filmsList, this.#filmsContainer.element);
    render(this.#filmsListContainer, this.#filmsList.element);

    this.#renderFilms(0, Math.min(this.#films.length, FILMS_COUNT_PER_STEP))

    if (this.#films.length > FILMS_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  }

  #clearFilmList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmsCount = FILMS_COUNT_PER_STEP;
    remove(this.#showMoreButton);
  }

  #renderShowMoreButton = () => {
    render(this.#showMoreButton, this.#filmsList.element);
    this.#showMoreButton.setButtonClickHandler(() => this.#handleShowMoreButtonClick());
  }

  #renderFilms = (from, to) => {
    this.#films
    .slice(from, to)
    .forEach((film) => this.#renderFilm(film));
  }

  #renderFilm = (film) => {
    const filmPresenter = new FilmPresenter(
      this.#filmsListContainer,
      this.#addFilmDetails,
      this.#onEscKeyDown,
      this.#handleFilmChange
    );
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  }

  #handleShowMoreButtonClick = () => {
    this.#renderFilms(this.#renderedFilmsCount, this.#renderedFilmsCount + FILMS_COUNT_PER_STEP);

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
        this.#removeFilmDetails,
        this.#onEscKeyDown,
        this.#handleFilmChange
      );
    }

    this.#filmDetailsPresenter.init(this.#selectedFilm, comments);
  }

  #addFilmDetails = (film) => {
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
