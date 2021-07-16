import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import * as React from 'react';

import ActionScreen from '../screens/ActionScreen';
import ActionEditScreen from '../screens/ActionEditScreen';
import ActionCreateScreen from '../screens/ActionCreateScreen';
import DatabaseScreen from '../screens/DatabaseScreen';
import FileSystemScreen from '../screens/FileSystemScreen';
import ClientsScreen from '../screens/ClientsScreen';
import BottomTabNavigator from './BottomTabNavigator';
import { DrawerParamList, ActionParamList, DatabaseParamList, FileSystemParamList, ClientsParamList, RewardParamList, PackageParamList, UserParamList, TransactionParamList, SettingParamList, NotificationParamList } from '../types';
import RewardScreen from '../screens/RewardScreen';
import RewardEditScreen from '../screens/RewardEditScreen';
import RewardCreateScreen from '../screens/RewardCreateScreen';
import PackageScreen from '../screens/PackageScreen';
import PackageEditScreen from '../screens/PackageEditScreen';
import PackageCreateScreen from '../screens/PackageCreateScreen';
import UserScreen from '../screens/UserScreen';
import UserEditScreen from '../screens/UserEditScreen';
import UserCreateScreen from '../screens/UserCreateScreen';
import CustomSidebarMenu from './CustomSidebarMenu';
import { useSelector } from 'react-redux';
import TransactionScreen from '../screens/TransactionScreen';
import TransactionEditScreen from '../screens/TransactionEditScreen';
import ProfileScreen from '../screens/ProfileScreen';
import {config} from '../constants/API';
import { Image } from 'native-base';
import SettingScreen from '../screens/SettingScreen';
import NotificationScreen from '../screens/NotificationScreen';
import { TouchableOpacity, View } from 'react-native';
import PackageViewScreen from '../screens/PackageViewScreen';
import UserViewScreen from '../screens/UserViewScreen';

const Drawer = createDrawerNavigator<DrawerParamList>();

export default function DrawerNavigator() {
  const Auth = useSelector(state => state.Auth);

  return (
    <Drawer.Navigator
      drawerStyle={{borderTopRightRadius: 30, borderBottomRightRadius: 30, backgroundColor: 'white'}}
      drawerContent={(props) => <CustomSidebarMenu {...props} />}
    >
      <Drawer.Screen
        name="Dashboard"
        component={BottomTabNavigator}
        options={{
          title: 'Dashboard',
          drawerIcon: ({tintColor}) => (
            <Image alt="Dashboard icon" w={6} h={6} resizeMode="contain" source={{uri: config.url.BASE_URL + '/icons/dashboard-icon.png'}} />
          ),
        }}
      />
      <Drawer.Screen
        name="Action"
        component={ActionNavigator}
        options={{
          headerTitle: 'Action',
          drawerIcon: ({tintColor}) => (
            <Image alt="Action icon" w={6} h={6} resizeMode="contain" source={{uri: config.url.BASE_URL + '/icons/actions-icon.png'}} />
          )
        }}
      />
      <Drawer.Screen
        name="Reward"
        component={RewardNavigator}
        options={{
          drawerIcon: ({tintColor}) => (
            <Image alt="Reward icon" w={6} h={6} resizeMode="contain" source={{uri: config.url.BASE_URL + '/icons/reward-icon.png'}} />
          )
        }}
      />
      <Drawer.Screen
        name="Package"
        component={PackageNavigator}
        options={{
          drawerIcon: ({tintColor}) => (
            <Image alt="Package icon" w={6} h={6} resizeMode="contain" source={{uri: config.url.BASE_URL + '/icons/package-icon.png'}} />
          )
        }}
      />
      {(Auth.user.type == 1 || Auth.user.type == 2) && <Drawer.Screen
        name="User"
        component={UserNavigator}
        options={{
          drawerIcon: ({tintColor}) => (
            <Image alt="User icon" w={6} h={6} resizeMode="contain" source={{uri: config.url.BASE_URL + '/icons/profile-icon.png'}} />
          )
        }}
      />}
      <Drawer.Screen
        name="Transaction"
        component={TransactionNavigator}
        options={{
          drawerIcon: ({tintColor}) => (
            <Image alt="Transaction icon" w={6} h={6} resizeMode="contain" source={{uri: config.url.BASE_URL + '/icons/transaction-icon.png'}} />
          )
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          drawerIcon: ({tintColor}) => (
            <Image alt="Profile icon" w={6} h={6} resizeMode="contain" source={{uri: config.url.BASE_URL + '/icons/profile-icon.png'}} />
          )
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingNavigator}
        options={{
          drawerIcon: ({tintColor}) => (
            <Image alt="Settings icon" w={6} h={6} resizeMode="contain" source={{uri: config.url.BASE_URL + '/icons/settings-icon.png'}} />
          )
        }}
      />
      <Drawer.Screen
        name="Notifications"
        component={NotificationNavigator}
        options={{
          drawerIcon: ({tintColor}) => (
            <Image alt="Notification icon" w={6} h={6} resizeMode="contain" source={{uri: config.url.BASE_URL + '/icons/notification-icon.png'}} />
          )
        }}
      />
    </Drawer.Navigator>
  );
}

const ActionStack = createStackNavigator<ActionParamList>();

function ActionNavigator({navigation}) {
  return (
    <ActionStack.Navigator>
      <ActionStack.Screen
        name="ActionScreen"
        options={{
          title: 'Actions'
        }}
        component={ActionScreen}
      />
      <ActionStack.Screen
        name="ActionEditScreen"
        options={{
          title: 'Update Action'
        }}
        component={ActionEditScreen}
      />
      <ActionStack.Screen
        name="ActionCreateScreen"
        options={{
          title: 'Create Action'
        }}
        component={ActionCreateScreen}
      />
    </ActionStack.Navigator>
  )
}

const RewardStack = createStackNavigator<RewardParamList>();

function RewardNavigator() {
  const Auth = useSelector(state => state.Auth);
  
  if(Auth.user.type == 1 || Auth.user.type == 2) {
    return (
      <RewardStack.Navigator>
        <RewardStack.Screen
          name="RewardScreen"
          component={RewardScreen}
          options={{
            title: 'Rewards'
          }}
        />
        <RewardStack.Screen
          name="RewardEditScreen"
          component={RewardEditScreen}
          options={{
            title: 'Update Reward'
          }}
        />
        <RewardStack.Screen
          name="RewardCreateScreen"
          component={RewardCreateScreen}
          options={{
            title: 'Create Reward'
          }}
        />
      </RewardStack.Navigator>
    )
  } else {
    return (
      <RewardStack.Navigator>
        <RewardStack.Screen
          name="RewardScreen"
          component={RewardScreen}
          options={{
            title: 'Rewards'
          }}
        />
      </RewardStack.Navigator>
    )
  }
}

const PackageStack = createStackNavigator<PackageParamList>();

function PackageNavigator() {
  return (
    <PackageStack.Navigator>
      <PackageStack.Screen
        name="PackageScreen"
        component={PackageScreen}
        options={{
          title: 'Packages'
        }}
      />
      <PackageStack.Screen
        name="PackageViewScreen"
        component={PackageViewScreen}
        options={{
          title: 'View Package'
        }}
      />
      <PackageStack.Screen
        name="PackageEditScreen"
        component={PackageEditScreen}
        options={{
          title: 'Update Package'
        }}
      />
      <PackageStack.Screen
        name="PackageCreateScreen"
        component={PackageCreateScreen}
        options={{
          title: 'Create Package'
        }}
      />
    </PackageStack.Navigator>
  )
}

const UserStack = createStackNavigator<UserParamList>();

function UserNavigator() {
  return (
    <UserStack.Navigator>
      <UserStack.Screen
        name="UserScreen"
        component={UserScreen}
        options={{
          title: 'Users'
        }}
      />
      <UserStack.Screen
        name="UserViewScreen"
        component={UserViewScreen}
        options={{
          title: 'View User'
        }}
      />
      <UserStack.Screen
        name="UserEditScreen"
        component={UserEditScreen}
        options={{
          title: 'Update User'
        }}
      />
      <UserStack.Screen
        name="UserCreateScreen"
        component={UserCreateScreen}
        options={{
          title: 'Create User'
        }}
      />
    </UserStack.Navigator>
  )
}

const TransactionStack = createStackNavigator<TransactionParamList>();

function TransactionNavigator() {
  const Auth = useSelector(state => state.Auth);
  
  if(Auth.user.type == 1 || Auth.user.type == 2) {
    return (
      <TransactionStack.Navigator>
        <TransactionStack.Screen
          name="TransactionScreen"
          component={TransactionScreen}
          options={{
            title: 'Transactions'
          }}
        />
        <TransactionStack.Screen
          name="TransactionEditScreen"
          component={TransactionEditScreen}
          options={{
            title: 'Update Transaction'
          }}
        />
      </TransactionStack.Navigator>
    )
  } else {
    return (
      <TransactionStack.Navigator>
        <TransactionStack.Screen
          name="TransactionScreen"
          component={TransactionScreen}
          options={{
            title: 'Transactions'
          }}
        />
      </TransactionStack.Navigator>
    )
  }
}

const ProfileStack = createStackNavigator<TransactionParamList>();

function ProfileNavigator() {

  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          title: 'Profile'
        }}
      />
    </ProfileStack.Navigator>
  )
  
}

const SettingStack = createStackNavigator<SettingParamList>();

function SettingNavigator() {

  return (
    <SettingStack.Navigator>
      <SettingStack.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={{
          title: 'Settings'
        }}
      />
    </SettingStack.Navigator>
  )
  
}

const NotificationStack = createStackNavigator<NotificationParamList>();

function NotificationNavigator() {

  return (
    <NotificationStack.Navigator>
      <NotificationStack.Screen
        name="NotificationScreen"
        component={NotificationScreen}
        options={{
          title: 'Notifications'
        }}
      />
    </NotificationStack.Navigator>
  )
  
}