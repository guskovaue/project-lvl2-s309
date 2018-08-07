import yaml from 'js-yaml';
import fs from 'fs';
import JsonParser from './json_parser';

export default class extends JsonParser {
  parse() {
    return yaml.safeLoad(fs.readFileSync(this.filename));
  }
}
