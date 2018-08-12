const renderObject = value => (value instanceof Object ? '[complex value]' : value);

const processRenderer = (node, parentName) => {
  const {
    name,
    type,
  } = node;

  const fullName = `${parentName}${name}`;
  const nameForChildren = `${parentName}${name}.`;

  switch (type) {
    case 'nested':
      return node.children.map(child => processRenderer(child, nameForChildren))
        .filter(el => el !== null).join('\n');
    case 'created':
      return `Property '${fullName}' was added with value: ${renderObject(node.newValue)}`;
    case 'changed':
      return `Property '${fullName}' was updated. From ${renderObject(node.oldValue)} to ${renderObject(node.newValue)}`;
    case 'deleted':
      return `Property '${fullName}' was removed`;
    default:
      return null;
  }
};

const render = ast => ast.map(node => processRenderer(node, '')).join('\n');

export default render;
