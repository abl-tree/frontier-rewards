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
import { DrawerParamList, ActionParamList, DatabaseParamList, FileSystemParamList, ClientsParamList, RewardParamList, PackageParamList, UserParamList, TransactionParamList } from '../types';
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

const Drawer = createDrawerNavigator<DrawerParamList>();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomSidebarMenu {...props} />}
    >
      <Drawer.Screen
        name="Dashboard"
        component={BottomTabNavigator}
        options={{
          title: 'Dashboard'
        }}
      />
      <Drawer.Screen
        name="Action"
        component={ActionNavigator}/>
      <Drawer.Screen
        name="Reward"
        component={RewardNavigator}/>
      <Drawer.Screen
        name="Package"
        component={PackageNavigator}/>
      <Drawer.Screen
        name="User"
        component={UserNavigator}/>
      <Drawer.Screen
        name="Transaction"
        component={TransactionNavigator}/>
      {/* <Drawer.Screen
        name="Database"
        component={DatabaseNavigator}/>
      <Drawer.Screen
        name="FileSystem"
        component={FileSystemNavigator}
      /> */}
    </Drawer.Navigator>
  );
}

const ActionStack = createStackNavigator<ActionParamList>();

function ActionNavigator() {
  return (
    <ActionStack.Navigator>
      <ActionStack.Screen
        name="ActionScreen"
        component={ActionScreen}
      />
      <ActionStack.Screen
        name="ActionEditScreen"
        component={ActionEditScreen}
      />
      <ActionStack.Screen
        name="ActionCreateScreen"
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
        />
        <RewardStack.Screen
          name="RewardEditScreen"
          component={RewardEditScreen}
        />
        <RewardStack.Screen
          name="RewardCreateScreen"
          component={RewardCreateScreen}
        />
      </RewardStack.Navigator>
    )
  } else {
    return (
      <RewardStack.Navigator>
        <RewardStack.Screen
          name="RewardScreen"
          component={RewardScreen}
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
      />
      <PackageStack.Screen
        name="PackageEditScreen"
        component={PackageEditScreen}
      />
      <PackageStack.Screen
        name="PackageCreateScreen"
        component={PackageCreateScreen}
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
      />
      <UserStack.Screen
        name="UserEditScreen"
        component={UserEditScreen}
      />
      <UserStack.Screen
        name="UserCreateScreen"
        component={UserCreateScreen}
      />
    </UserStack.Navigator>
  )
}

const TransactionStack = createStackNavigator<TransactionParamList>();

function TransactionNavigator() {
  return (
    <TransactionStack.Navigator>
      <TransactionStack.Screen
        name="TransactionScreen"
        component={TransactionScreen}
      />
      <TransactionStack.Screen
        name="TransactionEditScreen"
        component={TransactionEditScreen}
      />
    </TransactionStack.Navigator>
  )
}

const DatabaseStack = createStackNavigator<DatabaseParamList>();

function DatabaseNavigator() {
  return (
    <DatabaseStack.Navigator>
      <DatabaseStack.Screen
        name="DatabaseScreen"
        component={DatabaseScreen}
      />
    </DatabaseStack.Navigator>
  )
}

const FileSystemStack = createStackNavigator<FileSystemParamList>();

function FileSystemNavigator() {
  return (
    <FileSystemStack.Navigator>
      <FileSystemStack.Screen
        name="FileSystemScreen"
        component={FileSystemScreen}
      />
    </FileSystemStack.Navigator>
  )
}

const ClientsStack = createStackNavigator<ClientsParamList>();

function ClientsNavigator() {
  return (
    <ClientsStack.Navigator>
      <ClientsStack.Screen
        name="ClientsScreen"
        component={ClientsScreen}
      />
    </ClientsStack.Navigator>
  )
}