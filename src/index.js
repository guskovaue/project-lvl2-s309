import path from 'path';
import { has, union } from 'lodash';
import YamlParser from './parsers/yaml_parser';
import JsonParser from './parsers/json_parser';

const getParser = (file) => {
  const extName = path.extname(file);
  if (extName === '.json') {
    return new JsonParser(file);
  }
  return new YamlParser(file);
};

const genDiff = (firstFile, secondFile) => {
  const cfgData1 = getParser(firstFile).parse();
  const cfgData2 = getParser(secondFile).parse();

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
