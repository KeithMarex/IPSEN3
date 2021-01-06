import {UserModel} from "./models/user.model";
import {Injectable} from "@angular/core";
import {CollectionModel} from "./models/collection.model";

@Injectable()
export class configurationService {
  user: UserModel;
  collections: CollectionModel[] = [];
  baseURL: 'https://ipsen3api.nielsprins.com/'
}
