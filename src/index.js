import fs from 'fs';
import path from 'path';
import { union } from 'lodash';
import parse from './parser';
import render from './renderers';

const getAst = (obj1, obj2) => {
  const commonKeys = union(Object.keys(obj1), Object.keys(obj2));
  return commonKeys.map((name) => {
    const value1 = obj1[name];
    const value2 = obj2[name];
    if (value1 instanceof Object && value2 instanceof Object) {
      return {
        name,
        type: 'nested',
        children: getAst(value1, value2),
      };
    }
    if (value1 && value2) {
      if (value1 === value2) {
        return {
          name,
          newValue: value2,
          oldValue: value1,
          type: 'unchanged',
        };
      }
      return {
        name,
        newValue: value2,
        oldValue: value1,
        type: 'changed',
      };
    }
    if (value1) {
      return {
        name,
        oldValue: value1,
        type: 'deleted',
      };
    }
    return {
      name,
      newValue: value2,
      type: 'created',
    };
  });
};

const genDiff = (firstFile, secondFile, type = 'stylish') => {
  const data1 = fs.readFileSync(firstFile, 'utf8');
  const data2 = fs.readFileSync(secondFile, 'utf8');
  const ext1 = path.extname(firstFile);
  const ext2 = path.extname(secondFile);

  const cfgData1 = parse(ext1, data1);
  const cfgData2 = parse(ext2, data2);

  const ast = getAst(cfgData1, cfgData2);
  return render(ast, type);
};

export default genDiff;
