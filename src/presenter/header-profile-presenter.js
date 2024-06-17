import HeaderProfileView from '../view/header-profile-view.js';
import { getUserStatus } from '../utils/user.js';
import { remove, render, replace } from '../framework/render.js';

export default class HeaderProfilePresenter {
  #container = null;
  #headerProfile = null;
  #filmModel = null;
  #userStatus = null;

  constructor(container, filmModel) {
    this.#container = container;
    this.#filmModel = filmModel;

    this.#filmModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#userStatus = getUserStatus(this.#filmModel.films);

    const prevHeaderProfile = this.#headerProfile;

    this.#headerProfile = new HeaderProfileView(this.#userStatus);

    if (prevHeaderProfile === null) {
      render(this.#headerProfile, this.#container);
      return;
    }

    replace(this.#headerProfile, prevHeaderProfile);

    remove(prevHeaderProfile);
  }

  #handleModelEvent = () => {
    this.init();
  };
}
