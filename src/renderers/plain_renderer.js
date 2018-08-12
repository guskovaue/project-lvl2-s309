const renderObject = value => (value instanceof Object ? '[complex value]' : value);

const flattenRenderer = (item, parentName) => {
  const {
    name,
    type,
    children,
  } = item;

  const fullName = name === 'root' ? '' : `${parentName}${name}`;
  const nameForChildren = name === 'root' ? '' : `${parentName}${name}.`;

  if (type === 'nested') {
    return children.map(child => flattenRenderer(child, nameForChildren))
      .filter(el => el !== null).join('\n');
  }

  if (type === 'created') {
    return `Property '${fullName}' was added with value: ${renderObject(item.newValue)}`;
  }
  if (type === 'deleted') {
    return `Property '${fullName}' was removed`;
  }
  if (type === 'changed') {
    return `Property '${fullName}' was updated. From ${renderObject(item.oldValue)} to ${renderObject(item.newValue)}`;
  }
  return null;
};

export default flattenRenderer;
