import { createElement } from '../render';

const createFilmListEmptyTemplate = () => (
  `
    <section class="films-list">
      <h2 class="films-list__title">There are no movies in our database</h2>
    </section>
  `
);

export default class FilmListEmptyView {
  #element = null;

  get template() {
    return createFilmListEmptyTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
