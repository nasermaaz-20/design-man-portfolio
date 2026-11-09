import { createContext, useContext } from 'react';

export const MotionContext = createContext(true);
export const useIntroReady = () => useContext(MotionContext);
