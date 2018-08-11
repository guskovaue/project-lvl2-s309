import ini from 'ini';
import yaml from 'js-yaml';

const parsers = {
  '.json': JSON.parse,
  '.yaml': yaml.safeLoad,
  '.ini': ini.decode,
};

const parse = (ext, data) => parsers[ext](data);

export default parse;
