import ini from 'ini';
import yaml from 'js-yaml';

const parser = {
  '.json': data => JSON.parse(data),
  '.yaml': data => yaml.safeLoad(data),
  '.ini': data => ini.decode(data),
};

export default parser;
