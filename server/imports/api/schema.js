import {buildSchemaFromTypeDefinitions} from 'graphql-tools';

const Schema = `
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

  type UserAccount {
    id: ID!
    email: String
    username: String
  }
  
  type RootQuery {
    me: UserAccount
  }
  
  type RootMutation {
    createAccount(user: UserPasswordInput): UserAccount
    loginWithPassword(user: UserPasswordInput): Token
  }
  
  schema {
    query: RootQuery
    mutation: RootMutation
  }
 
`;

export default buildSchemaFromTypeDefinitions(Schema);
