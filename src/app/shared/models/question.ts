import { Api } from 'src/app/api/api';
import { Answer } from './answer';

export class Question {

    constructor(id: string, name: string)
    {
        this._id = id;
        this._name = name;

        // fetch alle vragen voor deze vraag.
        this.getAllAnswers();
    }

    get id(): string
    {
        return this._id;
    }

    set id(value: string)
    {
        this._id = value;
    }

    get name(): string
    {
        return this._name;
    }

    set name(value: string)
    {
        this._name = value;
    }

    get answers(): Answer[]
    {
        return this._answers;
    }

    set answers(value: Answer[])
    {
        this._answers = value;
    }
    private _id: string;
    private _name: string;

    private _answers: Answer[] = [];

    static async getQuestionByCollectionID(nId: string): Promise<Question>
    {
        const api = Api.getApi();
        let returnQuestion;
        await api.get('/question/getByCollection/' + nId).then(response => {
            // eerste vraag.
            console.log(response);
            returnQuestion = new Question(response.data.result.id, response.data.result.name);
        });
        return returnQuestion;
    }

    static async getQuestionByByAnswerID(nId: string): Promise<Question>
    {
        const api = Api.getApi();
        let returnQuestion;
        await api.get('/question/getByAnswer/' + nId).then(response => {
            // Vraag die na antwoord (nId) komt.
            console.log(response);
            returnQuestion = new Question(response.data.result.id, response.data.result.name);
        });
        return returnQuestion;
    }

    async getAllAnswers(): Promise<void> {
        const api = Api.getApi();
        await api.get('/answer/getByQuestion/' + this._id).then(response => {
            // de vragen.
            if (response.data.result) // checken voor data
            {
                response.data.result.forEach(element => {
                    // elk antwoord.
                    this._answers.push(new Answer(element.id, element.name));
                });
            }
        });
    }
}
