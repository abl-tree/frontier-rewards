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
              PackageEditScreen: 'package-edit',
              PackageCreateScreen: 'package-create'
            }
          },
          User: {
            screens: {
              UserScreen: 'users',
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
          // TabOne: {
          //   screens: {
          //     TabOneScreen: 'one',
          //   },
          // },
          // QrScannerTab: {
          //   screens: {
          //     TabTwoScreen: 'two',
          //     UserActionScreen: 'action'
          //   },
          // },
          TabThree: {
            screens: {
              TabThreeScreen: 'three',
            },
          },
          TabFour: {
            screens: {
              TabFourScreen: 'four',
              TestScreen: 'five'
            },
          },
          Logout: {
            screens : {
              LogoutScreen: 'logout'
            }
          },
          Database: {
            screens: {
              DatabaseScreen: 'database'
            }
          },
          FileSystem: {
            screens: {
              FileSystemScreen: 'filesystem'
            }
          },
          Clients: {
            screens: {
              ClientsScreen: 'clients',
              TabOne: {
                screens: {
                  TabOneScreen: 'one',
                },
              },
              QrScannerTab: {
                screens: {
                  TabTwoScreen: 'two',
                  UserActionScreen: 'user_action'
                },
              }
            }
          }
        },
      },
      Login: 'login',
      NotFound: '*',
    },
  },
};
