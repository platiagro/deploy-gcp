import { UPDATE_SIGNIN_STATUS } from '../actionTypes';
import reducer from './auth';

describe('reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(
      {
        isAuthorized: false,
        token: ''
      }
    );
  });

  it('should handle UPDATE_SIGNIN_STATUS', () => {
    expect(
      reducer(
        {
          isAuthorized: false,
          token: '',
        },
        {
          type: UPDATE_SIGNIN_STATUS,
          payload: {
            isAuthorized: true,
            token: 'foo',
          }
        })
    ).toEqual(
      {
        isAuthorized: true,
        token: 'foo',
      }
    )
  });
});