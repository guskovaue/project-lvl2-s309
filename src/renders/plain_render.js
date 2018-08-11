const flattenRender = (item, parentName) => {
  const {
    name,
    oldValue,
    newValue,
    children,
  } = item;

  const fullName = name === 'root' ? '' : `${parentName}${name}`;
  const nameForChildren = name === 'root' ? '' : `${parentName}${name}.`;

  if (children.length) {
    return children.map((child) => flattenRender(child, nameForChildren)
    ).filter(el => el !== null).join('\n');
  }

  const oval = oldValue instanceof Object ? '[complex value]' : oldValue;
  const nval = newValue instanceof Object ? '[complex value]' : newValue;

  if (oldValue === null) {
    return `Property '${fullName}' was added with value: ${nval}`;
  }
  if (newValue === null) {
    return `Property '${fullName}' was removed`;
  }
  if (oldValue !== newValue) {
    return `Property '${fullName}' was updated. From ${oval} to ${nval}`;
  }

  return null;
};

export default flattenRender;
