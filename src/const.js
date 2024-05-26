const FILMS_COUNT_PER_STEP = 5;
const MAX_COMMENTS_ON_FILM = 7;

const FILTER_TYPE_ALL_NAME = 'All movies';

const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

const UserStatusValue = {
  NOVICE: 0,
  FAN: 10,
  MOVIE_BUFF: 20,
};


const UserStatusTitle = {
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie Buff',
};

export {
  FILMS_COUNT_PER_STEP,
   MAX_COMMENTS_ON_FILM,
   UserStatusTitle,
   UserStatusValue,
   FILTER_TYPE_ALL_NAME,
   FilterType
  };
