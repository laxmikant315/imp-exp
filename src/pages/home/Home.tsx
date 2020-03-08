import React from 'react';
import MainLayout from '../../layout/Layout';

import NotesApp from './components/NotesApp';
import { Button, Icon, Layout } from 'antd';
import { Link } from 'react-router-dom';
const { Content } = Layout;

export const Home: React.FC = () => {
  return (
    <MainLayout>
      {/* <NotesApp /> */}
      <div className="flex flex-col justify-center items-center h-full">
        <Link to="generic_master">
          <Button type="danger" size="large" shape="round">
            <Icon type="build" />
            Generic Master
          </Button>
        </Link>
        <Link to="one">
          <Button type="danger" size="large" shape="round">
            <Icon type="edit" />
            Notes Master
          </Button>
        </Link>
        <Link to="generic_master">
        <Button type="danger" size="large" shape="round">
          <Icon type="setting" />
          Settings
        </Button>
        </Link>
      </div>
    </MainLayout>
  );
};
