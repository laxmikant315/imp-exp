import React, { useReducer, useEffect, useRef } from 'react';
import GmContext from '../context/context-gm';
import HeaderGm from './HeaderGm';
import FooterGm from './FooterGm';
import MidGm from './MidGm';
import MainLayout from '../../../layout/Layout';
import { Layout } from 'antd';
import GmReducer from '../context/reducer-gm';
import { ModifyGM } from '../../generic-master/components/ModifyGM';
import { stat } from 'fs';
import CreateEditGm from './CreateEditGm';

const GenericMaster: React.FC = (props: any) => {
  const [state, dispatch] = useReducer(GmReducer, {
    model: { details: [] }
  });
  const headerForm: any = useRef(null);

  return (
    <MainLayout>
      <GmContext.Provider value={{ state, dispatch }}>
        <Layout className="h-full">
          <HeaderGm ref={headerForm} />

          <MidGm />

          <FooterGm headerForm={headerForm} />
          <CreateEditGm />
        </Layout>
      </GmContext.Provider>
    </MainLayout>
  );
};

export { GenericMaster as default };
