import yaml from 'js-yaml';

export default class {
  parse(data) {
    return yaml.safeLoad(data);
  }
}
