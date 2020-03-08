import config from '../../../config.json';
import axios from 'axios';
const apiUrl = config.apiUrl + 'import/';

const getByCode = (code: string) => {
  return axios
    .get(apiUrl + code)
    .then(x => x.data)
    .catch(x => {
      console.log(x);
    });
};

const getAll = () => {
  return axios
    .get(apiUrl)
    .then(x => x.data)
    .catch(x => {
      console.log(x);
    });
};

const save = (pkg: any) => {
  // if (pkg.id) {
  //   return axios.patch(apiUrl + pkg.id, pkg);
  // } else {
  //   return axios.post(apiUrl + '', pkg);
  // }

  try {
    return new Promise(resolve => {
      let dataImpExp: any = { imports: [] };
      let d = localStorage.getItem('impexp');
      let exists = false;
      if (d != null) {
        dataImpExp = JSON.parse(d);
        if (!dataImpExp.imports) {
          dataImpExp.imports = [];
        }
        exists = dataImpExp.imports.find((x: any) => x.hblNo === pkg.hblNo);
      }

      if (exists) {
        dataImpExp.imports = dataImpExp.imports.filter(
          (x: any) => x.hblNo !== pkg.hblNo
        );
      }

      dataImpExp.imports.push(pkg);

      resolve(dataImpExp);
    });
  } catch (error) {
    throw error;
  }
};

const openFile = async (fileName: string, top?: number, left?: number) => {
  const response: any = await axios(`/reports/${fileName}.pdf`, {
    method: 'GET',
    responseType: 'blob' //Force to receive data in a Blob Format
  });

  const file = new Blob([response.data], { type: 'application/pdf' });
  const fileURL = URL.createObjectURL(file);

  window.open(
    fileURL,
    '_blank',
    `width=1000,height=650,top=${top},left=${left}`
  );
};
const printPdf = async () => {
  await openFile('IMPORT DELIVERY ORDER');
  await openFile('IMPORT SURVEY LETTER', 100, 100);
  await openFile('IMPORT EMPTY LETTER', 200, 200);
};

export { getByCode, getAll, save, printPdf };
