import {createApolloServer} from 'meteor/apollo';

import AccountsConfig from 'meteor/davidyaha:apollo-accounts-server';

createApolloServer({
  graphiql: true,
  pretty: true,
  ...AccountsConfig
});
