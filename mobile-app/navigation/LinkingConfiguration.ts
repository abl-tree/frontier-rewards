/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          Action: {
            screens: {
              ActionScreen: 'action',
              ActionEditScreen: 'action-edit',
              ActionCreateScreen: 'action-create'
            }
          },
          Reward: {
            screens: {
              RewardScreen: 'rewards',
              RewardEditScreen: 'reward-edit',
              RewardCreateScreen: 'reward-create'
            }
          },
          Package: {
            screens: {
              PackageScreen: 'packages',
              PackageViewScreen: 'package-view',
              PackageEditScreen: 'package-edit',
              PackageCreateScreen: 'package-create'
            }
          },
          User: {
            screens: {
              UserScreen: 'users',
              UserViewScreen: 'user-view',
              UserEditScreen: 'user-edit',
              UserCreateScreen: 'user-create'
            }
          },
          Transaction: {
            screens: {
              TransactionScreen: 'transactions',
              TransactionEditScreen: 'transaction-edit'
            }
          },
          Profile: {
            screens: {
              ProfileScreen: 'profile'
            }
          },
          Setting: {
            screens: {
              SettingScreen: 'setting'
            }
          },
          Notification: {
            screens: {
              NotificationScreen: 'notifications'
            }
          },
          Logout: {
            screens : {
              LogoutScreen: 'logout'
            }
          }
        },
      },
      Login: 'login',
      NotFound: '*',
    },
  },
};
