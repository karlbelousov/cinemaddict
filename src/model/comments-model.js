import Observable from '../framework/observable';

export default class CommentsModel extends Observable {
  #apiServices = null;
  #comments = [];
  #filmsModel = null;

  constructor(apiServices, filmsModel) {
    super();
    this.#apiServices = apiServices;
    this.#filmsModel = filmsModel;
  }

  get = async (film) => {
    this.#comments = await this.#apiServices.get(film);
    return this.#comments;
  };

  add = async (updateType, film, createdComment) => {
    try {
      const response = await this.#apiServices.add(film, createdComment);

      this.#comments = response.comments;

      this.#filmsModel.updateOnClient({
        updateType,
        update: response.movie,
        isAdapted: false
      });
    } catch (error) {
      throw new Error('Can\'t add comment');
    }
  };

  delete = async (updateType, film, deletedComment) => {
    const index = this.#comments.findIndex((comment) => comment.id === deletedComment.id);

    if  (index === -1) {
      throw new Error('Cant\'t update unexisting comment');
    }

    try {
      await this.#apiServices.delete(deletedComment);

      const updateFilm = {
        ...film,
        comments: [
          ...film.comments.slice(0, index),
          ...film.comments.slice(index + 1)
        ]
      };

      this.#filmsModel.updateOnClient({
        updateType,
        update: updateFilm,
        isAdapted: true,
      });
    } catch (error) {
      throw new Error('Can\'t delete comment');
    }
  };
}
