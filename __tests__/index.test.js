import fs from 'fs';
import genDiff from '../src';

const pathToTestFiles = './__tests__/__fixtures__';

const getCurrentAnswer = (file1, file2) => genDiff(`${pathToTestFiles}/${file1}`,
  `${pathToTestFiles}/${file2}`);

const getRightAnswer = () => fs.readFileSync(`${pathToTestFiles}/answer`).toString();


test('testDiffJson', () => {
  const currentAnswer = getCurrentAnswer('test_file1.json', 'test_file2.json');
  const rightAnswer = getRightAnswer('test_file1.json', 'test_file2.json');
  expect(currentAnswer).toBe(rightAnswer);
});

test('testDiffYaml', () => {
  const currentAnswer = getCurrentAnswer('test_file3.yaml', 'test_file4.yaml');
  const rightAnswer = getRightAnswer('test_file1.json', 'test_file2.json');
  expect(currentAnswer).toBe(rightAnswer);
});
