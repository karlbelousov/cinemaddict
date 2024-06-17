import FooterStatisticsView from '../view/footer-statistics-view.js';
import { remove, render, replace } from '../framework/render.js';
import { UpdateType } from '../const.js';

export default class FooterStatisticsPresenter {
  #container = null;
  #footerStatistics = null;
  #filmModel = null;
  #filmCount = null;

  constructor(container, filmModel) {
    this.#container = container;
    this.#filmModel = filmModel;

    this.#filmModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#filmCount = this.#filmModel.films.length;

    const prevFooterStatistics = this.#footerStatistics;

    this.#footerStatistics = new FooterStatisticsView(this.#filmCount);

    if (prevFooterStatistics === null) {
      render(this.#footerStatistics, this.#container);
      return;
    }

    replace(this.#footerStatistics, prevFooterStatistics);

    remove(prevFooterStatistics);
  }

  #handleModelEvent = (updateType) => {
    if (updateType === UpdateType.INIT) {
      this.init();
    }
  };
}
