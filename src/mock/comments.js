import { getRandomInteger, getRandomValue } from '../utils';

const comments = [
  'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
  'Interesting setting and a good cast',
  'Booooooooooring',
  'Very very old. Meh',
  'Almost two hours? Seriously?'
];

const authors = [
  'John Doe',
  'Ilya O\'Reilly',
  'Tim Macoveev'
];

const emotions = [
  'smile',
  'sleeping',
  'puke',
  'angry'
];

const generateComment = () => ({
  'id': getRandomInteger(0, 100),
  'author': getRandomValue(authors),
  'comment': getRandomValue(comments),
  'date': '2019-05-11T16:12:32.554Z',
  'emotion': getRandomValue(emotions)
});

const getCommentCount = (films) => films.reduce(
  (count, film) => count + film.comments.length, 0
);

const generateComments = (films) => {
  const commentCount = getCommentCount(films);

  return Array.from({length: commentCount}, (_value, index) => {
    const commentItem = generateComment();

    return {
      id: String(index + 1),
      ...commentItem,
    };
  });
};

export { generateComments };
