import {render, replace, remove} from '../framework/render.js';
import FilmDetailsView from '../view/films-details-view.js';
import { UpdateType, UserAction } from '../const.js';
import { nanoid } from 'nanoid';

export default class FilmDetailsPresenter  {
  #container = null;

  #changeData = null;
  #closeButtonClickHandler = null;
  #escKeyDownHandler = null;

  #filmDetails = null;

  #film = null;
  #comments = null;

  #viewData = {
    emotion: null,
    comment: null,
    scrollPosition: 0
  };

  constructor(container, changeData, closeButtonClickHandler, escKeyDownHandler) {
    this.#container = container;
    this.#changeData = changeData;
    this.#closeButtonClickHandler = closeButtonClickHandler;
    this.#escKeyDownHandler = escKeyDownHandler;
  }

  init = (film, comments) => {
    this.#film = film;
    this.#comments = comments;

    const prevFilmDetails = this.#filmDetails;

    this.#filmDetails = new FilmDetailsView(
      this.#film,
      this.#comments,
      this.#viewData,
      this.#updateViewData
    );

    this.#filmDetails.setFilmDetailsCloseButton(() => {
      this.#closeButtonClickHandler();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    });
    this.#filmDetails.setWatchlistButtonClickHandler(this.#watchlistButtonHandler);
    this.#filmDetails.setWatchedButtonClickHandler(this.#watchedButtonHandler);
    this.#filmDetails.setFavoriteButtonClickHandler(this.#favoriteButtonHandler);
    this.#filmDetails.setCommentDeleteClickHandler(this.#commentDeleteClickHandler);

    if (prevFilmDetails === null) {
      render(this.#filmDetails, this.#container);
      return;
    }

    replace(this.#filmDetails, prevFilmDetails);

    this.#filmDetails.setScrollPosition();

    remove(prevFilmDetails);
  };

  destroy = () => {
    remove(this.#filmDetails);
  };

  clearViewData = () => {
    this.#updateViewData({
      comment: null,
      emotion: null,
      scrollPosition: this.#viewData.scrollPosition
    });
  };

  createComment = () => {
    this.#filmDetails.setCommentData();

    const {emotion, comment} = this.#viewData;

    if (emotion && comment) {
      const newCommentId  = nanoid();

      const createdComment = {
        id: newCommentId,
        author: 'Olof',
        date: new Date(),
        emotion,
        comment
      };

      this.#changeData(
        UserAction.ADD_COMMENT,
        UpdateType.PATCH,
        {
          ...this.#film,
          comments: [
            ...this.#film.comments,
            newCommentId,
          ]
        },
        createdComment
      );
    }
  };

  #updateViewData = (viewData) => {
    this.#viewData = {...viewData};
  };

  #watchlistButtonHandler = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MAJOR,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          watchlist: !this.#film.userDetails.watchlist
        },
      });
  };

  #watchedButtonHandler = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MAJOR,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          alreadyWatched: !this.#film.userDetails.alreadyWatched
        },
      });
  };

  #favoriteButtonHandler = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MAJOR,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          favorite: !this.#film.userDetails.favorite
        },
      });
  };

  #commentDeleteClickHandler = (commentId) => {
    const filmCommentIdIndex = this.#film.comments.findIndex((filmCommentId) => filmCommentId === commentId);

    const deletedComment = this.#comments.find((comment) => comment.id === commentId);

    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      {
        ...this.#film,
        comments: [
          ...this.#film.comments.slice(0, filmCommentIdIndex),
          ...this.#film.comments.slice(filmCommentIdIndex + 1)
        ]
      },
      deletedComment
    );
  };
}
