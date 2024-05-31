import {render, remove} from '../framework/render.js';
import SortView from '../view/sort-view.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmDetailsView from '../view/films-details-view.js';
import FilmListEmptyView from '../view/film-list-empty-view.js';
import FilmPresenter from './film-presenter.js';
import { updateItem } from '../utils/common.js';
import { FILMS_COUNT_PER_STEP } from '../const.js';

export default class FilmsPresenter {
  #sortComponent = new SortView();
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

  #renderedFilmsCount = FILMS_COUNT_PER_STEP;
  #filmPresenter = new Map();

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
    this.#renderSort();
    render(this.#filmsContainer, this.#container);

    if (this.#films.length === 0) {
      this.#renderFilmListEmpty();
      return;
    }

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

  #handleShowMoreButtonClick = () => {
    this.#renderFilms(this.#renderedFilmsCount, this.#renderedFilmsCount + FILMS_COUNT_PER_STEP);

    this.#renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if (this.#renderedFilmsCount >= this.#films.length) {
      remove(this.#showMoreButton)
    }
  }

  #renderFilm = (film) => {
    const filmPresenter = new FilmPresenter(this.#filmsListContainer, this.#addFilmDetails);
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  }

  #renderFilmDetails = (film) => {
    const comments = [...this.#commentsModel.get(film)];
    this.#filmDetails = new FilmDetailsView(film, comments);

    this.#filmDetails.setFilmDetailsCloseButton(() => {
      this.#removeFilmDetails();
    })
    document.addEventListener('keydown', this.#onEscKeyDown);
    render(this.#filmDetails, this.#container.parentElement);
  };

  #addFilmDetails = (film) => {
    this.#renderFilmDetails(film);
    document.body.classList.add('hide-overflow');
  };

  #removeFilmDetails = () => {
    remove(this.#filmDetails);
    this.#filmDetails = null;
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
