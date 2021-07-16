// Custom Navigation Drawer / Sidebar with Image and Icon in Menu Options
// https://aboutreact.com/custom-navigation-drawer-sidebar-with-image-and-icon-in-menu-options/

import React from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Linking,
} from 'react-native';

import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { Logout } from '../actions/UserAction';
import { useDispatch } from 'react-redux';
import {config} from '../constants/API';
import {
  NativeBaseProvider,
  Button,
  Box,
  HamburgerIcon,
  Image,
  Pressable,
  Heading,
  VStack,
  Text,
  Center,
  HStack,
  Divider,
  Icon
} from 'native-base';

const CustomSidebarMenu = (props) => {
  const BASE_PATH =
    'https://raw.githubusercontent.com/AboutReact/sampleresource/master/';
  const proileImage = 'react_logo.png';
  const dispatch = useDispatch()

  const onLogout = () => {
    
    dispatch(Logout())
    
  }
  

  return (
    <SafeAreaView style={{flex: 1}}>
      <VStack>
        <Center>
          <Image
            size="sm"
            w="70%"
            alt="Logo"
            resizeMode="contain"
            source={{uri: config.url.BASE_URL + '/icons/logo.png'}}
          />
        </Center>
      </VStack>
      <DrawerContentScrollView {...props} safeArea>
        <DrawerItemList {...props} itemStyle={{width: '90%', alignSelf: 'center'}} labelStyle={{textTransform: 'uppercase', color: 'black'}} />
      </DrawerContentScrollView>
      <DrawerItem
        labelStyle={{color: 'black'}}
        label="Logout"
        onPress={() => onLogout()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sideMenuProfileIcon: {
    resizeMode: 'center',
    width: 200,
    height: 200,
    backgroundColor: 'red',
    borderRadius: 100 / 2,
    alignSelf: 'center',
  },
  iconStyle: {
    width: 15,
    height: 15,
    marginHorizontal: 5,
  },
  customItem: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CustomSidebarMenu;