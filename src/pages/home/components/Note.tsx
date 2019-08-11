import { Button } from 'antd';
import React, { useContext } from 'react';

import NotesContext from '../context/notes-context';

const Note = (props: any) => {
  const { note } = props;
  const { dispatch } = useContext(NotesContext);

  const removeNote = (title: any) => {
    dispatch({
      type: 'REMOVE_NOTE',
      title
    });
  };

  return (
    <>
      <Button onClick={() => removeNote(note.title)}>{note.title}</Button>
      <p>{note.body}</p>
    </>
  );
};

export { Note as default };
