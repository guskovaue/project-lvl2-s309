import fs from 'fs';
import genDiff from '../src';

test('testDiffJson', () => {
  const pathToTestFiles = './__tests__/__fixtures__';
  const currentAnswer = genDiff(`${pathToTestFiles}/test_file1.json`,
    `${pathToTestFiles}/test_file2.json`);
  const rightAnswer = fs.readFileSync(`${pathToTestFiles}/answer`).toString();
  expect(currentAnswer).toBe(rightAnswer);
});

test('testDiffYaml', () => {
  const pathToTestFiles = './__tests__/__fixtures__';
  const currentAnswer = genDiff(`${pathToTestFiles}/test_file3.yaml`,
    `${pathToTestFiles}/test_file4.yaml`);
  const rightAnswer = fs.readFileSync(`${pathToTestFiles}/answer`).toString();
  expect(currentAnswer).toBe(rightAnswer);
});
