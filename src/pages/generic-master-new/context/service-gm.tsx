import config from '../../../config.json';
import axios from 'axios';
const apiUrl = config.apiUrl + 'generic-master/';

const getByCode = (code: string) => {
  return axios
    .get(apiUrl + code)
    .then(x => x.data)
    .catch(x => {
      console.log(x);
    });
};
const save = (pkg: any) => {
  if (pkg.id) {
    return axios.patch(apiUrl + pkg.id, pkg);
  } else {
    return axios.post(apiUrl + '', pkg);
  }
};

export { getByCode, save };
