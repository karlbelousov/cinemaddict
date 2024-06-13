import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const formatStringToDateWithTime = (date) =>
  dayjs(date).format('YYYY/MM/DD/HH:mm');

const formatStringToDate = (date) =>
  dayjs(date).format('DD MMMM YYYY');

const formatStringToYear = (date) =>
  dayjs(date).format('YYYY');

const formatMinutesToTime = (minutes) =>
  dayjs.duration(minutes, 'minutes').format('H[h] mm[m]');

const sortFilmsByDate = (filmA, filmB) =>
  dayjs(filmB.filmInfo.release.date).diff(dayjs(filmA.filmInfo.release.date));

const sortFilmsByRating = (filmA, filmB) =>
  filmB.filmInfo.totalRating - filmA.filmInfo.totalRating;

export {
  formatStringToDateWithTime,
  formatStringToDate,
  formatStringToYear,
  formatMinutesToTime,
  sortFilmsByDate,
  sortFilmsByRating
};
