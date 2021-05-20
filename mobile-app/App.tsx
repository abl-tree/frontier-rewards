import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Provider } from 'react-redux';
import * as SecureStore from 'expo-secure-store';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import Store from './Store'
import axios from "axios";
import { config } from './constants/API';

axios.defaults.baseURL = config.url.API_URL
axios.defaults.headers = {
    "Access-Control-Allow-Origin": "*",
    "Accept": "application/json",
    "Content-Type": "application/json"
}

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  React.useEffect(() => {

    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await SecureStore.getItemAsync('userToken');
      } catch (error) {
        
      }
    }

    bootstrapAsync()

  })

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <Provider store={Store}>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </Provider>
    );
  }
}
