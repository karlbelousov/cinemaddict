import AbstractView from '../framework/view/abstract-view.js';
import {createFilmDetailsInfoTemplate} from './films-details-info-template.js';
import {createFilmDetailsCommentsTemplate} from './films-details-comments-template.js';
import {createFilmDetailsFormTemplate} from './films-details-form-template.js';
import { createFilmDetailsControlsTemplate } from './film-details-controls-template.js';

const createFilmDetailsTemplate = ({filmInfo, userDetails}, comments) => (
  `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      ${createFilmDetailsInfoTemplate(filmInfo)}
      ${createFilmDetailsControlsTemplate(userDetails)}
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        ${createFilmDetailsCommentsTemplate(comments)}

        ${createFilmDetailsFormTemplate()}

      </section>
    </div>
  </form>
</section>
`
);

export default class FilmDetailsView extends AbstractView {
  #film = null;
  #comments = null;

  constructor(film, comments) {
    super();
    this.#film = film;
    this.#comments = comments;
  }

  get template() {
    return createFilmDetailsTemplate(this.#film, this.#comments);
  }

  setFilmDetailsCloseButton = (callback) => {
    this._callback.closeButtonclick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeButtonHandler);
  }

  setWatchlistButtonClickHandler = (callback) => {
    this._callback.watchlistButtonClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler)
  }

  setWatchedButtonClickHandler = (callback) => {
    this._callback.watchedButtonClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler)
  }

  setFavoriteButtonClickHandler = (callback) => {
    this._callback.favoriteButtonClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler)
  }

  #closeButtonHandler = () => {
    this._callback.closeButtonclick();
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
