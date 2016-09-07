/*
  $ — читать как `current`. Введено для сокращения длины переменных.
  По аналогии с переменной $0, что в хроме означает текущий выбранный элемент.
  set$User == setCurrentUser;
*/
import {createAction, handleActions} from 'redux-actions';

export const setCount = createAction('count/SET');

export default {
    count: handleActions({
        [setCount]: (state, action) => state + action.payload
    }, 0)
};
