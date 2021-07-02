import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state';

export const useActions = () => {
  const dispatch = useDispatch();
//prevent re renders for our bundler, bind action creators only once
  return useMemo(() => {
    return bindActionCreators(actionCreators, dispatch);
  }, [dispatch]);
};
