import render from './render';
import plainRender from './plain_render';

const renders = {
  plain: plainRender,
  undefined: render,
};

const chooseRender = (data, type) => renders[type](data);

export default chooseRender;
