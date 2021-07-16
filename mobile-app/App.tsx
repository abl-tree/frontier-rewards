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
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { useRef, useState } from 'react';
import { Platform } from 'react-native';
import { Box, Center, NativeBaseProvider, Text } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';

axios.defaults.baseURL = config.url.API_URL
axios.defaults.headers = {
    "Access-Control-Allow-Origin": "*",
    "Accept": "application/json",
    "Content-Type": "application/json"
}

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  React.useEffect(() => {

    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await SecureStore.getItemAsync('userToken');
      } catch (error) {
        
      }
    }

    bootstrapAsync()

    // registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
    //   setNotification(notification);

    //   console.log('notif', notification);
      
    // });

    // responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
    //   console.log(response);
    // });

    // return () => {
    //   Notifications.removeNotificationSubscription(notificationListener.current);
    //   Notifications.removeNotificationSubscription(responseListener.current);
    // };

  })

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <Provider store={Store}>
        <Navigation colorScheme={colorScheme} />
          {/* <StatusBar /> */}
      </Provider>
    );
    return (
      <Provider store={Store}>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
      </Provider>
    );
  }
}

// async function schedulePushNotification() {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "You've got mail! 📬",
//       body: 'Here is the notification body',
//       data: { data: 'goes here' },
//     },
//     trigger: { seconds: 2 },
//   });
// }

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    // Notifications.setNotificationChannelAsync('defaultdsadsadas', {
    //   name: 'defaultsdsadsa',
    //   importance: Notifications.AndroidImportance.MAX,
    //   vibrationPattern: [0, 250, 250, 250], 
    //   lightColor: '#FF231F7C',
    // }); 

    // Notifications.createChannelAndroidAsync('reminders', {
    //   name: 'Reminders',
    //   priority: 'max',
    //   vibrate: [0, 100, 250, 250],
    // });
  }

  return token;
}