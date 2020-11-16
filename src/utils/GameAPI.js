import Errors from './Errors';

export default class GameAPI {
  static async loadRating(size, callback) {
    const url = `https://gem-puzzle-server.herokuapp.com/rating/list?s=${size}`;
    let obj = null;

    try {
      obj = await (await fetch(url)).json();
    } catch (e) {
      Errors.loadRating();
    }

    const timeRating = [...obj].sort((a, b) => a.time - b.time).slice(0, 10);
    const movesRating = [...obj].sort((a, b) => a.steps - b.steps).slice(0, 10);

    callback(timeRating, movesRating);
  }

  static async postRecord(name, size, time, moves, callback = () => {}) {
    const url = 'https://gem-puzzle-server.herokuapp.com/rating/new';

    const response = await fetch(url,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          size,
          time,
          steps: moves,
        }),
      });

    const content = await response.json();
    callback(content);
  }
}
