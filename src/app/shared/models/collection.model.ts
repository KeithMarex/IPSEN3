export class CollectionModel{
  private _id: string;
  private _name: string;
  private _type: string;
  private _version: string;

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get type(): string {
    return this._type;
  }

  set type(value: string) {
    this._type = value;
  }

  get version(): string {
    return this._version;
  }

  set version(value: string) {
    this._version = value;
  }

  constructor(id: string, name: string, type: string, version: string) {
    this._id = id;
    this._name = name;
    this._type = type;
    this._version = version;
  }
}
