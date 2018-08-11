const flattenRender = (item) => {
  const {
    name,
    oldValue,
    newValue,
    children,
  } = item;

  if (children.length) {
    return [
      ...children.map(child => {
        if (name !== 'root') {
          child.name = `${name}.${child.name}`;
        }
        return flattenRender(child);
      }),
    ].join('\n');
  }

  const oval = oldValue instanceof Object ? '[complex value]' : oldValue;
  const nval = newValue instanceof Object ? '[complex value]' : newValue;

  if (oldValue === null) {
    return `Property '${name}' was added with value: ${nval}`;
  }
  if (newValue === null) {
    return `Property '${name}' was removed`;
  }
  if (oldValue !== newValue) {
    return `Property '${name}' was updated. From ${oval} to ${nval}`;
  }
};

export default flattenRender;
