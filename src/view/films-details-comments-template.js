import he from 'he';
import {humanizeDate} from '../utils/film.js';

const createCommentTemplate = ({emotion, comment, author, date, id}, deleteCommentId) => (
  `<li class="film-details__comment" data-comment-id="${id}">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${he.encode(comment)}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${humanizeDate(date)}</span>
        <button
          class="film-details__comment-delete"
          data-comment-id="${id}"
          ${(id === deleteCommentId) ? 'disabled' : ''}

        >
          ${(id === deleteCommentId) ? 'Deleting' : 'Delete'}
        </button>
      </p>
    </div>
  </li>
  `
);

export const createFilmDetailsCommentsTemplate = (comments, deleteCommentId) =>
  `
    <ul class="film-details__comments-list">
      ${comments.map((comment) => createCommentTemplate(comment, deleteCommentId)).join('')}
    </ul>
  `;
