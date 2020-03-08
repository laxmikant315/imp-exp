import React, { useContext } from 'react';
import { Form, Input, Button } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { useState } from 'react';
import NotesContext from '../context/notes-context';

const AddNoteForm = (props: any) => {
  const { dispatch } = useContext(NotesContext);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const onSubmit = (e: any) => {
    e.preventDefault();

    dispatch({ type: 'ADD_NOTE', note: { title, body } });
    setTitle('');
    setBody('');
  };
  return (
    <>
      <h3>Add New</h3>
      <Form layout="inline" onSubmit={onSubmit}>
        <Input
          placeholder="title"
          onChange={e => setTitle(e.target.value)}
          value={title}
        />
        <TextArea
          placeholder="Body"
          onChange={e => setBody(e.target.value)}
          value={body}
        />

        <Button type="primary" htmlType="submit">
          Add
        </Button>
      </Form>
    </>
  );
};

export { AddNoteForm as default };
