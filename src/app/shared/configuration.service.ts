import {UserModel} from "./models/user.model";
import {Injectable} from "@angular/core";

@Injectable()
export class configurationService {
  user: UserModel;
  baseURL: 'https://ipsen3api.nielsprins.com/';
}
