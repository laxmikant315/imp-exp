import config from '../../../config.json';
import axios from 'axios';
const apiUrl = config.apiUrl + 'auth/';

const signIn = (data: { username: string; password: string }) => {
  return axios.post(apiUrl + 'signIn', data).then(x => x.data);
};
const signUp = (data: { username: string; password: string }) => {
  return axios.post(apiUrl + 'signUp', data).then(x => x.data);
};

export { signIn, signUp };
