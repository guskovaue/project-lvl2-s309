import yaml from 'js-yaml';
import fs from 'fs';

export default class {
  constructor(filename) {
    this.filename = filename;
  }

  parse() {
    return yaml.safeLoad(fs.readFileSync(this.filename));
  }
}
