import AbstractView from '../framework/view/abstract-view.js';
import { createFilmsCardInfoTemplate } from './film-card-info-template.js';
import { createFilmCardControlsTemplate } from './film-card-controls-template.js';

const createFilmCardTemplate = ({filmInfo, comments}) =>
  `
    <article class="film-card">

       ${createFilmsCardInfoTemplate(filmInfo, comments.length)}

       ${createFilmCardControlsTemplate()}

    </article>
  `;

export default class FilmCardView extends AbstractView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  setFilmCardClickHandler = (callback) => {
    this._callback.filmCardClick = callback;
    this.element.querySelector('a').addEventListener('click', this.#fimCardClickHundler);
  }

  setWatchlistButtonClickHandler = (callback) => {
    this._callback.watchlistButtonClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchlistClickHandler)
  }

  setWatchedButtonClickHandler = (callback) => {
    this._callback.watchedButtonClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#watchedClickHandler)
  }

  setFavoriteButtonClickHandler = (callback) => {
    this._callback.favoriteButtonClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler)
  }

  #fimCardClickHundler = (evt) => {
    evt.preventDefault();
    this._callback.filmCardClick();
  }

  #watchlistClickHandler = () => {
    this._callback.watchlistButtonClick();
  }

  #watchedClickHandler = () => {
    this._callback.watchedButtonClick();
  }

  #favoriteClickHandler = () => {
    this._callback.favoriteButtonClick();
  }
}
