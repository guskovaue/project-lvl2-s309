import render from './render';
import ftatten_render from './flatten_render';

const renders = {
  plain: ftatten_render,
  undefined: render,
};

const chooseRender = (data, type) => renders[type](data);

export default chooseRender;