import { generateComments } from '../mock/comments';

export default class CommentsModel {
  filmsModel = null;
  allComments = [];
  comments = [];

  constructor(filmsModel) {
    this.filmsModel = filmsModel;
    this.generateAllComments();
  }

  generateAllComments() {
    this.allComments = generateComments(this.filmsModel.getFilms());
  }


  getCommemts(film) {
    this.comments = film.comments.map((commentId) =>
      this.allComments.find((comment) =>
        comment.id === commentId)
    );

    return this.comments;
  }
}
