import {render} from '../framework/render.js';
import SortView from '../view/sort-view.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmDetailsView from '../view/films-details-view.js';
import FilmListEmptyView from '../view/film-list-empty-view.js';
import { FILMS_COUNT_PER_STEP } from '../const.js';

export default class FilmsPresenter {
  #filmsContainer = new FilmsView();
  #filmsList = new FilmsListView();
  #filmsListContainer = new FilmsListContainerView();
  #showMoreButton = new ShowMoreButtonView();
  #filmDetails = null;

  #container = null;
  #filmsModel = null;
  #commentsModel = null;

  #films = [];

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
    render(this.#filmsContainer, this.#container);

    if (this.#films.length === 0) {
      render(new FilmListEmptyView(), this.#filmsContainer.element);
      return;
    }

    render(new SortView(), this.#container);
    render(this.#filmsList, this.#filmsContainer.element);
    render(this.#filmsListContainer, this.#filmsList.element);

    this.#films
    .slice(0, Math.min(this.#films.length, FILMS_COUNT_PER_STEP))
    .forEach((film) => this.#renderFilm(film, this.#filmsListContainer));

    if (this.#films.length > FILMS_COUNT_PER_STEP) {
      render(this.#showMoreButton, this.#filmsList.element);

      this.#showMoreButton.setButtonClickHandler(() => this.#handleShowMoreButtonClick());
    }
  }

  #handleShowMoreButtonClick = () => {
    this.#films
    .slice(this.#renderedFilmsCount, this.#renderedFilmsCount + FILMS_COUNT_PER_STEP)
    .forEach((film) => this.#renderFilm(film, this.#filmsListContainer))

    this.#renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if (this.#renderedFilmsCount >= this.#films.length) {
      this.#showMoreButton.element.remove();
      this.#showMoreButton.removeElement();
    }
  }

  #renderFilm(film, container)  {
    const filmCardComponent = new FilmCardView(film);

    filmCardComponent.setFilmCardClickHandler(() => this.#addFilmDetails(film));

    render(filmCardComponent, container.element);
  }

  #renderFilmDetails = (film) => {
    const comments = [...this.#commentsModel.get(film)];
    this.#filmDetails = new FilmDetailsView(film, comments);

    this.#filmDetails.setFilmDetailsCloseButton(() => this.#removeFilmDetails());

    render(this.#filmDetails, this.#container.parentElement);
  };

  #addFilmDetails = (film) => {
    this.#renderFilmDetails(film);
    document.addEventListener('keydown', this.#onEscKeyDown);
    document.body.classList.add('hide-overflow');
  };

  #removeFilmDetails = () => {
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#filmDetails.element.remove();
    this.#filmDetails = null;
    document.body.classList.remove('hide-overflow');
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#removeFilmDetails();
    }
  };
}

