import { Api } from "src/app/api/api";

export class NotificationModel{


  private _id : string;
  private _text : string;

  constructor(id : string, text : string)
  {
    this._id = id;
    this._text = text;
  }

  get id(): string
  {
    return this._id;
  }

  set id(value: string)
  {
    this._id = value;
  }

  get text(): string
  {
    return this._text;
  }

  set text(value: string)
  {
    this._text = value;
  }


  static async getNotificationByAnswerID(nId: string): Promise<NotificationModel>
  {
    const api = Api.getApi();
    let returnNotification;
    await api.get('/notification/getByAnswer/' + nId).then(response => {
      // Vraag die na antwoord (nId) komt.
      returnNotification = new NotificationModel(response.data.result[0].id, response.data.result[0].text);
    });
    return returnNotification;
  }
}
