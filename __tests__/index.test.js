import fs from 'fs';
import genDiff from '../src';

const pathToTestFiles = './__tests__/__fixtures__';


const check = (file1, file2, answerFileName, type) => {
  const currentAnswer = genDiff(`${pathToTestFiles}/${file1}`, `${pathToTestFiles}/${file2}`, type);
  const rightAnswer = fs.readFileSync(`${pathToTestFiles}/${answerFileName}`).toString();
  return expect(currentAnswer).toBe(rightAnswer);
};

// tests for common rendering
test('testDiffJson', () => check('test_file1.json', 'test_file2.json', 'answer'));

test('testDiffYaml', () => check('test_file3.yaml', 'test_file4.yaml', 'answer'));

test('testDiffIni', () => check('test_file5.ini', 'test_file6.ini', 'answer'));

// tests for plain rendering
test('testPlainDiffJson', () => check('test_file1.json', 'test_file2.json', 'plain_answer', 'plain'));

test('testPlainDiffYaml', () => check('test_file3.yaml', 'test_file4.yaml', 'plain_answer', 'plain'));

test('testPlainDiffIni', () => check('test_file5.ini', 'test_file6.ini', 'plain_answer', 'plain'));

// tests for json rendering
test('testJsonDiffJson', () => check('test_file1.json', 'test_file2.json', 'json_answer', 'json'));

test('testJsonDiffYaml', () => check('test_file3.yaml', 'test_file4.yaml', 'json_answer', 'json'));

test('testJsonDiffIni', () => check('test_file5.ini', 'test_file6.ini', 'json_answer', 'json'));