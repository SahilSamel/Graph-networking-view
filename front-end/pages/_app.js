import Head from "next/head";
import "../styles/globals.css";
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react';
import authReducer from '../state/authStates';

const persistConfig = {
  timeout: 500,
  key: 'root',
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
const MyApp = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <Head>
        {/* <meta name="theme-color" content="#000000"></meta>
        <meta
          name="description"
          content="A Clone of the popular scoial media website Twitter"
        ></meta>
        <meta property="og:url" content="localhost:3000"></meta>
        <meta property="og:type" content="website"></meta>
        <meta property="og:title" content="Twitter Clone"></meta>
        <meta
          property="og:image"
          content="https://firebasestorage.googleapis.com/v0/b/twitter-clone-ratio.appspot.com/o/twitter.svg?alt=media&token=7241168c-b6a7-469d-925a-4a5de0e7b5a2"
        ></meta>
        <meta property="og:image:alt" content="Twitter Logo"></meta>
        <meta property="og:description" content="Clone of Twitter"></meta>
        <meta property="og:site_name" content="Twitter"></meta>
        <meta property="og:locale" content="en_US"></meta>
        <meta property="article:author" content="Sahil and Aaryan"></meta>
        <title>Twitter</title>
        <link
          rel="icon"
          type="image/x-icon"
          href="https://firebasestorage.googleapis.com/v0/b/twitter-clone-ratio.appspot.com/o/twitter.svg?alt=media&token=7241168c-b6a7-469d-925a-4a5de0e7b5a2"
        ></link> */}
      </Head>
      
      <Component {...pageProps} />
    </PersistGate>
    </Provider>
  );
};

export default MyApp;
