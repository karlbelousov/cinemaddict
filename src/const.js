const FILMS_COUNT_PER_STEP = 5;
const MAX_COMMENTS_ON_FILM = 7;

const FILTER_TYPE_ALL_NAME = 'All movies';

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating'
};

const FilterType = {
  ALL: 'all',
  WATCHLIST: 'wathlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

const EMOTION = ['smile', 'sleeping', 'puke', 'angry'];

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

const DESCRIPTION_MAX = 140;

const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  DELETE_COMMENT: 'DELETE_COMMENT',
  ADD_COMMENT: 'ADD_COMMENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1500,
};

export {
  FILMS_COUNT_PER_STEP,
  MAX_COMMENTS_ON_FILM,
  UserStatusTitle,
  UserStatusValue,
  FILTER_TYPE_ALL_NAME,
  FilterType,
  SortType,
  EMOTION,
  DESCRIPTION_MAX,
  UpdateType,
  UserAction,
  Method,
  TimeLimit
};
