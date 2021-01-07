import {Cookie} from 'ng2-cookies/ng2-cookies';
import jwt_decode from 'jwt-decode';
import {TokenModel} from './token.model';
import {Api} from '../../api/api';

/* tslint:disable:variable-name */
export class UserModel {
  private readonly _id: string;
  private readonly _email: string;
  private readonly _userGroup: string;
  private readonly _firstName: string;
  private readonly _lastName: string;

  constructor(id: string, email: string, userGroup: string, firstName: string, lastName: string) {
    this._id = id;
    this._email = email;
    this._userGroup = userGroup;
    this._firstName = firstName;
    this._lastName = lastName;
  }

  static getLoggedInUser(redirectToLogin = true): UserModel {
    const token = Cookie.get('user_token');

    if (token !== null) {
      try {
        const userData: TokenModel = jwt_decode(token);

        const api = Api.getApi();
        api.post('/user/checkToken', {token}).then((response) => {
          if (response.data.login !== 'success') {
            Cookie.delete('user_token', '/');
          }
        });

        return new UserModel(userData.id, userData.email, userData.permission_group, userData.first_name, userData.last_name);
      } catch (error) {
        Cookie.delete('user_token', '/');
      }
    }

    if (redirectToLogin) {
      window.location.replace('/admin');
    }
  }

  get id(): string {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  get userGroup(): string {
    return this._userGroup;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }
}
