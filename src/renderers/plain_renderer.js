const renderObject = value => (value instanceof Object ? '[complex value]' : value);

const processRenderer = (node, parentName) => {
  const {
    name,
    type,
  } = node;

  const fullName = `${parentName}${name}`;
  const nameForChildren = `${parentName}${name}.`;

  if (type === 'nested') {
    return node.children.map(child => processRenderer(child, nameForChildren))
      .filter(el => el !== null).join('\n');
  }

  if (type === 'created') {
    return `Property '${fullName}' was added with value: ${renderObject(node.newValue)}`;
  }
  if (type === 'deleted') {
    return `Property '${fullName}' was removed`;
  }
  if (type === 'changed') {
    return `Property '${fullName}' was updated. From ${renderObject(node.oldValue)} to ${renderObject(node.newValue)}`;
  }
  return null;
};

const render = ast => ast.map(node => processRenderer(node, '')).join('\n');

export default render;
