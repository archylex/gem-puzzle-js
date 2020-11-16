export default class Errors {
  static parentInvalid(v) {
    console.error(`It's a control error.\nParent for ${v} was invalid.`);
  }

  static localStorageNotFound(v) {
    console.error(`It's a control error.\n${v} doesn't found in the local storage.`);
  }

  static localStorageSupport() {
    console.error('It\'s a control error.\nThe browser doesn\'t support a local storage.');
  }

  static loadRating() {
    console.error('It\'s a control error.\nThe server doesn\'t response.');
  }
}
