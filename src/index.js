import fs from 'fs';
import path from 'path';
import { union } from 'lodash';
import parse from './parser';
import render from './renders';

let processChildren;

const processItem = (obj1, obj2, name) => {
  if (obj1 instanceof Object && obj2 instanceof Object) {
    return {
      name,
      newValue: 0,
      oldValue: 0,
      status: 'unchanged',
      children: processChildren(obj1, obj2),
    };
  }
  if (obj1 !== undefined && obj2 !== undefined) {
    if (obj1 === obj2) {
      return {
        name,
        newValue: obj2,
        oldValue: obj1,
        status: 'unchanged',
        children: [],
      };
    }
    return {
      name,
      newValue: obj2,
      oldValue: obj1,
      status: 'changed',
      children: [],
    };
  }
  if (obj1 !== undefined) {
    return {
      name,
      newValue: null,
      oldValue: obj1,
      status: 'deleted',
      children: [],
    };
  }
  return {
    name,
    newValue: obj2,
    oldValue: null,
    status: 'created',
    children: [],
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
