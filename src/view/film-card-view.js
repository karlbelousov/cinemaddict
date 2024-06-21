import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { createFilmsCardInfoTemplate } from './film-card-info-template.js';
import { createFilmCardControlsTemplate } from './film-card-controls-template.js';

const createFilmCardTemplate = ({filmInfo, comments, userDetails, isDisabled}) =>
  `
    <article class="film-card">

       ${createFilmsCardInfoTemplate(filmInfo, comments.length)}

       ${createFilmCardControlsTemplate(userDetails, isDisabled)}

    </article>
  `;

export default class FilmCardView extends AbstractStatefulView {
  constructor(film) {
    super();
    this._state = FilmCardView.convertFilmToState(film);
  }

  static convertFilmToState = (film) => ({
    ...film,
    isDisabled: false,
  });

  get template() {
    return createFilmCardTemplate(this._state);
  }

  _restoreHandlers = () => {
    this.setFilmCardClickHandler(this._callback.filmCardClick);
    this.setWatchlistButtonClickHandler(this._callback.watchlistButtonClick);
    this.setWatchedButtonClickHandler(this._callback.watchedButtonClick);
    this.setFavoriteButtonClickHandler(this._callback.favoriteButtonClick);
  };

  shakeControls = () => {
    const controlsElement = this.element.querySelector('.film-card__controls');
    this.shake.call({element: controlsElement});
  };

  setFilmCardClickHandler = (callback) => {
    this._callback.filmCardClick = callback;
    this.element.querySelector('a').addEventListener('click', this.#fimCardClickHundler);
  };

  setWatchlistButtonClickHandler = (callback) => {
    this._callback.watchlistButtonClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchlistClickHandler);
  };

  setWatchedButtonClickHandler = (callback) => {
    this._callback.watchedButtonClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#watchedClickHandler);
  };

  setFavoriteButtonClickHandler = (callback) => {
    this._callback.favoriteButtonClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  #fimCardClickHundler = (evt) => {
    evt.preventDefault();
    this._callback.filmCardClick();
  };

  #watchlistClickHandler = () => {
    this._callback.watchlistButtonClick();
  };

  #watchedClickHandler = () => {
    this._callback.watchedButtonClick();
  };

  #favoriteClickHandler = () => {
    this._callback.favoriteButtonClick();
  };
}
