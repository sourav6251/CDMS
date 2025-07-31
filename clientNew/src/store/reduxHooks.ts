// src/redux/reduxHooks.ts
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './reduxStore';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
/**
 * const dispatch = useAppDispatch();
 * dispatch(setCount(42));
 * store data
 * 
 * 
 *  const count = useAppSelector((state) => state.user.count);
 * retrive data
 * 
 * 
 */

