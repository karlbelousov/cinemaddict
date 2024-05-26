import AbstractView from '../framework/view/abstract-view.js';

const createFooterStatisticsTemplate = (filmCount) => `<p>${filmCount} movies inside</p>`;

export default class FooterStatisticsView extends AbstractView {
  #filmCount = null;

  constructor(filmCount) {
    super();
    this.#filmCount = filmCount;
  }

  get template() {
    return createFooterStatisticsTemplate(this.#filmCount);
  }
}
