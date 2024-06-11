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
}
