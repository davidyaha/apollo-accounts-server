import { createApolloServer } from 'meteor/apollo';

import AccountsServer from 'meteor/davidyaha:apollo-accounts-server';

createApolloServer({
  graphiql: true,
  pretty: true,
  schema: AccountsServer.AccountsSchema,
  resolvers: AccountsServer.AccountsResolvers,
});
