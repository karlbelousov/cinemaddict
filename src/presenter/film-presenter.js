import {render, replace, remove} from '../framework/render.js';
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
    const prevFilmCard = this.#filmCard;

    this.#film = film;
    this.#filmCard = new FilmCardView(this.#film);
    this.#filmCard.setFilmCardClickHandler(() => this.#clickCarHandler(film));

    // Проверка на наличие в DOM необходима,
    // чтобы не пытаться заменить то, что не было отрисовано
    if (prevFilmCard === null) {
      render(this.#filmCard, this.#container.element);
      return;
    }

    if (this.#container.contains(prevFilmCard.element)) {
      replace(this.#filmCard, prevFilmCard);
    }

    remove(prevFilmCard);
  };

  destroy = () => {
    remove(this.#filmCard);
  };
}
