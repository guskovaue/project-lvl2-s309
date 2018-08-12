import fs from 'fs';
import path from 'path';
import { has, union } from 'lodash';
import parse from './parser';
import renderer from './renderers';

const getAst = (obj1, obj2, name) => {
  const value1 = obj1[name];
  const value2 = obj2[name];
  if (value1 instanceof Object && value2 instanceof Object) {
    const commonKeys = union(Object.keys(value1), Object.keys(value2));
    return {
      name,
      status: 'nested',
      children: commonKeys.map(key => getAst(value1, value2, key)),
    };
  }
  if (has(obj1, name) && has(obj2, name)) {
    if (value1 === value2) {
      return {
        name,
        newValue: value2,
        oldValue: value1,
        status: 'unchanged',
        children: [],
      };
    }
    return {
      name,
      newValue: value2,
      oldValue: value1,
      status: 'changed',
      children: [],
    };
  }
  if (has(obj1, name)) {
    return {
      name,
      oldValue: value1,
      status: 'deleted',
      children: [],
    };
  }
  return {
    name,
    newValue: value2,
    status: 'created',
    children: [],
  };
};

const genDiff = (firstFile, secondFile, type = 'stylish') => {
  const data1 = fs.readFileSync(firstFile, 'utf8');
  const data2 = fs.readFileSync(secondFile, 'utf8');
  const ext1 = path.extname(firstFile);
  const ext2 = path.extname(secondFile);

  const cfgData1 = parse(ext1, data1);
  const cfgData2 = parse(ext2, data2);

  const ast = getAst({ root: cfgData1 }, { root: cfgData2 }, 'root');
  return renderer(ast, type);
};

export default genDiff;
