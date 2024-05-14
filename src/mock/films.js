import { getRandomInteger, getRandomValue } from '../utils';
import { MAX_COMMENTS_ON_FILM } from '../const';

const titles = [
  'Country On Him',
  'Raiders With The Carpet',
  'Guest Who Sold The Darkness',
];

const alternativeTitles = [
  'Laziness Who Sold Themselves',
  'The Great Flamarion',
  'Sagebrush Trai'
];

const posters = [
  'images/posters/made-for-each-other.png',
  'images/posters/popeye-meets-sinbad.png',
  'images/posters/sagebrush-trail.jpg',
  'images/posters/santa-claus-conquers-the-martians.jpg',
  'images/posters/the-dance-of-life.jpg',
  'images/posters/the-great-flamarion.jpg',
  'images/posters/the-man-with-the-golden-arm.jpg'
];

const descriptions = [
  'Oscar-winning film, a war drama about two young people, from the creators of timeless classic \'Nu, Pogodi!\' and \'Alice in Wonderland\', with the best fight scenes since Bruce Lee',
  'ligula feugiat eget. Fusce tristique felis at fermentum pharetra.',
  'Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante'
];

const generateFilm = () => ({
  title: getRandomValue(titles),
  alternativeTitle: getRandomValue(alternativeTitles),
  totalRating: 5.3,
  poster: getRandomValue(posters),
  ageRating: 0,
  director: "Tom Ford",
  writers: [
    "Takeshi Kitano"
  ],
  actors: [
    "Morgan Freeman"
  ],
  release: {
    date: "2019-05-11T00:00:00.000Z",
    releaseCountry: "Finland"
  },
  runtime: 77,
  genre: [
    "Comedy"
  ],
  description: getRandomValue(descriptions)
});

const generateFilms = () => {
   // Создаем массив с данными о фильмах
   const films = Array.from({length: 6}, generateFilm);

   // Ключ totalCommentsCount нужен нам для того, чтобы у фильмов не повторялись id комментариев, ведь не может быть, чтобы один комментарий относился к нескольким фильмам
  let totalCommentsCount = 0;

  return films.map((film, index) => {
    const hasComments = getRandomInteger(0, 1);

    const filmCommentsCount = (hasComments)
      ? getRandomInteger(1, MAX_COMMENTS_ON_FILM)
      : 0;

    // Логика такая: суммируем все id комментариев...
    totalCommentsCount += filmCommentsCount;

    return {
      id: String(index + 1), // id - просто порядковый номер
      comments: (hasComments)
        ? Array.from(
          {length: filmCommentsCount},
          // ...и раздаём их по порядку с конца
          (_value, commentIndex) => String(totalCommentsCount - commentIndex)
        ) : [],
      filmInfo: film,
    };
  });
};

export {generateFilms};
