const renderObject = (object, offset = 0) => {
  if (!(object instanceof Object)) {
    return object;
  }
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

const renderer = (item, offset = 0) => {
  const padding = '  '.repeat(offset);
  const {
    name,
    type,
    children,
  } = item;

  if (name === 'root') {
    return [
      '{',
      ...children.map(child => renderer(child, offset + 1)),
      '}',
    ].join('\n');
  }

  if (type === 'nested') {
    return [
      `  ${padding}${name}: {`,
      ...children.map(child => renderer(child, offset + 2)),
      `  ${padding}}`,
    ].join('\n');
  }

  if (type === 'created') {
    return `${padding}+ ${name}: ${renderObject(item.newValue, offset + 1)}`;
  }
  if (type === 'deleted') {
    return `${padding}- ${name}: ${renderObject(item.oldValue, offset + 1)}`;
  }
  if (type === 'unchanged') {
    return `${padding}  ${name}: ${renderObject(item.oldValue, offset + 1)}`;
  }
  return `${padding}- ${name}: ${renderObject(item.oldValue, offset + 1)}\n${padding}+ ${name}: ${renderObject(item.newValue, offset + 1)}`;
};

export default renderer;
