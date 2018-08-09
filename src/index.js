import fs from 'fs';
import path from 'path';
import { has, union } from 'lodash';
import parser from './parser';

const genDiff = (firstFile, secondFile) => {
  const data1 = fs.readFileSync(firstFile, 'utf8');
  const data2 = fs.readFileSync(secondFile, 'utf8');
  const ext1 = path.extname(firstFile);
  const ext2 = path.extname(secondFile);

  const cfgData1 = parser[ext1](data1);
  const cfgData2 = parser[ext2](data2);

  const commonKeys = union(Object.keys(cfgData1), Object.keys(cfgData2));

  const fullDiff = commonKeys.map((key) => {
    const cfgDataValue1 = cfgData1[key];
    const cfgDataValue2 = cfgData2[key];
    if (has(cfgData1, key) && has(cfgData2, key)) {
      if (cfgDataValue1 === cfgDataValue2) {
        return `    ${key}: ${cfgDataValue1}`;
      }
      return `  - ${key}: ${cfgDataValue1}\n  + ${key}: ${cfgDataValue2}`;
    }

    if (has(cfgData1, key)) {
      return `  - ${key}: ${cfgDataValue1}`;
    }
    return `  + ${key}: ${cfgDataValue2}`;
  });
  return ['{', ...fullDiff, '}'].join('\n');
};

export default genDiff;
