export class CategoryModel {
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

  get icon_url() {
    return this._icon_url;
  }

  set icon_url(value) {
    this._icon_url = value;
  }
  private _id;
  private _name;
  private _icon_url;

  constructor(id, name, icon_url) {
    this._id = id;
    this._name = name;
    this._icon_url = icon_url;
  }
}
