import HeaderProfileView from './view/header-profile-view.js';
import FooterStatistics from './view/footer-statistics-view.js';
import FilmsPresenter from './presenter/films-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmsModel from './model/fillms-model.js';
import CommentsModel from './model/comments-model.js';
import FilterModel from './model/filter-model.js';
import {render} from './framework/render.js';
import {getUserStatus} from './utils/user.js';
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

const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel, commentsModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filmsModel, filterModel);

const userStatus = getUserStatus(filmsModel.films);
const filmCount = filmsModel.films.length;

render(new HeaderProfileView(userStatus), siteHeaderElement);
render(new FooterStatistics(filmCount), footerStatistics);

filterPresenter.init();
filmsPresenter.init();
