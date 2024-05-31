import {render, remove} from '../framework/render.js';
import FilmCardView from '../view/film-card-view.js';

export default class FilmPresenter {
  #container = null;
  #clickCarHandler = null;
  #filmCard = null;
  #film = null;

  constructor(container, clickCardHandler) {
    this.#container = container;
    this.#clickCarHandler = clickCardHandler
  }

  init = (film) => {
    this.#film = film;
    this.#filmCard = new FilmCardView(this.#film);
    this.#filmCard.setFilmCardClickHandler(() => this.#clickCarHandler(film));
    render(this.#filmCard, this.#container.element);
  }
}
