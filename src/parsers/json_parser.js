import fs from 'fs';

export default class {
  constructor(filename) {
    this.filename = filename;
  }

  parse() {
    return JSON.parse(fs.readFileSync(this.filename));
  }
}
