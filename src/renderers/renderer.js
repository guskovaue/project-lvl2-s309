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

const processRenderer = (node, offset = 1) => {
  const padding = '  '.repeat(offset);
  const {
    name,
    type,
  } = node;

  if (type === 'nested') {
    return [
      `  ${padding}${name}: {`,
      ...node.children.map(child => processRenderer(child, offset + 2)),
      `  ${padding}}`,
    ].join('\n');
  }
  if (type === 'created') {
    return `${padding}+ ${name}: ${renderObject(node.newValue, offset + 1)}`;
  }
  if (type === 'deleted') {
    return `${padding}- ${name}: ${renderObject(node.oldValue, offset + 1)}`;
  }
  if (type === 'unchanged') {
    return `${padding}  ${name}: ${renderObject(node.oldValue, offset + 1)}`;
  }
  return `${padding}- ${name}: ${renderObject(node.oldValue, offset + 1)}\n${padding}+ ${name}: ${renderObject(node.newValue, offset + 1)}`;
};

const render = (ast) => {
  const res = ast.map(node => processRenderer(node)).join('\n');
  return `{\n${res}\n}\n`;
};

export default render;
