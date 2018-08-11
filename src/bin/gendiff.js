#!/usr/bin/env node
import program from 'commander';
import genDiff from '..';

program
  .version('1.0.1')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<firstFile> <secondFile>')
  .option('-f, --format [type]', 'Output format')
  .action(
    (firstFile, secondFile, options) => console.log(genDiff(firstFile, secondFile, options.format)),
  );

program
  .parse(process.argv);
