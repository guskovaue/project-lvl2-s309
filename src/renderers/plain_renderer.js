import { flattenDeep } from 'lodash';

const renderValue = value => (value instanceof Object ? '[complex value]' : value);

const render = (ast, parentName = '') => {
  const result = ast.filter(node => node.type !== 'unchanged')
    .map((node) => {
      const {
        name,
        type,
      } = node;

      const fullName = `${parentName}${name}`;
      const nameForChildren = `${parentName}${name}.`;

      switch (type) {
        case 'nested':
          return render(node.children, nameForChildren);
        case 'created':
          return `Property '${fullName}' was added with value: ${renderValue(node.newValue)}`;
        case 'changed':
          return `Property '${fullName}' was updated. From ${renderValue(node.oldValue)} to ${renderValue(node.newValue)}`;
        case 'deleted':
          return `Property '${fullName}' was removed`;
        default:
          throw new Error('Undefined node type');
      }
    });
  return flattenDeep(result).join('\n');
};

export default render;
