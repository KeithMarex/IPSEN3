import {Api} from "../../api/api";

export class AnswerModel {
  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }
  private _id;
  private _name;
  private _hasNotification;

  get hasNotification(): boolean {
    return this._hasNotification;
  }

  set hasNotification(value) {
    this._hasNotification = value;
  }

  constructor(id, name) {
    this._id = id;
    this._name = name;
    this.checkIfNextIsNotification(this.id).then(res => {
      this.hasNotification = res;
    });
  }

  async checkIfNextIsNotification(id): Promise<boolean> {
    let bool = false;
    await Api.getApi().get('/notification/getByAnswer/' + id).then(res => {
      if (res['data']['result'] === false) {
        bool = false;
      } else {
        bool = true;
      }
    });

    return bool;
  }
}
