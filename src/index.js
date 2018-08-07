import fs from 'fs';
import yaml from 'js-yaml';
import { has, union } from 'lodash';

const genDiff = (firstFile, secondFile) => {
  const cfgData1 = yaml.safeLoad(fs.readFileSync(`${firstFile}`));
  const cfgData2 = yaml.safeLoad(fs.readFileSync(`${secondFile}`));

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
