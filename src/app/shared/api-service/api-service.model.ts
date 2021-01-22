import {Api} from '../../api/api';

export class ApiServiceModel {

  private api;

  // collection routes
  private GET_ALL_COLLECTIONS_PATH = 'collection/all';
  private GET_COLLECTION_BY_ID = 'collection/';

  // question routes
  private GET_FIRST_QUESTION_BY_COLLECTION_ID = '/question/getByCollection/';
  private GET_QUESTION_BY_ANSWER_ID = '/question/getByAnswer/';

  // answer routes
  private GET_ANSWERS_BY_QUESTION_ID = '/answer/getByQuestion/';

  constructor() {
    this.api = Api.getApi();
  }

  private async getDataFromApi(url: string): Promise<object> {
    return await this.api.get(url).then(response => {
      return response.data.result;
    });
  }

  public async getAllCollections(): Promise<object> {
    const path = this.GET_ALL_COLLECTIONS_PATH;
    return await this.getDataFromApi(path);
  }

  public async getCollectionById(collectionId: string): Promise<object> {
    const path = this.GET_COLLECTION_BY_ID + collectionId;
    return await this.getDataFromApi(path);
  }

  public async getFirstQuestionByCollectionId(collectionId: string): Promise<object> {
    const path = this.GET_FIRST_QUESTION_BY_COLLECTION_ID + collectionId;
    return await this.getDataFromApi(path);
  }

  public async getQuestionByAnswerId(answerId: string): Promise<object> {
    const path = this.GET_QUESTION_BY_ANSWER_ID + answerId;
    return await this.getDataFromApi(path);
  }

  public async getAnswersByQuestionId(questionId: string): Promise<object> {
    const path = this.GET_ANSWERS_BY_QUESTION_ID + questionId;
    return await this.getDataFromApi(path);
  }


}
