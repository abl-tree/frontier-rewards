import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackHeaderLeftButtonProps } from '@react-navigation/stack';
import { Button, FAB, Icon, ListItem, SearchBar } from 'react-native-elements';
import {useDispatch, useSelector} from "react-redux";
import { Text } from '../components/Themed';
import MenuIcon from '../components/MenuIcon';
import { useEffect } from 'react';
import _ from 'lodash';
import { DeleteData, GetData } from "../actions/RewardAction";
import { ActivityIndicator, Alert, StyleSheet, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import axios from 'axios'

const AdminScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const rewardList = useSelector(state => state.Reward);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    navigation.setOptions({
      showHeader: true,
      headerLeft: (props: StackHeaderLeftButtonProps) => (<MenuIcon/>)
    });

  });
  
  React.useLayoutEffect(() => {

    fetchRewards()

  }, [navigation])
  
  const fetchRewards = async (url = '/rewards') => {
    if(url == null || loading) return

    setLoading(true)

    dispatch(GetData(url))
    .then(() => {

      setLoading(false)

    }).catch((error) => {

      setLoading(false)

    })

  }

  const editRow = (rowMap, item) => {
    let key = item.key
    
    if(rowMap[key]) {
        rowMap[key].closeRow() 
    }

    navigation.navigate('RewardEditScreen', { data: item })
  }

  const deleteRow = (rowMap, item) => {
    let key = item.key

    Alert.alert(
      "Are you sure?",
      "This action cannot be undone.",
      [
        {
          text: "Cancel",
          onPress: () => rowMap[key].closeRow(),
          style: "cancel"
        },
        { text: "OK", onPress: () => {
          dispatch(DeleteData(item.id))
          .then(() => {
      
            // navigation.goBack()
            
          }).catch((error) => {
      
          })
        } }
      ],
      {
        cancelable: false
      }
    );
      
  }

  const VisibleItem = props => {
      const {data} = props

      return (
          <View style={styles.rowFront}>
            <TouchableHighlight style={styles.rowFrontVisible}>
                <View>
                    <Text style={styles.title} numberOfLines={1}>Name: {data.item.name}</Text>
                    <Text style={styles.title} numberOfLines={1}>Description: {data.item.description}</Text>
                    <Text style={styles.title} numberOfLines={1}>Type: {data.item.type}</Text>
                </View>
            </TouchableHighlight>
          </View>
      )
  }

  const renderItem = (data, rowMap) => {

    return (
        <VisibleItem data={data}/>
    )

  }

  const HiddenItemWithAction = props => {
      const {onEdit, onDelete} = props;

      return (
          <View style={styles.rowBack}>
              <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnLeft]} onPress={onEdit}>
                <MaterialCommunityIcons name="pencil-outline" size={25} style={styles.trash} color="#fff"/>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={onDelete}>
                <MaterialCommunityIcons name="trash-can-outline" size={25} style={styles.trash} color="#fff"/>
              </TouchableOpacity>
          </View>
      )
  }

  const renderHiddenItem = (data, rowMap) => {
      return (
          <HiddenItemWithAction
            data={data}
            rowMap={rowMap}
            onEdit={() => editRow(rowMap, data.item)}
            onDelete={() => deleteRow(rowMap, data.item)}
          />
      )
  }

  const handleAddAction = () => {
    
    navigation.navigate('RewardCreateScreen')
    
  }

  return (
    <View style={styles.container}>
      {rewardList.data.data ? <SwipeListView
          keyExtractor={(item) => item.id.toString()}
          data={rewardList.data.data}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          leftOpenValue={75}
          rightOpenValue={-150}
          disableRightSwipe
          initialNumToRender={10}
          onEndReachedThreshold={0.5}
          onEndReached={() => {fetchRewards(rewardList.data.next_page_url)}}
          // ListHeaderComponent={() => {
          //   return <SearchBar placeholder="Type Here..." lightTheme round />;
          // }}
          ListFooterComponent={() => {
            return (<View
                    style={{
                      paddingVertical: 20,
                      borderTopWidth: 1,
                      borderColor: "#CED0CE"
                    }}
                  >
                    {
                      loading ? <ActivityIndicator animating size="large" color="#0000ff" />
                      : (rewardList.next == null ? <Text style={{color: 'black', textAlign: 'center'}}>End</Text> : null)
                    }
                    
                  </View>)
          }}
          onRefresh={() => fetchRewards()}
          refreshing={rewardList.loading}
      /> : <Text>Loading...</Text>}
      <FAB 
        placement="right"
        icon={
          <Icon
            name="add"
            size={15}
            color="white"
          />
        }
        onPress={handleAddAction}
      />
    </View >
  )
}

const CustomerScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const rewardList = useSelector(state => state.Reward);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    navigation.setOptions({
      showHeader: true,
      headerLeft: (props: StackHeaderLeftButtonProps) => (<MenuIcon/>)
    });

  });
  
  React.useLayoutEffect(() => {

    fetchRewards()

  }, [navigation])
  
  const fetchRewards = async (url = '/rewards') => {
    if(url == null || loading) return

    setLoading(true)

    dispatch(GetData(url))
    .then(() => {

      setLoading(false)

    }).catch((error) => {

      setLoading(false)

    })

  }

  const redeemRow = (rowMap, item) => {
    let key = item.id

    if(item.type === 'points') {
      Alert.alert(
        "Not redeemable!",
        "Points rewards are not redeemable.",
        [
          {
            text: "OK",
            onPress: () => rowMap[key].closeRow()
          }
        ],
        {
          cancelable: false
        }
      )

      return
    }

    Alert.alert(
      "Are you sure?",
      "It requires " + item.cost + " points",
      [
        {
          text: "Cancel",
          onPress: () => rowMap[key].closeRow(),
          style: "cancel"
        },
        { text: "Continue", onPress: () => {

          handleRedeem(item.id)
          .then(() => {

            rowMap[key].closeRow()

            Alert.alert(
              "Successful!",
              "Reward redeemed successfully.",
              [
                {
                  text: "OK"
                }
              ]
            )

          })
          .catch((error) => {

            Alert.alert(
              "Error!",
              error.response.data.message,
              [
                {
                  text: "OK"
                }
              ]
            )
            
          })

        } }
      ],
      {
        cancelable: false
      }
    );
  }
  
  const handleRedeem = async (reward_id) => {
      
      try {
      
          const res = await axios.post('redeem', {'reward_id' : reward_id})
  
          var result = res.data.data

          return Promise.resolve()
          
      } catch (error) {

        return Promise.reject(error)

      }
  }

  const closeRow = (rowMap, item) => {
    let key = item.id
    
    if(rowMap[key]) {
        rowMap[key].closeRow() 
    }
  }

  const VisibleItem = props => {
      const {data} = props

      return (
          <View style={styles.rowFront}>
            <TouchableHighlight style={styles.rowFrontVisible}>
                <View>
                    <Text style={styles.title} numberOfLines={1}>Name: {data.item.name}</Text>
                    <Text style={styles.title} numberOfLines={1}>Description: {data.item.description}</Text>
                    <Text style={styles.title} numberOfLines={1}>Type: {data.item.type}</Text>
                </View>
            </TouchableHighlight>
          </View>
      )
  }

  const renderItem = (data, rowMap) => {

    return (
        <VisibleItem data={data}/>
    )

  }

  const HiddenItemWithAction = props => {
      const {onRedeem, onClose} = props;

      return (
          <View style={styles.rowBack}>
              <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight, {backgroundColor: '#18d643'}]} onPress={onRedeem}>
                <MaterialCommunityIcons name="star-outline" size={25} style={styles.trash} color="#fff"/>
              </TouchableOpacity>
          </View>
      )
  }

  const renderHiddenItem = (data, rowMap) => {
      return (
          <HiddenItemWithAction
            data={data}
            rowMap={rowMap}
            onRedeem={() => redeemRow(rowMap, data.item)}
            onClose={() => closeRow(rowMap, data.item)}
          />
      )
  }

  const handleAddAction = () => {
    
    navigation.navigate('RewardCreateScreen')
    
  }

  return (
    <View style={styles.container}>
      {rewardList.data.data ? <SwipeListView
          keyExtractor={(item) => item.id.toString()}
          data={rewardList.data.data}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          leftOpenValue={75}
          rightOpenValue={-75}
          disableRightSwipe
          initialNumToRender={10}
          onEndReachedThreshold={0.5}
          onEndReached={() => {fetchRewards(rewardList.data.next_page_url)}}
          // ListHeaderComponent={() => {
          //   return <SearchBar placeholder="Type Here..." lightTheme round />;
          // }}
          ListFooterComponent={() => {
            return (<View
                    style={{
                      paddingVertical: 20,
                      borderTopWidth: 1,
                      borderColor: "#CED0CE"
                    }}
                  >
                    {
                      loading ? <ActivityIndicator animating size="large" color="#0000ff" />
                      : (rewardList.next == null ? <Text style={{color: 'black', textAlign: 'center'}}>End</Text> : null)
                    }
                    
                  </View>)
          }}
          onRefresh={() => fetchRewards()}
          refreshing={rewardList.loading}
      /> : <Text style={{color: 'black'}}>Loading...</Text>}
    </View >
  )
}

export default function RewardScreen() {

  const Auth = useSelector(state => state.Auth);

  if(Auth.user.type == 1 || Auth.user.type == 2) {
    return AdminScreen();
  } else return CustomerScreen();

};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f4f4',
    flex: 1,
  },
  backTextWhite: {
    color: '#FFF',
  },
  rowFront: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    height: 'auto',
    margin: 5,
    marginBottom: 15,
    shadowColor: '#999',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  rowFrontVisible: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    height: 60,
    padding: 10,
    marginBottom: 15,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    margin: 5,
    marginBottom: 15,
    borderRadius: 5,
  },
  backRightBtn: {
    alignItems: 'flex-end',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
    paddingRight: 17,
  },
  backRightBtnLeft: {
    backgroundColor: '#1f65ff',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  trash: {
    height: 25,
    width: 25,
    marginRight: 7,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    // marginBottom: 5,
    color: '#666',
    backgroundColor: 'white'
  },
  details: {
    fontSize: 12,
    color: '#999',
  },
});