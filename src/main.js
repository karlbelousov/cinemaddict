import HeaderProfileView from './view/header-profile-view.js';
import FilterView from './view/filter-view.js';
import FooterStatistics from './view/footer-statistics-view.js';
import FilmsPresenter from './presenter/films-presenter.js';
import {render} from './render.js';
import FilmsModel from './model/fillms-model.js';
import CommentsModel from './model/comments-model.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerStatistics = document.querySelector('.footer__statistics');

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel(filmsModel);

const filmsPresenter = new FilmsPresenter();

render(new HeaderProfileView(), siteHeaderElement);
render(new FilterView(), siteMainElement);
render(new FooterStatistics(), footerStatistics);

filmsPresenter.init(siteMainElement, filmsModel, commentsModel);
