import React from 'react';
import { useReducer, useEffect, useState } from 'react';
import notesReducer from '../context/notes';
import { Layout, Form, Input, Button } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import Note from './Note';
import NotesList from './NoteList';
import AddNoteForm from './AddNoteForm';
import NotesContext from '../context/notes-context';

export const NotesApp: React.FC = () => {
  const [notes, dispatch] = useReducer(notesReducer, []);

  useEffect(() => {
    const notes = localStorage.getItem('notes');

    dispatch({
      type: 'POPULATE_NOTES',
      notes: (notes && JSON.parse(notes)) || []
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  return (
    <Layout>
      <NotesContext.Provider value={{ notes, dispatch }}>
        <h1>Notes</h1>
        <AddNoteForm />
        <NotesList />
      </NotesContext.Provider>
    </Layout>
  );
};
export { NotesApp as default };
