/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */
import { GestureResponderEvent } from "react-native";

export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
  Login: undefined;
};

export type BottomTabParamList = {
  TabOne: undefined;
  QrScannerTab: undefined;
  TabThree: undefined;
  TabFour: undefined;
  Logout: undefined;
};

export type TabOneParamList = {
  TabOneScreen: undefined;
};

export type TabTwoParamList = {
  TabTwoScreen: undefined;
  UserActionScreen: undefined;
};

export type TabThreeParamList = {
  TabThreeScreen: undefined;
};

export type TabFourParamList = {
  TabFourScreen: undefined;
  TestScreen: undefined;
};

export type LogoutParamList = {
  LogoutScreen: undefined;
};

export type DrawerParamList = {
  Dashboard: undefined;
  Action: undefined;
  Reward: undefined;
  Package: undefined;
  User: undefined;
  Transaction: undefined;
  Database: undefined;
  FileSystem: undefined;
  Clients: undefined;
};

export type ActionParamList = {
  ActionScreen: undefined;
  ActionScreenEdit: undefined;
  ActionCreateEdit: undefined;
};

export type RewardParamList = {
  RewardScreen: undefined;
  RewardScreenEdit: undefined;
  RewardCreateEdit: undefined;
};

export type PackageParamList = {
  PackageScreen: undefined;
  PackageViewEdit: undefined;
  PackageScreenEdit: undefined;
  PackageCreateEdit: undefined;
};

export type UserParamList = {
  UserScreen: undefined;
  UserViewScreen: undefined;
  UserEditScreen: undefined;
  UserCreateScreen: undefined;
};

export type TransactionParamList = {
  TransactionScreen: undefined;
  TransactionScreenEdit: undefined;
};

export type ProfileParamList = {
  ProfileScreen: undefined;
};

export type SettingParamList = {
  SettingScreen: undefined;
};

export type NotificationParamList = {
  NotificationScreen: undefined;
};

export type onPressFunc = (event: GestureResponderEvent) => void;