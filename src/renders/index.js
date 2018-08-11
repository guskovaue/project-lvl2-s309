import render from './render';
import plainRender from './plain_render';
import jsonRender from './json_render';

const renders = {
  plain: plainRender,
  json: jsonRender,
  undefined: render,
};

const chooseRender = (data, type) => renders[type](data);

export default chooseRender;
