import HeaderProfileView from './view/header-profile-view.js';
import FilterView from './view/filter-view.js';
import FooterStatistics from './view/footer-statistics-view.js';

import FilmsPresenter from './presenter/films-presenter.js';
import FilmsModel from './model/fillms-model.js';
import CommentsModel from './model/comments-model.js';
import FilterModel from './model/filter-model.js';

import {render} from './framework/render.js';
import {getUserStatus} from './utils/user.js';
import {generateFilter} from './mock/fillter.js';
import FilterModel from './model/filter-model.js';

const bodyElement = document.querySelector('body');
const siteHeaderElement = bodyElement.querySelector('.header');
const siteMainElement = bodyElement.querySelector('.main');
const siteFooterElement = bodyElement.querySelector('.footer');
const footerStatistics = siteFooterElement.querySelector('.footer__statistics');

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel(filmsModel);
const filterModel = new FilterModel();

const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel, commentsModel);

const userStatus = getUserStatus(filmsModel.films);
const filters = generateFilter(filmsModel.films);
const filmCount = filmsModel.films.length;

render(new HeaderProfileView(userStatus), siteHeaderElement);
render(new FilterView(filters), siteMainElement);
render(new FooterStatistics(filmCount), footerStatistics);

filmsPresenter.init();
