const renderObject = (object, offset = 0) => {
  const padding = '  '.repeat(offset);
  return [
    '{',
    ...Object.keys(object).map((key) => {
      const value = object[key];
      if (value instanceof Object) {
        return [
          `  ${padding}${key}: `,
          ...renderObject(value, offset + 1),
        ].join('');
      }
      return `    ${padding}${key}: ${value}`;
    }),
    `${padding}}`,
  ].join('\n');
};

const render = (item, offset = 0) => {
  const padding = '  '.repeat(offset);
  const {
    name,
    oldValue,
    newValue,
    children,
  } = item;

  if (name === 'root') {
    return [
      '{',
      ...children.map(child => render(child, offset + 1)),
      '}',
    ].join('\n');
  }

  if (children.length) {
    return [
      `  ${padding}${name}: {`,
      ...children.map(child => render(child, offset + 2)),
      `  ${padding}}`,
    ].join('\n');
  }

  const oval = oldValue instanceof Object ? renderObject(oldValue, offset + 1) : oldValue;
  const nval = newValue instanceof Object ? renderObject(newValue, offset + 1) : newValue;

  if (oldValue === null) {
    return `${padding}+ ${name}: ${nval}`;
  }
  if (newValue === null) {
    return `${padding}- ${name}: ${oval}`;
  }
  if (oldValue === newValue) {
    return `${padding}  ${name}: ${oval}`;
  }
  return `${padding}- ${name}: ${oval}\n${padding}+ ${name}: ${nval}`;
};

export default render;
