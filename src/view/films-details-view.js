import AbstractView from '../framework/view/abstract-view.js';
import {createFilmDetailsInfoTemplate} from './films-details-info-template.js';
import {createFilmDetailsCommentsTemplate} from './films-details-comments-template.js';
import {createFilmDetailsFormTemplate} from './films-details-form-template.js';

const createFilmDetailsTemplate = ({filmInfo}, comments) => (
  `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      ${createFilmDetailsInfoTemplate(filmInfo)}
      <section class="film-details__controls">
        <button type="button" class="film-details__control-button film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--active film-details__control-button--watched" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
      </section>
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

  #closeButtonHandler = () => {
    this._callback.closeButtonclick();
  }
}
