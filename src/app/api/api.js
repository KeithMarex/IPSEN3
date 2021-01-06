import axios from 'axios';
import {Cookie} from 'ng2-cookies/ng2-cookies';

export default axios.create({
  baseURL: 'https://ipsen3api.nielsprins.com/',
  headers: {
    Authorization: "Bearer " + Cookie.get('user_tokens'),
  }
});
