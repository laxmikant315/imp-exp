const notesReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'POPULATE_NOTES':
      return action.notes;
    case 'ADD_NOTE':
      return [...state, action.note];
    case 'REMOVE_NOTE':
      return state.filter((x: any) => x.title !== action.title);
    default:
      return state;
  }
};

export { notesReducer as default };
