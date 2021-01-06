/* tslint:disable:variable-name */
export class CollectionModel {
    private _id: string;
    private _name: string;
    private _type: string;
    private _version: number;

    constructor(id: string, name: string, type: string, version: number) {
        this._id = id;
        this._name = name;
        this._type = type;
        this._version = version;
    }

    get id(): string {
        return this._id;
    }

    set id(id: string) {
        this._id = id;
    }

    get name(): string {
        return this._name;
    }

    set name(name: string) {
        this._name = name;
    }

    get type(): string {
        return this._type;
    }

    set type(type: string) {
        this._type = type;
    }

    get version(): number {
        return this._version;
    }

    set version(version: number) {
        this._version = version;
    }
}
