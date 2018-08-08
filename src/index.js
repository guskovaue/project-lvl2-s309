import fs from 'fs';
import path from 'path';
import ini from 'ini';
import yaml from 'js-yaml';
import { has, union } from 'lodash';

const actions = [
  {
    ext: '.json',
    parse: data => JSON.parse(data),
  },
  {
    ext: '.yaml',
    parse: data => yaml.safeLoad(data),
  },
  {
    ext: '.ini',
    parse: data => ini.decode(data),
  },
];

const getParser = extention => actions.find(({ ext }) => extention === ext);

const genDiff = (firstFile, secondFile) => {
  const data1 = fs.readFileSync(firstFile, 'utf8');
  const data2 = fs.readFileSync(secondFile, 'utf8');
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
