export const createFilmDetailsControlsTemplate = ({watchlist,  alreadyWatched, favorite}, isFilmUpdated) => `
  <section class="film-details__controls">
    <button
      type="button"
      class="
        film-details__control-button
        film-details__control-button--watchlist
        ${(watchlist) ? 'film-details__control-button--active' : ''}
      "
      id="watchlist"
      name="watchlist"
      ${isFilmUpdated ? 'disabled' : ''}
    >Add to watchlist
    </button>
    <button
      type="button"
      class="
        film-details__control-button
        film-details__control-button--watched
        ${(alreadyWatched) ? 'film-details__control-button--active' : ''}
      "
      id="watched"
      name="watched"
      ${isFilmUpdated ? 'disabled' : ''}
    >
      Already watched
    </button>
    <button
      type="button"
      class="
        film-details__control-button
        film-details__control-button--favorite
        ${(favorite) ? 'film-details__control-button--active' : ''}
      "
      id="favorite"
      name="favorite"
      ${isFilmUpdated ? 'disabled' : ''}
    >
      Add to favorites
    </button>
  </section>
  `;
