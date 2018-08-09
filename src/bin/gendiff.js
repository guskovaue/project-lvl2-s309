#!/usr/bin/env node
import program from 'commander';
import genDiff from '..';

program
  .version('1.0.1')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<firstFile> <secondFile>')
  .option('-f, --format [type]', 'Output format')
  .action(
    (firstFile, secondFile) => console.log(JSON.stringify(genDiff(firstFile, secondFile), null, 2)), //console.log(genDiff(firstFile, secondFile)),
  );

program
  .parse(process.argv);
