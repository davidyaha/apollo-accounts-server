# Apollo Accounts Server

This is a meteor package that wraps meteor's Accounts package with a GraphQL schema and resolvers.

## Run Example

```
git clone https://github.com/davidyaha/apollo-accounts-server
cd apollo-accounts-server/example
meteor npm install
meteor
```

Open your browser on http://localhost:3000/graphql and run these queries on GraphiQL:
 
### Create user
```
mutation register($user: {username: "user", password: "password"}){
  createAccount(user: $user) {
		id
    username
  }
}
```

### Login
```
mutation {
  loginWithPassword(user: {username: "user", password: "password"}) {
    userId
    token
    tokenExpiration
  }
}
```
