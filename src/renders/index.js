import render from './render';
import flattenRender from './flatten_render';

const renders = {
  plain: flattenRender,
  undefined: render,
};

const chooseRender = (data, type) => renders[type](data);

export default chooseRender;
