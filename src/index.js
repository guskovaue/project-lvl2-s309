import path from 'path';
import fs from 'fs';
import { has, union } from 'lodash';
import getParser from './parsers/dispatcher';

const genDiff = (firstFile, secondFile) => {
  const data1 = fs.readFileSync(firstFile);
  const data2 = fs.readFileSync(secondFile);
  const cfgData1 = getParser(path.extname(firstFile)).parse(data1);
  const cfgData2 = getParser(path.extname(secondFile)).parse(data2);

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
