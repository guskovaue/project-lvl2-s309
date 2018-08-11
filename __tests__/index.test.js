import fs from 'fs';
import { genDiff, render } from '../src';

const pathToTestFiles = './__tests__/__fixtures__';

const check = (file1, file2) => {
  const currentAnswer = render(genDiff(`${pathToTestFiles}/${file1}`, `${pathToTestFiles}/${file2}`));
  const rightAnswer = fs.readFileSync(`${pathToTestFiles}/answer`).toString();
  return expect(currentAnswer).toBe(rightAnswer);
};

test('testDiffJson', () => check('test_file1.json', 'test_file2.json'));

test('testDiffYaml', () => check('test_file3.yaml', 'test_file4.yaml'));

//test('testDiffIni', () => check('test_file5.ini', 'test_file6.ini'));
