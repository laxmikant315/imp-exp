import React, { useContext } from 'react';
import Note from './Note';
import NotesContext from '../context/notes-context';

const NotesList = (props: any) => {
  const { notes } = useContext(NotesContext);
  return (
    notes && notes.map((note: any) => <Note key={note.title} note={note} />)
  );
};

export { NotesList as default };
