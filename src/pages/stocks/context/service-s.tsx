import config from '../../../config.json';
import axios from 'axios';

const apiUrl = config.apiUrlStocks;

const getIntradayStocks = (date: string) => {
  return axios
    .get(apiUrl + `getIntradayStocks/${date}`)
    .then(x => x.data)
    .catch(x => {
      console.log(x);
    });

  return axios.get(`/data.json`).then(x => x.data);
};
const getEquityInformation = () => {
  return axios
    .get(apiUrl + `getEquityInformation/1`)
    .then(x => x.data)
    .catch(x => {
      console.log(x);
    });
};

const getVolumeStocks = () => {
  return axios
    .get(apiUrl + `getVolumeStocks`)
    .then(x => x.data)
    .catch(x => {
      console.log(x);
    });
};
const getStockDetails = (symbol: any) => {
  return axios
    .get(apiUrl + `getStockDetails/${symbol}`)
    .then(x => x.data)
    .catch(x => {
      console.log(x);
    });
};

const getLiveStockInformation = (stocks: string, withAllData = true) => {
  return axios
    .get(apiUrl + `getLiveStockInformation/${stocks}/${withAllData}`)
    .then(x => x.data)
    .catch(x => { });
};

const getAccessToken = (requestToken: string) => {
  return axios
    .get(apiUrl + `getAccessToken/${requestToken}`)
    .then(x => x.data)
    .catch(x => {
      console.log(x);
    });
};


const getSwingStocks = () => {
  return axios
    .get(apiUrl + `getSwingStocks`)
    .then(x => x.data)
    .catch(x => {
      console.log(x);
    });

};

export {
  getIntradayStocks,
  getEquityInformation,
  getLiveStockInformation,
  getVolumeStocks,
  getAccessToken,
  getStockDetails,
  getSwingStocks
};
