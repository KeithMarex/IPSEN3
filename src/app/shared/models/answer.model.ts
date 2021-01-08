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

  constructor(id, name) {
    this._id = id;
    this._name = name;
  }
}
