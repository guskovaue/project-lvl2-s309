import { flattenDeep } from 'lodash';

const renderValue = (object, offset = 0) => {
  if (!(object instanceof Object)) {
    return object;
  }
  const padding = '  '.repeat(offset);

  const res = Object.keys(object).map((key) => {
    const value = object[key];
    if (value instanceof Object) {
      return `  ${padding}${key}: ${renderValue(value, offset + 1)}`;
    }
    return `    ${padding}${key}: ${value}`;
  });

  return flattenDeep([
    '{',
    res,
    `${padding}}`,
  ]).join('\n');
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
      return `${padding}+ ${name}: ${renderValue(node.newValue, offset + 1)}`;
    case 'changed':
      return [
        `${padding}- ${name}: ${renderValue(node.oldValue, offset + 1)}`,
        `${padding}+ ${name}: ${renderValue(node.newValue, offset + 1)}`,
      ];
    case 'deleted':
      return `${padding}- ${name}: ${renderValue(node.oldValue, offset + 1)}`;
    case 'unchanged':
      return `${padding}  ${name}: ${renderValue(node.oldValue, offset + 1)}`;
    default:
      throw new Error('Undefined node type');
  }
};

const render = ast => flattenDeep([
  '{',
  ast.map(node => processRenderer(node, 1)),
  '}',
]).join('\n');

export default render;
