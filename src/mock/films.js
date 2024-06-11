import {getRandomInteger, getRandomValue} from '../utils/common.js';
import {
  NAME_COUNT, MAX_COMMENTS_ON_FILM, GenreCount, Rating,
  AgeRating, Runtime, YearsDuration, DaysDuration, DateType,
  names, surnames, titles, posters, genres, description, countries,
} from './const.js';


const getDate = (type) => {
  const date = new Date();

  switch (type) {
    case DateType.FILM_INFO:
      date.setFullYear(
        date.getFullYear() - getRandomInteger(YearsDuration.MIN, YearsDuration.MAX)
      );
      break;
    case DateType.USER_DETAILS:
      date.setDate(
        date.getDate() - getRandomInteger(DaysDuration.MIN, DaysDuration.MAX)
      );
      break;
  }

  return date.toISOString();
};

const generateFilm = () => ({
  title: getRandomValue(titles),
  alternativeTitle: getRandomValue(titles),
  totalRating: getRandomInteger(Rating.MIN, Rating.MAX),
  poster: getRandomValue(posters),
  ageRating: getRandomInteger(AgeRating.MIN, AgeRating.MAX),
  director: `${getRandomValue(names)} ${getRandomValue(surnames)}`,
  writers: Array.from({length: NAME_COUNT}, () => `${getRandomValue(names)} ${getRandomValue(surnames)}`),
  actors: Array.from({length: NAME_COUNT}, () => `${getRandomValue(names)} ${getRandomValue(surnames)}`),
  release: {
    date: getDate(DateType.FILM_INFO),
    releaseСountry: getRandomValue(countries)
  },
  runtime: getRandomInteger(Runtime.MIN, Runtime.MAX),
  genre:  Array.from({length: getRandomInteger(GenreCount.MIN, GenreCount.MAX)}, () => getRandomValue(genres)),
  description
});

const generateFilms = () => {
   // Создаем массив с данными о фильмах
   const films = Array.from({length: 20}, generateFilm);

   // Ключ totalCommentsCount нужен нам для того, чтобы у фильмов не повторялись id комментариев, ведь не может быть, чтобы один комментарий относился к нескольким фильмам
  let totalCommentsCount = 0;

  const getWatchingDate = () => getDate(DateType.USER_DETAILS);

  const alreadyWatched = Boolean(getRandomInteger(0, 1));

  return films.map((film, index) => {
    const hasComments = getRandomInteger(0, 1);

    const filmCommentsCount = (hasComments)
      ? getRandomInteger(1, MAX_COMMENTS_ON_FILM)
      : 0;

    // Логика такая: суммируем все id комментариев...
    totalCommentsCount += filmCommentsCount;

    return {
      id: index + 1, // id - просто порядковый номер
      comments: (hasComments)
        ? Array.from(
          {length: filmCommentsCount},
          // ...и раздаём их по порядку с конца
          (_value, commentIndex) => String(totalCommentsCount - commentIndex)
        ) : [],
      filmInfo: film,
      userDetails: {
        watchlis: Boolean(getRandomInteger(0, 1)),
        alreadyWatched,
        watchingDate: (alreadyWatched) ? getWatchingDate() : null,
        favorite: Boolean(getRandomInteger(0, 1))
      }
    };
  });
};

export {generateFilms};
