import '../check-npm.js';

import schema from './imports/api/schema';
import resolvers from './imports/api/resolvers';
import UserAccount from './imports/models/user-account';

export default {
  schema,
  resolvers
}

export {schemaShorthand, rootObjectsExtension} from './imports/api/schema';

export {UserAccount};
