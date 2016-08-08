import { assert } from 'meteor/practicalmeteor:chai';

import { createApolloServer } from 'meteor/apollo';
import AccountsConfig from 'meteor/davidyaha:apollo-accounts-server';

describe('accounts', function() {
  
  it('works', function() {
    assert.ok(createApolloServer(AccountsConfig));
  });
  
});
