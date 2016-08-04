import UserAccount from '../models/user-account';

const resolvers = {
  RootQuery: {
    async me(_, args, context) {
      return await UserAccount.get(context.userId);
    },
  },
  RootMutation: {
    async createAccount(_, args, context) {
      let {username, email, password} = args.user;
      return await UserAccount.create(username, email, password, args.profile);
    },
    async loginWithPassword(_, args, context) {
      let {username, email, password} = args.user;
      return await UserAccount.login(username, email, password);
    }
  },
  User: {
    id: (user)=>user._id,
    email: (user)=>(user.emails && user.emails[0] && user.emails[0].address),
    username: (user)=>user.username,
  },
  Token: {
    tokenExpiration: (token)=>token.tokenExpiration.getTime()
  }
};

export default resolvers;
