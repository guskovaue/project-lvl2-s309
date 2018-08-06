import fs from 'fs';
import genDiff from '../src';

test('testDiff', () => {
  const pathToTestFiles = './__tests__/__fixtures__';
  const currentAnswer = genDiff(`${pathToTestFiles}/test_file1`, `${pathToTestFiles}/test_file2`);
  const rightAnswer = fs.readFileSync(`${pathToTestFiles}/answer`).toString();
  expect(currentAnswer).toBe(rightAnswer);
});
