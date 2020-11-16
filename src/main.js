import { from } from 'webpack-sources/lib/CompatSource';

import GUI from './GUI/GUI';

const gui = new GUI(4);
gui.appendTo(document.body);
gui.newGame();

window.addEventListener('resize', () => {
  gui.updateTilesSize();
});
