#!/usr/bin/env node
import program from 'commander';
import { genDiff, render } from '..';

program
  .version('1.0.1')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<firstFile> <secondFile>')
  .option('-f, --format [type]', 'Output format')
  .action(
    (firstFile, secondFile) => console.log(render(genDiff(firstFile, secondFile))), //console.log(genDiff(firstFile, secondFile)),
  );

//JSON.stringify(render(genDiff(firstFile, secondFile), null, 2))
program
  .parse(process.argv);
