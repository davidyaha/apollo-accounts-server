Package.describe({
  name: 'davidyaha:apollo-accounts-server',
  version: '0.0.1',
  summary: 'meteor-accounts-password package wrapped with graphql schema and resolvers',
  git: 'https://github.com/davidyaha/apollo-accounts-server'
});

Package.onUse(function (api) {
  api.versionsFrom('1.3.2.4');
  api.use([
    'ecmascript',
    'check',
    'accounts-password',
    'apollo@0.1.0-beta',
    'tmeasday:check-npm-versions@0.3.1'
  ]);
  
  api.mainModule('server/main.js', 'server');
});

Package.onTest(function (api) {
  api.use([
    'ecmascript',
    'practicalmeteor:mocha',
    'practicalmeteor:chai',
    'davidyaha:apollo-accounts-server'
  ]);
  
  api.mainModule('tests/server.js', 'server');
});
