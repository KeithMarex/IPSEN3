export class UserModel{
  private _user_id: string;
  private _email: string;
  private _usergroup: string;
  private _voornaam: string;
  private _achternaam: string;

  constructor(userId: string, email: string, usergroup: string, voornaam: string, achternaam: string) {
    this._user_id = userId;
    this._email = email;
    this._usergroup = usergroup;
    this._voornaam = voornaam;
    this._achternaam = achternaam;
  }

  get user_id(): string {
    return this._user_id;
  }

  set user_id(value: string) {
    this._user_id = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get usergroup(): string {
    return this._usergroup;
  }

  set usergroup(value: string) {
    this._usergroup = value;
  }

  get voornaam(): string {
    return this._voornaam;
  }

  set voornaam(value: string) {
    this._voornaam = value;
  }

  get achternaam(): string {
    return this._achternaam;
  }

  set achternaam(value: string) {
    this._achternaam = value;
  }
}
