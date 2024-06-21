import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {createFilmDetailsInfoTemplate} from './films-details-info-template.js';
import {createFilmDetailsCommentsTemplate} from './films-details-comments-template.js';
import {createFilmDetailsFormTemplate} from './films-details-form-template.js';
import { createFilmDetailsControlsTemplate } from './film-details-controls-template.js';

const createFilmDetailsTemplate = ({
  filmInfo, userDetails, comments,
  checkedEmotion, comment, isCommentLoadingError,
  isDisabled, deleteCommentId, isFilmUpdated
}) => (
  `<section class="film-details">
  <div class="film-details__inner">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      ${createFilmDetailsInfoTemplate(filmInfo)}
      ${createFilmDetailsControlsTemplate(userDetails, isFilmUpdated)}
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">
          ${(!isCommentLoadingError)
    ? `Comments <span class="film-details__comments-count">${comments.length}</span>`
    : 'Error loading comments' }
        </h3>

        ${(!isCommentLoadingError) ? createFilmDetailsCommentsTemplate(comments, deleteCommentId) : ''}

        ${createFilmDetailsFormTemplate(checkedEmotion, comment, isCommentLoadingError, isDisabled)}

      </section>
    </div>
  </div>
</section>
`
);

export default class FilmDetailsView extends AbstractStatefulView {
  constructor(film, comments, viewData, updateViewData, isCommentLoadingError) {
    super();
    this._state = FilmDetailsView.convertFilmToState(
      film,
      comments,
      viewData.emotion,
      viewData.comment,
      viewData.scrollPosition,
      isCommentLoadingError,
    );
    this.updateViewData = updateViewData;

    if (!isCommentLoadingError) {
      this.#setInnnerHandlers();
    }
  }

  get template() {
    return createFilmDetailsTemplate(this._state);
  }

  static convertFilmToState = (film,
    comments,
    checkedEmotion = null,
    comment = null,
    scrollPosition = 0,
    isCommentLoadingError = false
  ) => ({
    ...film,
    comments,
    isCommentLoadingError,
    checkedEmotion,
    comment,
    scrollPosition,
    isDisabled: false,
    isFilmUpdated: false,
    deleteCommentId: null
  });

  _restoreHandlers = () => {
    this.setScrollPosition();
    this.#setInnnerHandlers();
    this.setFilmDetailsCloseButton(this._callback.closeButtonclick);
    this.setWatchlistButtonClickHandler(this._callback.watchlistButtonClick);
    this.setWatchedButtonClickHandler(this._callback.watchedButtonClick);
    this.setFavoriteButtonClickHandler(this._callback.favoriteButtonClick);
    this.setCommentDeleteClickHandler(this._callback.commentDeleteClick);
  };

  setScrollPosition = () => {
    this.element.scrollTop = this._state.scrollPosition;
  };

  shakeControls = () => {
    const controlsElement = this.element.querySelector('.film-details__controls');
    this.shake.call({element: controlsElement});
  };

  shakeForm = () => {
    const formElement = this.element.querySelector('.film-details__new-comment');
    this.shake.call({element: formElement});
  };

  shakeComment = (commentId) => {
    const commentElement = this.element.querySelector(`li[data-comment-id='${commentId}']`);
    this.shake.call({element: commentElement});
  };

  #setInnnerHandlers = () => {
    this.element
      .querySelectorAll('.film-details__emoji-label')
      .forEach((element) => {
        element.addEventListener('click', this.#emotionClickHandler);
      });
    this.element
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this.#commentInputHandler);
  };

  #emotionClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      checkedEmotion: evt.currentTarget.dataset.emotionType,
      scrollPosition: this.element.scrollTop
    });
  };

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({comment: evt.target.value});
  };

  #commentDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#updateViewData();
    this._callback.commentDeleteClick(evt.target.dataset.commentId);
  };

  #updateViewData = () => {
    this.updateViewData({
      emotion: this._state.checkedEmotion,
      comment: this._state.comment,
      scrollPosition: this.element.scrollTop
    });
  };

  setFilmDetailsCloseButton = (callback) => {
    this._callback.closeButtonclick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeButtonHandler);
  };

  setWatchlistButtonClickHandler = (callback) => {
    this._callback.watchlistButtonClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
  };

  setWatchedButtonClickHandler = (callback) => {
    this._callback.watchedButtonClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler);
  };

  setFavoriteButtonClickHandler = (callback) => {
    this._callback.favoriteButtonClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  setCommentDeleteClickHandler = (callback) => {
    const commentDeleteElements = this.element.querySelectorAll('.film-details__comment-delete');

    if (commentDeleteElements) {
      this._callback.commentDeleteClick = callback;
      commentDeleteElements.forEach(
        (element) =>
          element.addEventListener('click', this.#commentDeleteClickHandler)
      );
    }
  };

  setCommentData = () => {
    this.#updateViewData();
  };

  #closeButtonHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeButtonclick();
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this.#updateViewData();
    this._callback.watchlistButtonClick();
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this.#updateViewData();
    this._callback.watchedButtonClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#updateViewData();
    this._callback.favoriteButtonClick();
  };
}
