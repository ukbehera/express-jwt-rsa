import YAML from 'yamljs';
import path from 'path';

const swaggerDocument = YAML.load(path.join(__dirname, '../../../swagger/openApi.yaml'));

export default swaggerDocument;