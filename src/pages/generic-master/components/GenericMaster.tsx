import React, {
  useReducer,
  useEffect,
  useRef,
  useState,
  useContext
} from 'react';
import GmContext from '../context/context-gm';
import HeaderGm from './HeaderGm';
import FooterGm from './FooterGm';
import MidGm from './MidGm';
import MainLayout from '../../../layout/Layout';
import { Layout, Spin } from 'antd';
import GmReducer from '../context/reducer-gm';
import { stat } from 'fs';
import CreateEditGm from './CreateEditGm';
import AppContext from '../../../context/context-app';
const { Content } = Layout;
const GenericMaster: React.FC = (props: any) => {
  const [state, dispatch] = useReducer(GmReducer, {
    model: { details: [] }
  });

  const headerForm: any = useRef(null);

  const [loading, setLoading] = useState(false);

  return (
    <MainLayout>
      <GmContext.Provider value={{ state, dispatch }}>
        <Layout className="h-full">
         
          <Spin spinning={loading}>
            <HeaderGm ref={headerForm} setLoading={setLoading} />
          </Spin>
          <MidGm />

          <FooterGm headerForm={headerForm} />

          <CreateEditGm />
        </Layout>
      </GmContext.Provider>
    </MainLayout>
  );
};

export { GenericMaster as default };
