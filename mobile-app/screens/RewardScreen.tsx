import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackHeaderLeftButtonProps } from '@react-navigation/stack';
import { Button, Card, FAB, Icon, ListItem, SearchBar } from 'react-native-elements';
import {useDispatch, useSelector} from "react-redux";
import { Text } from '../components/Themed';
import MenuIcon from '../components/MenuIcon';
import { useEffect, useState } from 'react';
import _ from 'lodash';
import { DeleteData, GetData } from "../actions/RewardAction";
import { ActivityIndicator, Alert, StyleSheet, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import axios from 'axios'
import { Box, Center, CheckIcon, Heading, HStack, Image, ScrollView, Select, Spinner, useColorModeValue, VStack } from 'native-base';
import {Collapse,CollapseHeader, CollapseBody, AccordionList} from 'accordion-collapse-react-native';

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
    let key = item.id
    
    if(rowMap[key]) {
        rowMap[key].closeRow() 
    }

    navigation.navigate('RewardEditScreen', { data: item })
  }

  const deleteRow = (rowMap, item) => {
    let key = item.id

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
                <VStack space={1} h="100%">
                  <HStack w="100%" h="100%">
                    <Box flex={3}>
                      <VStack space={2}>
                        <Text style={[styles.title, {fontSize: 20, textTransform: 'capitalize'}]} numberOfLines={1}>{data.item.name}</Text>
                        <Text style={{color: 'black'}} numberOfLines={1}>{data.item.description}</Text>
                      </VStack>
                    </Box>
                    <Box flex={1}>
                      <VStack space={4}>
                        <Text style={{textTransform: 'uppercase', textAlign: 'right', fontSize: 12, color: 'gray'}} numberOfLines={1}>{data.item.type}</Text>
                        <Text style={{textTransform: 'uppercase', textAlign: 'right', fontSize: 16, color: 'gray'}}>{parseFloat(data.item.cost)} PTS</Text>
                      </VStack>
                    </Box>
                  </HStack>
                </VStack>
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
    <Center flex={1} backgroundColor="white">
      <Image style={{position: 'absolute', bottom: 0, opacity: 0.30}} w="100%" h={250} resizeMode="contain" source={require('../assets/images/car-bg.png')} alt="car background"/>
      {rewardList.data.data ? <SwipeListView
          style={{padding: 5, width: '100%'}}
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
      /> : <Center flex={1}>
        <HStack space={2}>
          <Heading color={"gray.500"}>Loading</Heading>
          <Spinner color={useColorModeValue("gray.500", "gray.100")} accessibilityLabel="Loading posts" />
        </HStack></Center>
      }
      <FAB 
        color="rgb(235, 164, 0)"
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
    </Center>
  )
}

const CustomerScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const rewardList = useSelector(state => state.Reward);
  const [loading, setLoading] = React.useState(false);
  const [filters, setFilters] = useState({
    show: 'all'
  })

  useEffect(() => {
    navigation.setOptions({
      showHeader: true,
      headerLeft: (props: StackHeaderLeftButtonProps) => (<MenuIcon/>)
    });

  });
  
  React.useLayoutEffect(() => {

    fetchRewards('/rewards', filters)

  }, [navigation])
  
  const fetchRewards = async (url = '/rewards', params = {}) => {
    if(url == null || loading) return

    setLoading(true)

    dispatch(GetData(url, params))
    .then(() => {

      setLoading(false)

    }).catch((error) => {

      setLoading(false)

    })

  }

  const redeemRow = (item) => {

    if(item.type === 'points') {
      Alert.alert(
        "Not redeemable!",
        "Points rewards are not redeemable.",
        [
          {
            text: "OK"
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
          style: "cancel"
        },
        { text: "Continue", onPress: () => {

          handleRedeem(item.id)
          .then(() => {

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
        <Box marginBottom={3}>
          <Box backgroundColor="white" margin={3} marginBottom={1} paddingLeft={6} paddingRight={6} paddingTop={3} paddingBottom={3} borderRadius={20} borderColor="black" borderWidth={1}>
            <Text style={{fontSize: 25, textTransform: 'capitalize', fontWeight: 'bold'}} numberOfLines={1}>{data.item.name}</Text>
            <Text style={{fontSize: 18, textTransform: 'capitalize'}} numberOfLines={1}>{data.item.description}</Text>
          </Box>
          <TouchableOpacity onPress={() => {redeemRow(data.item)}} disabled={data.item.type == 'points'} activeOpacity={0.8} style={{backgroundColor: 'black', width: '75%', alignSelf: 'center'}}>
            {data.item.type == 'points' ? <Text style={{color: 'white', fontSize: 15, textAlign: 'center'}}>NOT REDEEMABLE</Text>
            : <Text style={{color: 'white', fontSize: 15, textAlign: 'center'}}>REDEEM ({data.item.cost}) POINTS</Text>}
          </TouchableOpacity>
        </Box>
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
  
  const handleTypeChange = filter => {

    let tmpFilter = {...filters, show: filter}

    setFilters(tmpFilter)
    
    fetchRewards('/rewards', tmpFilter)

  }

  return (
    <Center flex={1} backgroundColor="white">
      <Image style={{position: 'absolute', bottom: 0, opacity: 0.30}} w="100%" h="250" resizeMode="contain" source={require('../assets/images/car-bg.png')} alt="car background"/>
      <Center shadow={2} borderRadius={20} backgroundColor="#f6f6f6" h="90%" w="80%" opacity={0.6} >
      <Box backgroundColor="white" w="100%" p={4}>
        <HStack style={{alignItems: 'center'}}>
          <VStack w="30%">
            <Text style={styles.title}>FILTER</Text>
          </VStack>
          <VStack w="70%">
            <Select
              selectedValue={filters.show}
              w="100%"
              accessibilityLabel="Select type"
              placeholder="Select type"
              onValueChange={(itemValue) => handleTypeChange(itemValue)}
              _selectedItem={{
                bg: "cyan.600",
                endIcon: <CheckIcon size={4} />,
              }}
              style={{fontSize: 14, paddingLeft: 10}}
              p={0}
            >
              <Select.Item label="All" value="all" />
              <Select.Item label="Eligible" value="eligible" />
            </Select>
          </VStack>
        </HStack>
      </Box>
      <Box flex={1}>
        {rewardList.data.data ? <SwipeListView
            style={{padding: 5, width: '100%'}}
            contentContainerStyle={{paddingLeft: 20, paddingRight: 20}}
            keyExtractor={(item) => item.id.toString()}
            data={rewardList.data.data}
            renderItem={renderItem}
            // renderHiddenItem={renderHiddenItem}
            leftOpenValue={75}
            rightOpenValue={-75}
            disableRightSwipe
            disableLeftSwipe
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
          /> : <Center flex={1}>
          <HStack space={2}>
            <Heading color={"gray.500"}>Loading</Heading>
            <Spinner color={useColorModeValue("gray.500", "gray.100")} accessibilityLabel="Loading posts" />
          </HStack></Center>
        }
      </Box>
      </Center>
    </Center>
  )

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
    marginBottom: 10,
    shadowColor: '#999',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  rowFrontVisible: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    height: 70,
    padding: 10
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    margin: 5,
    marginBottom: 10,
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
    color: 'black',
  },
  details: {
    fontSize: 12,
    color: '#999',
  },
});