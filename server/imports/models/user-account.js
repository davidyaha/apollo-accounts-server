/**
 * UserAccounts Model Class
 *
 * ** Some of the authentication code was taken from
 *    https://github.com/stubailo/meteor-rest/blob/devel/packages/rest-accounts-password/rest-login.js
 *
 */

import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import {check, Match} from 'meteor/check';

export default class UserAccount {
  static async get(id) {
    return await Accounts.users.findOne(id);
  }
  
  static async create(username, email, password, profile) {
    var options = {password, profile};
    
    assignIfExists(options, username, 'username');
    assignIfExists(options, email, 'email');
    
    const userId = await Accounts.createUser(options);
    return await Accounts.users.findOne(userId);
  }
  
  static async login(username, email, password) {
    let user = await Accounts.users.findOne(getSelectorForUser(username, email));
    
    if (!user) {
      throw new Meteor.Error('not-found',
        'User with that username or email address not found.');
    }
  
    let result = Accounts._checkPassword(user, password);
    check(result, {
      userId: String,
      error: Match.Optional(Meteor.Error),
    });
  
    if (result.error) {
      throw result.error;
    }
  
    return UserAccount.getResumeTokenForUserId(result.userId);
  }
  
  static getResumeTokenForUserId(userId) {
    let stampedLoginToken = Accounts._generateStampedLoginToken();
    check(stampedLoginToken, {
      token: String,
      when: Date,
    });
  
    Accounts._insertLoginToken(userId, stampedLoginToken);
  
    let tokenExpiration = Accounts._tokenExpiration(stampedLoginToken.when);
    check(tokenExpiration, Date);
  
    return {
      userId,
      token: stampedLoginToken.token,
      tokenExpiration
    }
  }
  
  static async createGuest() {
    const profile = {guest: true};
    const username = await UserAccount.generateTempUserName();
    const userId = await Accounts.createUser({username, profile});
    
    check(userId, String);
    
    return UserAccount.getResumeTokenForUserId(userId);
  }
  
  static async updateGuest(guestId, username, email, password, profile) {
    // TODO This operation has 4 granular updates because the accounts methods validates allot
    // of things before changing. This might cause problems so we should later consider copy and optimize
    // the logic from each of those methods.
    check(guestId, NonEmptyString);
    
    const guest = await Accounts.users.findOne({_id: guestId, 'profile.guest': true});
    
    if (!guest)
      throw new Meteor.Error('not-found', 'The user id provided is not a guest anymore');
    
    check(password, NonEmptyString);
    
    if (!username && !email)
      throw new Meteor.Error('invalid-arguments', 'User needs email or username to be updated to non guest');
    
    if (!!username)
      await Accounts.setUsername(guestId, username);
    
    if (!!email)
      await Accounts.addEmail(guestId, email);
    
    await Accounts.setPassword(guestId, password);
    
    const newProfile = {...guest.profile, ...profile, guest: false};
    await Accounts.users.update(guestId, {$set: {'profile': newProfile}});
    
    return await Accounts.users.findOne(guestId);
  }
  
  static async generateTempUserName() {
    let username = `Guest${Date.now()}`;
    while (await Accounts.users.find({username}).count() > 0) {
      console.warn("Stuck On existing user. Should consider better username generation");
      username = `Guest${Date.now()}`;
    }
    
    return username;
  }
}

function getSelectorForUser(username, email) {
  let returnedSelector;
  
  if (!!email) {
    check(email, String);
    returnedSelector = { 'emails.address': email };
  } else {
    check(username, String);
    returnedSelector = { username: username };
  }
  
  return returnedSelector;
}

function assignIfExists(obj, field, fieldName) {
  if (!!field) {
    obj[fieldName] = field;
  }
  return obj;
}

const NonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length > 0;
});
