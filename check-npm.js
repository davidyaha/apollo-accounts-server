import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';

checkNpmVersions({
  'apollo-server': '^0.1.1',
  'express': '^4.13.4',
  'graphql-tools': '^0.6.3',
}, 'davidyaha:apollo-accounts-server');
