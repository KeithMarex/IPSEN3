/* tslint:disable:variable-name */
export class UserModel{
  private _id: string;
  private _email: string;
  private _userGroup: string;
  private _firstName: string;
  private _lastName: string;

  constructor(id: string, email: string, userGroup: string, firstName: string, lastName: string) {
    this._id = id;
    this._email = email;
    this._userGroup = userGroup;
    this._firstName = firstName;
    this._lastName = lastName;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get userGroup(): string {
    return this._userGroup;
  }

  set userGroup(value: string) {
    this._userGroup = value;
  }

  get firstName(): string {
    return this._firstName;
  }

  set firstName(value: string) {
    this._firstName = value;
  }

  get lastName(): string {
    return this._lastName;
  }

  set lastName(value: string) {
    this._lastName = value;
  }
}
