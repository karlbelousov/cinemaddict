import FilmsPresenter from './presenter/films-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import HeaderProfilePresenter from './presenter/header-profile-presenter.js';
import FooterStatisticsPresenter from './presenter/footer-statistics-presenter.js';
import FilmsModel from './model/fillms-model.js';
import CommentsModel from './model/comments-model.js';
import FilterModel from './model/filter-model.js';
const bodyElement = document.querySelector('body');
const siteHeaderElement = bodyElement.querySelector('.header');
const siteMainElement = bodyElement.querySelector('.main');
const siteFooterElement = bodyElement.querySelector('.footer');
const footerStatistics = siteFooterElement.querySelector('.footer__statistics');
import FilmApiServices from './api-services/films-api-services.js';
import CommentsApiServices from './api-services/comments-api-services.js';

const AUTHORIZATION = 'Basic veiyvugvwuggvwugvw';
const END_POINT = 'https://17.ecmascript.htmlacademy.pro/cinemaddict';

const filmsModel = new FilmsModel(new FilmApiServices(END_POINT, AUTHORIZATION));
const commentsModel = new CommentsModel(new CommentsApiServices(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();

const headerProfilePresenter = new HeaderProfilePresenter(siteHeaderElement, filmsModel);
const footerStatisticsPresenter = new FooterStatisticsPresenter(footerStatistics, filmsModel);
const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel, commentsModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filmsModel, filterModel);

headerProfilePresenter.init();
footerStatisticsPresenter.init();
filterPresenter.init();
filmsPresenter.init();
filmsModel.init();

