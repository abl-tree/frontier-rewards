/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { ColorSchemeName } from 'react-native';

import NotFoundScreen from '../screens/NotFoundScreen';
import Login from '../screens/Login';
import { RootStackParamList } from '../types';
import BottomTabNavigator from './BottomTabNavigator';
import DrawerNavigator from './DrawerNavigator';
import LinkingConfiguration from './LinkingConfiguration';
import { getAsyncStorage } from '../actions/UserAction';
import axios from 'axios';
import _ from 'lodash';
import { NativeBaseProvider } from 'native-base';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <NativeBaseProvider>
          <RootNavigator />
        </NativeBaseProvider>
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  const dispatch = useDispatch();
  const Auth = useSelector(state => state.Auth);

  React.useEffect(() => {
      
    dispatch(getAsyncStorage())

  }, []);  

  if(!_.isEmpty(Auth.user)){
      axios.defaults.headers['Authorization'] = "Bearer " + Auth.user.token;     
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
    {Auth.user && Object.keys(Auth.user).length ? (
      <Stack.Screen name="Root" component={DrawerNavigator} />
    ) : (
      <Stack.Screen name="Login" component={Login} />
    )}
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
    </Stack.Navigator>
  );
}
