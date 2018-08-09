import fs from 'fs';
import path from 'path';
import { has, union } from 'lodash';
import parser from './parser';

const makeAst = (obj1, obj2) => {
  const commonKeys = union(Object.keys(obj1), Object.keys(obj2));

  const children = commonKeys.reduce((acc, name) => {
    if (obj1[name] instanceof Object && obj2[name] instanceof Object) {
      const result = { 
        name, 
        oldValue: 0, 
        newValue: 0, 
        children: makeAst(obj1[name], obj2[name]) 
      };
      return [...acc, result];
    }

    let newValue = null;
    let oldValue = null;
    if (has(obj1, name) && has(obj2, name)) {
      if (obj1[name] === obj2[name]) {
        newValue = oldValue = obj1[name];
      } else {
        oldValue = obj1[name];
        newValue = obj2[name];
      }
    }
    if (has(obj1, name)) {
      oldValue = obj1[name];
    } else {
      newValue = obj2[name];
    }

    const result = { 
      name, 
      oldValue, 
      newValue, 
      children: []
    };
    return [...acc, result];
  }, []);

  return children;
};

const genDiff = (firstFile, secondFile) => {
  const data1 = fs.readFileSync(firstFile, 'utf8');
  const data2 = fs.readFileSync(secondFile, 'utf8');
  const ext1 = path.extname(firstFile);
  const ext2 = path.extname(secondFile);
  
  const cfgData1 = parser[ext1](data1);
  const cfgData2 = parser[ext2](data2);

  return {
    name: 'root',
    oldValue: 0,
    newValue: 0,
    children: makeAst(cfgData1, cfgData2),
  };
};

export default genDiff;







