import React from 'react';
import Layout from '../../layout/Layout';
import NotesApp from './components/NotesApp';

export const Home: React.FC = () => {
  return (
    <Layout>
      <NotesApp />
    </Layout>
  );
};
