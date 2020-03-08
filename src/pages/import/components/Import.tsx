import React, {
  useReducer,
  useEffect,
  useRef,
  useState,
  useContext
} from 'react';
import IContext from '../context/context-i';
import HeaderI from './HeaderI';
import FooterI from './FooterI';
import MidI from './MidI';
import MainLayout from '../../../layout/Layout';
import { Layout, Spin } from 'antd';
import IReducer from '../context/reducer-i';
import { stat } from 'fs';
import CreateEditI from './CreateEditI';
import AppContext from '../../../context/context-app';
import CreateEditItemI from './CreateEditItemI';

import data from '../context/data.json';
import MakeDeliveryI from './MakeDeliveryI';
import IGMFillingI from './IGMFillingI';
import { Route, Switch, Router } from 'react-router';
import ImportStatusI from './ImportStatusI';

const { Content } = Layout;

const HomeI = () => {
  const headerForm: any = useRef(null);

  const [loading, setLoading] = useState(false);

  return (
    <Layout className="h-full">
      <Spin spinning={loading}>
        <HeaderI ref={headerForm} setLoading={setLoading} />
      </Spin>
      <MidI />

      <FooterI headerForm={headerForm} />

      <CreateEditI />
      <CreateEditItemI />
      <MakeDeliveryI />
      <IGMFillingI />
    </Layout>
  );
};

const Import: React.FC = (props: any) => {
  const shippers = data.companies.filter(x =>
    x.importRoles.includes('shipper')
  );
  const consignees = data.companies.filter(x =>
    x.importRoles.includes('consignee')
  );
  const notifyParties = data.companies.filter(x =>
    x.importRoles.includes('notify-party')
  );
  const cfs = data.companies.filter(x => x.importRoles.includes('cfs'));
  const cha = data.companies.filter(x => x.importRoles.includes('cha'));

  const emptyYards = data.companies.filter(x =>
    x.importRoles.includes('empty-yard')
  );

  const {
    loadingPorts,
    dischargePorts,
    vessals,
    voyages,
    terms,
    charges,
    containerTypes,
    terminals
  } = data;

  let dataImpExp = {};
  let d = localStorage.getItem('impexp');
  if (d != null) {
    dataImpExp = JSON.parse(d);
  }

  const [state, dispatch] = useReducer(IReducer, {
    model: { details: [] },
    visibleModify: false,
    visibleModifyItem: false,
    shippers,
    consignees,
    notifyParties,
    cfs,
    cha,
    emptyYards,
    loadingPorts,
    dischargePorts,
    vessals,
    voyages,
    terms,
    charges,
    containerTypes,
    terminals,
    dataImpExp
  });

  const { match } = props;

  return (
    <MainLayout>
      <IContext.Provider value={{ state, dispatch }}>
        <Route exact path={`${match.path}`} component={HomeI} />
        <Route exact path={`${match.path}/:hblNo`} component={HomeI} />
        <Route exact path={`${match.path}/status/home`} component={ImportStatusI} />
      </IContext.Provider>
    </MainLayout>
  );
};

export { Import as default };
