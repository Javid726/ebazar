'use client';
// { edit: false, owner: 'javidos' };
export const initialCategory = { edit: true };
export function categoryReducer(state: any, action: any) {
  console.log('meeeeee');
  if (action.type === 'add_category') {
    console.log('I got this');
    console.log(state);
    return action.payload;
  } else {
    console.log('sad');
    return state;
  }
}
