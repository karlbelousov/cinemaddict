import Observable from '../framework/observable';
import { generateComments } from '../mock/comments';

export default class CommentsModel extends Observable {
  #filmsModel = null;
  #allComments = [];
  #comments = [];

  constructor(filmsModel) {
    super();
    this.#filmsModel = filmsModel;
    this.#generateAllComments();
  }

  #generateAllComments() {
    this.#allComments = generateComments(this.#filmsModel.films);
  }

  get(film) {
    this.#comments = film.comments.map((commentId) =>
      this.#allComments.find((comment) =>
        comment.id === commentId)
    );

    return this.#comments;
  }

  addComment = (updateType, update) => {
    this.#allComments.push(update);
    this._notify(updateType, update);
  };

  deleteComment = (updateType, update) => {
    const index = this.#allComments.findIndex((comment) => comment.id === update.id);

    if  (index === -1) {
      throw new Error('Cant\'t update unexisting comment');
    }

    this.#allComments = [
      ...this.#allComments.slice(0, index),
      ...this.#allComments.slice(index + 1),
    ];

    this._notify(updateType);
  };
}
