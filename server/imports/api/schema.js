import {buildSchemaFromTypeDefinitions} from 'graphql-tools';

export const schemaShorthand = `
  type Token {
    userId: ID!
    token: String!
    tokenExpiration: Float!
  }
  
  input UserPasswordInput {
    email: String
    username: String
    password: String
  }

  type User {
    id: ID!
    email: String
    username: String
  }
  
  interface AccountsQuery {
    me: User
  }
  
  interface AccountsMutation {
    createAccount(user: UserPasswordInput): User
    loginWithPassword(user: UserPasswordInput): Token
  }
`;

export const rootObjectsExtension = `
  extend type RootQuery implements AccountsQuery {
    me: User
  }

  extend type RootMutation implements AccountsMutation {
    createAccount(user: UserPasswordInput): User
    loginWithPassword(user: UserPasswordInput): Token
  }
`;

const schema = `
  type RootQuery implements AccountsQuery {
    me: User
  }

  type RootMutation implements AccountsMutation {
    createAccount(user: UserPasswordInput): User
    loginWithPassword(user: UserPasswordInput): Token
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`;

export default buildSchemaFromTypeDefinitions([schema, schemaShorthand]);
