import fs from 'fs';
import path from 'path';
import { union } from 'lodash';
import parse from './parser';
import render from './renders';

let processChildren;

const propertyActions = [
  {
    getNewValue: () => 0,
    getOldValue: () => 0,
    getChildren: (o1, o2) => processChildren(o1, o2),
    check: (o1, o2) => o1 instanceof Object && o2 instanceof Object,
  },
  {
    getNewValue: o2 => o2,
    getOldValue: o1 => o1,
    getChildren: () => [],
    check: (o1, o2) => o1 !== undefined && o2 !== undefined,
  },
  {
    getNewValue: () => null,
    getOldValue: o1 => o1,
    getChildren: () => [],
    check: o1 => o1 !== undefined,
  },
  {
    getNewValue: o2 => o2,
    getOldValue: () => null,
    getChildren: () => [],
    check: (o1, o2) => o2 !== undefined,
  },
];

const getPropertyAction = (o1, o2) => propertyActions.find(({ check }) => check(o1, o2));

const processItem = (obj1, obj2, name) => {
  const {
    getOldValue,
    getNewValue,
    getChildren,
  } = getPropertyAction(obj1, obj2);

  return {
    name,
    oldValue: getOldValue(obj1),
    newValue: getNewValue(obj2),
    children: getChildren(obj1, obj2),
  };
};

processChildren = (obj1, obj2) => {
  const commonKeys = union(Object.keys(obj1), Object.keys(obj2));
  return commonKeys.map(name => processItem(obj1[name], obj2[name], name));
};

const genDiff = (firstFile, secondFile, type) => {
  const data1 = fs.readFileSync(firstFile, 'utf8');
  const data2 = fs.readFileSync(secondFile, 'utf8');
  const ext1 = path.extname(firstFile);
  const ext2 = path.extname(secondFile);

  const cfgData1 = parse(ext1, data1);
  const cfgData2 = parse(ext2, data2);

  const ast = processItem(cfgData1, cfgData2, 'root');
  return render(ast, type);
};

export default genDiff;
