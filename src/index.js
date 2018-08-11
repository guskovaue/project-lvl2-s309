import fs from 'fs';
import path from 'path';
import { has, union } from 'lodash';
import parser from './parser';

 const propertyActions1 = [
     {
      getNewValue: o2 => 0,
      getOldValue: o1 => 0,
      getChildren: (o1, o2) => makeAst(o1, o2),
      check: (o1, o2) => o1 instanceof Object && o2 instanceof Object,
    },
    {
      getNewValue: o2 => o2,
      getOldValue: o1 => o1,
      getChildren: (o1, o2) => [],
      check: (o1, o2) => o1 !== undefined && o2 !== undefined,
    },
    {
      getNewValue: o2 => null,
      getOldValue: o1 => o1,
      getChildren: (o1, o2) => [],
      check: (o1, o2) => o1 !== undefined,
    },
    {
      getNewValue: o2 => o2,
      getOldValue: o1 => null,
      getChildren: (o1, o2) => [],
      check: (o1, o2) => o2 !== undefined,
    },
  ];

const processItem = (o1, o2, name) => {
  const getPropertyAction = (o1, o2) => propertyActions1.find(({ check }) => check(o1, o2));
  const { 
    getOldValue,
    getNewValue,
    getChildren,
  } = getPropertyAction(o1, o2);

  return { 
    name, 
    oldValue: getOldValue(o1),
    newValue: getNewValue(o2),
    children: getChildren(o1, o2),
  };
}

const makeAst = (obj1, obj2) => {
  const commonKeys = union(Object.keys(obj1), Object.keys(obj2));
  return commonKeys.map(name => processItem(obj1[name], obj2[name], name));
};

export const genDiff = (firstFile, secondFile) => {
  const data1 = fs.readFileSync(firstFile, 'utf8');
  const data2 = fs.readFileSync(secondFile, 'utf8');
  const ext1 = path.extname(firstFile);
  const ext2 = path.extname(secondFile);
  
  const cfgData1 = parser[ext1](data1);
  const cfgData2 = parser[ext2](data2);

  return processItem(cfgData1, cfgData2, 'root');
}

const renderObject = (object, offset = 0) => {
  const padding = '  '.repeat(offset);
  return [
    `{`,
    ...Object.keys(object).map(key => {
      const value = object[key];
      if (value instanceof Object) {
        return [
          `  ${padding}${key}: `,
          ...renderObject(value, offset + 1)
        ].join('');
      }
      return `    ${padding}${key}: ${value}`;
    }),
    `${padding}}`,
  ].join('\n');
}

export const render = (item, offset = 0) => {
    const padding = '  '.repeat(offset);
    const {
      name, 
      oldValue, 
      newValue,
      children
    } = item;

    if (name === 'root') {
      return [
        `{`,
        ...children.map(child => render(child, offset + 1)),
        `}`
      ].join('\n');
    }

    if (children.length) {
      return [
        `  ${padding}${name}: {`,
        ...children.map(child => render(child, offset + 2)),
        `  ${padding}}`
      ].join('\n');
    }

    let oval = oldValue instanceof Object ? renderObject(oldValue, offset + 1) : oldValue;
    let nval = newValue instanceof Object ? renderObject(newValue, offset + 1) : newValue;

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
