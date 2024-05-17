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
    this.element.querySelector('a').addEventListener('click', this.#clickHundler);
  }

  #clickHundler = (evt) => {
    evt.preventDefault();
    this._callback.filmCardClick();
  }
}
