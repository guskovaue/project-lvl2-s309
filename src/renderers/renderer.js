import { flattenDeep } from 'lodash';

const renderObject = (object, offset = 0) => {
  if (!(object instanceof Object)) {
    return object;
  }
  const padding = '  '.repeat(offset);

  const res = Object.keys(object).map((key) => {
    const value = object[key];
    if (value instanceof Object) {
      return `  ${padding}${key}: ${renderObject(value, offset + 1)}`;
    }
    return `    ${padding}${key}: ${value}`;
  }).join('\n');
  return `{\n${res}\n${padding}}`;
};

const processRenderer = (node, offset = 1) => {
  const padding = '  '.repeat(offset);
  const {
    name,
    type,
  } = node;

  switch (type) {
    case 'nested':
      return [
        `${padding}  ${name}: {`,
        node.children.map(child => processRenderer(child, offset + 2)),
        `${padding}  }`,
      ];
    case 'created':
      return `${padding}+ ${name}: ${renderObject(node.newValue, offset + 1)}`;
    case 'changed':
      return [
        `${padding}- ${name}: ${renderObject(node.oldValue, offset + 1)}`,
        `${padding}+ ${name}: ${renderObject(node.newValue, offset + 1)}`,
      ];
    case 'deleted':
      return `${padding}- ${name}: ${renderObject(node.oldValue, offset + 1)}`;
    default:
      return `${padding}  ${name}: ${renderObject(node.oldValue, offset + 1)}`;
  }
};

const render = ast => flattenDeep([
  '{',
  ast.map(node => processRenderer(node, 1)),
  '}',
]).join('\n');

export default render;
