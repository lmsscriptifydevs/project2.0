// import { configureStore } from '@reduxjs/toolkit';
// import { useDispatch as useAppDispatch, useSelector as useAppSelector } from 'react-redux';
// import rootReducer from '../rootReducer';
// import  storage from "redux-persist/lib/storage";
// import { persistReducer, persistStore } from 'redux-persist';

// // ----------------------------------------------------------------------
// // ----------- persist ------
// const persistConfig ={
//   key:'root',
//   storage,
// }
// const persistedReducer  = persistReducer(persistConfig, rootReducer)

// const store = configureStore({
//     reducer: persistedReducer,
//     middleware: (getDefaultMiddleware) =>
//       getDefaultMiddleware({
//         serializableCheck: false,
//         immutableCheck: false,
//       }),
//   });

// const { dispatch } = store;

// const useSelector = useAppSelector;

// const useDispatch = () => useAppDispatch();

// export { store, dispatch, useSelector, useDispatch };
// export const persistor = persistStore(store); 


// withOut Persist 
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch as useAppDispatch, useSelector as useAppSelector } from 'react-redux';
import { persistStore } from 'redux-persist';
import rootReducer from '../rootReducer';
// ----------------------------------------------------------------------

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
      }),
  });
const persistor = persistStore(store);

const { dispatch } = store;

const useSelector = useAppSelector;

const useDispatch = () => useAppDispatch();

export { dispatch, persistor, store, useDispatch, useSelector };

