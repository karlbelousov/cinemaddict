import SortView from '../view/sort-view.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmDetailsView from '../view/films-details-view.js';
import { render } from '../render.js';
import { FILMS_COUNT_PER_STEP } from '../const.js';

export default class FilmsPresenter {
  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView();
  #filmsListContainerComponent = new FilmsListContainerView();
  #showMoreButtonComponent = new ShowMoreButtonView();
  #filmDetailsComponent = null;

  #container = null;
  #filmsModel = null;
  #commentsModel = null;
  #films = null;
  #renderedFilmsCount = FILMS_COUNT_PER_STEP;

  init = (container, filmsModel, commentsModel) => {
    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;

    this.#films = [...this.#filmsModel.films];

    render(new SortView(), this.#container);
    render(this.#filmsComponent, this.#container);
    render(this.#filmsListComponent, this.#filmsComponent.element);
    render(this.#filmsListContainerComponent, this.#filmsListComponent.element);

    this.#films
    .slice(0, Math.min(this.#films.length, FILMS_COUNT_PER_STEP))
    .forEach((film) => this.#renderFilm(film, this.#filmsListContainerComponent));

    if (this.#films.length > FILMS_COUNT_PER_STEP) {
      render(this.#showMoreButtonComponent, this.#filmsListComponent.element);

      this.#showMoreButtonComponent.element.addEventListener('click', this.#handleShowMoreButtonClick)
    }
  };

  #handleShowMoreButtonClick = (evt) => {
    evt.preventDefault();
    this.#films
    .slice(this.#renderedFilmsCount, this.#renderedFilmsCount + FILMS_COUNT_PER_STEP)
    .forEach((film) => this.#renderFilm(film, this.#filmsListContainerComponent))

    this.#renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if (this.#renderedFilmsCount >= this.#films.length) {
      this.#showMoreButtonComponent.element.remove();
      this.#showMoreButtonComponent.removeElement();
    }
  }

  #renderFilm(film, container)  {
    const filmCardComponent = new FilmCardView(film);
    const filmCardLink = filmCardComponent.element.querySelector('a');

    filmCardLink.addEventListener('click', () => {
      this.#addFilmDetails(film);
      document.addEventListener('keydown', this.#onEscKeyDown);
    });

    render(filmCardComponent, container.element);
  }

  #renderFilmDetails = (film) => {
    const comments = [...this.#commentsModel.get(film)];
    this.#filmDetailsComponent = new FilmDetailsView(film, comments);

    const closeButtonFilmDetails = this.#filmDetailsComponent.element.querySelector('.film-details__close-btn');

    closeButtonFilmDetails.addEventListener('click', () => {
      this.#removeFilmDetails();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    });

    render(this.#filmDetailsComponent, this.#container.parentElement);
  };

  #addFilmDetails = (film) => {
    this.#renderFilmDetails(film);
    document.body.classList.add('hide-overflow');
  };

  #removeFilmDetails = () => {
    this.#filmDetailsComponent.element.remove();
    this.#filmDetailsComponent = null;
    document.body.classList.remove('hide-overflow');
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#removeFilmDetails();
    }
  };
}

