import {Injectable} from '@angular/core';
import {CollectionModel} from './models/collection.model';

@Injectable()
export class ConfigurationService {
  collections: CollectionModel[] = [];
}
