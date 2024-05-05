import SortView from '../view/sort-view.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmDetailsView from '../view/films-details-view.js';
import { render } from '../render.js';

export default class FilmsPresenter {
  sortComponent = new SortView();
  filmsComponent = new FilmsView();
  filmsListComponent = new FilmsListView();
  filmsListContainerComponent = new FilmsListContainerView();
  showMoreButtonView = new ShowMoreButtonView();

  init = (container, filmsModel, commentsModel) => {
    this.container = container;
    this.filmsModel = filmsModel;
    this.commentsModel = commentsModel;

    this.films = [...filmsModel.getFilms()];

    render(this.sortComponent, this.container);
    render(this.filmsComponent, this.container);
    render(this.filmsListComponent, this.filmsComponent.getElement());
    render(this.filmsListContainerComponent, this.filmsListComponent.getElement());

    for (let i = 0; i < this.films.length; i++) {
      render(new FilmCardView(this.films[i]), this.filmsListContainerComponent.getElement());
    }

    render(this.showMoreButtonView, this.filmsListComponent.getElement());

    const comments = [...this.commentsModel.getComments(this.films[0])];

    render(new FilmDetailsView(this.films[0], comments), this.container.parentElement);
  };
}
