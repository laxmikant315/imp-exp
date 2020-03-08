import config from '../../../config.json';
import axios from 'axios';

const apiUrl = config.kiteUrl;

const getQuote = (stock: string) => {
  return axios
    .get(apiUrl + `quote?i=${stock}`, {
      headers: {
        Authorization: localStorage.getItem('kiteToken')
      }
    })
    .then(x => x.data)
    .catch(x => {
      console.log(x);
    });
};

export { getQuote };
