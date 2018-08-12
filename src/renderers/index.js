import renderer from './renderer';
import plainRenderer from './plain_renderer';
import jsonRenderer from './json_renderer';

const renderers = {
  plain: plainRenderer,
  json: jsonRenderer,
  stylish: renderer,
};

const chooseRenderer = (data, type) => renderers[type](data);

export default chooseRenderer;
