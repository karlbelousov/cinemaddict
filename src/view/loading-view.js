import AbstractView from '../framework/view/abstract-view';

const loadingTemplate = () => (
  `
    <main class="main">
    <nav class="main-navigation">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">0</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">0</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">0</span></a>
    </nav>

    <section class="films">
      <section class="films-list">
        <h2 class="films-list__title">Loading...</h2>
      </section>
    </section>
  `
);

export default class LoadingView extends AbstractView {
  get template() {
    return loadingTemplate();
  }
}
