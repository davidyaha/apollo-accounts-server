/**
 * UserAccounts Model Class
 *
 * ** Some of the authentication code was taken from
 *    https://github.com/stubailo/meteor-rest/blob/devel/packages/rest-accounts-password/rest-login.js
 *
 */

import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import {check} from 'meteor/check';

export default class UserAccount {
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
  
    let stampedLoginToken = Accounts._generateStampedLoginToken();
    check(stampedLoginToken, {
      token: String,
      when: Date,
    });
  
    Accounts._insertLoginToken(result.userId, stampedLoginToken);
  
    let tokenExpiration = Accounts._tokenExpiration(stampedLoginToken.when);
    check(tokenExpiration, Date);
    
    return {
      userId: result.userId,
      token: stampedLoginToken.token,
      tokenExpiration
    }
  }
  
  static async get(id) {
    await Accounts.users.findOne(id);
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
