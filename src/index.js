import fs from 'fs';
import { has } from 'lodash';

const genDiff = (firstFile, secondFile) => {
  const cfgData1 = JSON.parse(fs.readFileSync(`${firstFile}`));
  const cfgData2 = JSON.parse(fs.readFileSync(`${secondFile}`));

  const diffFirstRelativelySecond = Object.keys(cfgData1).reduce((acc, key) => {
    const cfgDataValue1 = cfgData1[key];
    if (has(cfgData2, `${key}`)) {
      const cfgDataValue2 = cfgData2[key];
      if (cfgDataValue1 === cfgDataValue2) {
        return [...acc, `    ${key}: ${cfgDataValue1}`];
      }
      return [...acc, `  - ${key}: ${cfgDataValue1}`, `  + ${key}: ${cfgDataValue2}`];
    }
    return [...acc, `  - ${key}: ${cfgDataValue1}`];
  }, []);

  const fullDiff = Object.keys(cfgData2).reduce((acc, key) => {
    if (!has(cfgData1, `${key}`)) {
      return [...acc, `  + ${key}: ${cfgData2[key]}`];
    }
    return acc;
  }, diffFirstRelativelySecond);

  return ['{', ...fullDiff, '}'].join('\n');
};

export default genDiff;
