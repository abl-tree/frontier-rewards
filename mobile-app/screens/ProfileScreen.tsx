import * as React from 'react';
import { ActivityIndicator, Alert, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { View } from '../components/Themed';
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import QRCode from 'react-native-qrcode-generator';
import { useNavigation } from '@react-navigation/native';
import { StackHeaderLeftButtonProps } from '@react-navigation/stack';
import MenuIcon from '../components/MenuIcon';
import { Card } from 'react-native-elements';
import { Box, Center, Container, HStack, Image, VStack, Text, ScrollView, Button, Pressable, Heading, Spinner, useColorModeValue, AlertDialog } from 'native-base';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import { SwipeListView } from 'react-native-swipe-list-view';
import { ClaimData, GetData } from '../actions/UserRewardAction';
import { backgroundColor } from 'styled-system';

const SCREEN_WIDTH = Dimensions.get('window').width;

const AdminProfile = () => {
  const navigation = useNavigation();
  const Auth = useSelector(state => state.Auth);
  const [user, setUser] = useState({})

  useEffect(() => {

    navigation.setOptions({
      showHeader: true,
      headerLeft: (props: StackHeaderLeftButtonProps) => (<MenuIcon/>)
    });
    
    fetchData()

  }, [])

  const fetchData = async event => {

      const res = await axios.get('/users/' + Auth.user.id)

      setUser(res.data.data)

  }

  return (
    <Box flex={1} backgroundColor="white">
      <Image style={{position: 'absolute', bottom: 0, opacity: 0.30}} w="100%" h={250} resizeMode="contain" source={require('../assets/images/car-bg.png')} alt="car background"/>
      <ScrollView flex={1}>
        <Box flex={1} width="100%" p={3}>
          <Box w="100%" alignItems="center">
            <VStack alignItems="center">
              {
                user.info ? 
                <QRCode
                    value={user.info.customer_id}
                    size={100}
                    bgColor='black'
                    fgColor='white'/>
                : <Text></Text>
              }
              <Text style={{fontWeight: 'bold', fontSize: 25}}>{user.name}</Text>
              <Text style={{fontSize: 15}}>{user.type_name}</Text>
              <Text style={{fontWeight: 'bold', fontSize: 18}}>Points: {user.points}</Text>
            </VStack>
          </Box>
          <Card containerStyle={{backgroundColor: '#e3e3e3', borderRadius: 20, paddingTop: 1, paddingLeft: 1, paddingRight: 1}}>
            <Card containerStyle={{borderRadius: 20}}>
              <Text style={{fontWeight: 'bold', fontSize: 18, marginBottom: 5}}>PERSONAL INFORMATION</Text>
              <HStack>
                <VStack w="40%">
                  <Text style={styles.title}>Firstname: </Text>
                </VStack>
                <VStack w="60%">
                  <Text>{user.firstname || '-'}</Text>
                </VStack>
              </HStack>
              <HStack>
                <VStack w="40%">
                  <Text style={styles.title}>Middlename: </Text>
                </VStack>
                <VStack w="60%">
                  <Text>{user.middlename || '-'}</Text>
                </VStack>
              </HStack>
              <HStack>
                <VStack w="40%">
                  <Text style={styles.title}>Lastname: </Text>
                </VStack>
                <VStack w="60%">
                  <Text>{user.lastname || '-'}</Text>
                </VStack>
              </HStack>
              <HStack>
                <VStack w="40%">
                  <Text style={styles.title}>Email: </Text>
                </VStack>
                <VStack w="60%">
                  <Text>{user.email}</Text>
                </VStack>
              </HStack>
              <HStack>
                <VStack w="40%">
                  <Text style={styles.title}>Phone: </Text>
                </VStack>
                <VStack w="60%">
                  <Text>{user.phone_number || '-'}</Text>
                </VStack>
              </HStack>
              <HStack>
                <VStack w="40%">
                  <Text style={styles.title}>Package: </Text>
                </VStack>
                <VStack w="60%">
                  <Text>{(user.info && user.info.package ? user.info.package.name : '-')}</Text>
                </VStack>
              </HStack>
            </Card>
          </Card>
        </Box>
      </ScrollView>
    </Box>
  );
}

const CustomerProfile = () => {
  const navigation = useNavigation();
  const Auth = useSelector(state => state.Auth);
  const UserRewards = useSelector(state => state.UserReward);
  const [user, setUser] = useState({})  
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();
  const [rewards, setRewards] = useState({
      loading: false,
      data: [],
      errorMsg: ''
  })
  const carouselRef = useRef(null)
  const [carouselState, setCarouselState] = useState({
      active:0,
      items: [
      {
          id:"transaction",
          title: "Transaction Summary",
      },
      {
          id:"active_campaigns",
          title: "Active Campaigns",
      },
      {
          id:"active_actions",
          title: "Active Actions",
      },
      {
          id:"users",
          title: "Users",
      },
      {
          id:"packages",
          title: "Packages",
      },
    ]
  })

  useEffect(() => {

    navigation.setOptions({
      showHeader: true,
      headerLeft: (props: StackHeaderLeftButtonProps) => (<MenuIcon/>)
    });
    
    fetchData()
    fetchUserRewards()

  }, [])

  const fetchData = async event => {

      const res = await axios.get('/users/' + Auth.user.id)

      setUser(res.data.data)

  }

  const carouselItem = ({item, index}) => {
    if(item.next_page) {
      return (
        <Card>
          <Button onPress={() => {fetchUserRewards(item.next_page)
          }}>
            <Text>Show more </Text>
          </Button>
        </Card>
      )
    } else {
      if(index == carouselState.active) {
        return (
          <VStack>
            <Card>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>{item.reward_name}</Text>
            </Card>
            <TouchableOpacity activeOpacity={0.7} style={{backgroundColor: 'black', width: '70%', alignSelf: 'center', padding: 4, marginTop: 5}}>
              <Text alignSelf="center" color="white">Claim</Text>
            </TouchableOpacity>
          </VStack>
        )
      } else {
        return (
          <VStack>
            <Card>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>{item.reward_name}</Text>
            </Card>
            <TouchableOpacity disabled style={{backgroundColor: 'rgba(0, 0, 0, 0.3)', width: '70%', alignSelf: 'center', padding: 4, marginTop: 5}}>
              <Text alignSelf="center" color="white">Claim</Text>
            </TouchableOpacity>
          </VStack>
        )
      }
    }
  }

  const fetchUserRewardsB = async ($url = null) => {

      setRewards(prev => ({...prev, 'loading' : true}));

      const res = await axios.get($url ? $url : '/users/' + Auth.user.id + '/rewards')

      let result = res.data.data
      
      setCarouselState(prev => ({...prev, items: [...result.rewards.data, {next_page: result.rewards.next_page_url}]}));
      
      setRewards(prev => ({...prev, 'loading' : false}));

      setRewards(prev => ({...prev, 'data' : result.rewards}));

  }
  
  const fetchUserRewards = async (url = '/users/' + Auth.user.id + '/rewards') => {
    if(url == null || loading) return

    setLoading(true)

    dispatch(GetData(url))
    .then(() => {

      setLoading(false)

    }).catch((error) => {

      setLoading(false)

    })

  }

  const renderItem = (data, rowMap) => {    

    return (
        <VisibleItem data={data}/>
    )

  }

  const rewardClaim = id => {
    
    Alert.alert(
      "Are you sure?",
      "This action cannot be undone.",
      [
        {
          text: "Cancel",
          // onPress: () => rowMap[key].closeRow(),
          style: "cancel"
        },
        { text: "OK", onPress: () => {
            dispatch(ClaimData(id))
            .then(() => {

              // setLoading(false)

            }).catch((error) => {

              // setLoading(false)

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
      <Box minHeight={100} w="100%" marginBottom={3} backgroundColor="white" borderRadius={20} shadow={2} p={5}>
        <VStack alignItems="center" space={3}>
          <Text style={{fontSize: 18}}>{data.item.reward_name}</Text>
          <Button colorScheme="yellow" size="sm" onPress={() => rewardClaim(data.item.id)}>Claim</Button>
        </VStack>
      </Box>
    )
  }

  return (
    <Box flex={1} backgroundColor="white">
      <Image style={{position: 'absolute', bottom: 0, opacity: 0.30}} w="100%" h={250} resizeMode="contain" source={require('../assets/images/car-bg.png')} alt="car background"/>
      {UserRewards.data.data ? <SwipeListView
        contentContainerStyle={{padding: 15}}
        ListFooterComponentStyle={{backgroundColor: 'rgb(235, 235, 235)', borderRadius: 20}}
        keyExtractor={(item) => item.id.toString()}
        data={UserRewards.data.data}
        renderItem={renderItem}
        // renderHiddenItem={renderHiddenItem}
        ListEmptyComponent={() => {
          return <Text style={{color: 'black', textAlign: 'center'}}>No data available</Text>
        }}
        leftOpenValue={75}
        rightOpenValue={-75}
        disableRightSwipe
        disableLeftSwipe
        initialNumToRender={10}
        onEndReachedThreshold={0.5}
        onEndReached={() => {fetchUserRewards(UserRewards.data.next_page_url)}}
        ListHeaderComponent={() => {
          return (
            <Box flex={1} width="100%" paddingTop={15} paddingBottom={15} alignItems="center">
              <Box w="100%" alignItems="center">
                <VStack alignItems="center">
                  {
                    user.info ? 
                    <QRCode
                        value={user.info.customer_id}
                        size={100}
                        bgColor='black'
                        fgColor='white'/>
                    : <Text></Text>
                  }
                  <Text style={{fontWeight: 'bold', fontSize: 25}}>{user.name}</Text>
                  <Text style={{fontSize: 15}}>{user.type_name}</Text>
                  <Text style={{fontWeight: 'bold', fontSize: 18}}>Points: {user.points}</Text>
                </VStack>
              </Box>
              <Card containerStyle={{backgroundColor: '#e3e3e3', borderRadius: 20, paddingTop: 1, paddingLeft: 1, paddingRight: 1, width: '100%'}}>
                <Card containerStyle={{borderRadius: 20}}>
                  <Text style={{fontWeight: 'bold', fontSize: 18, marginBottom: 5}}>PERSONAL INFORMATION</Text>
                  <HStack>
                    <VStack w="40%">
                      <Text style={styles.title}>Firstname: </Text>
                    </VStack>
                    <VStack w="60%">
                      <Text>{user.firstname || '-'}</Text>
                    </VStack>
                  </HStack>
                  <HStack>
                    <VStack w="40%">
                      <Text style={styles.title}>Middlename: </Text>
                    </VStack>
                    <VStack w="60%">
                      <Text>{user.middlename || '-'}</Text>
                    </VStack>
                  </HStack>
                  <HStack>
                    <VStack w="40%">
                      <Text style={styles.title}>Lastname: </Text>
                    </VStack>
                    <VStack w="60%">
                      <Text>{user.lastname || '-'}</Text>
                    </VStack>
                  </HStack>
                  <HStack>
                    <VStack w="40%">
                      <Text style={styles.title}>Email: </Text>
                    </VStack>
                    <VStack w="60%">
                      <Text>{user.email}</Text>
                    </VStack>
                  </HStack>
                  <HStack>
                    <VStack w="40%">
                      <Text style={styles.title}>Phone: </Text>
                    </VStack>
                    <VStack w="60%">
                      <Text>{user.phone_number || '-'}</Text>
                    </VStack>
                  </HStack>
                  <HStack>
                    <VStack w="40%">
                      <Text style={styles.title}>Package: </Text>
                    </VStack>
                    <VStack w="60%">
                      <Text>{(user.info && user.info.package ? user.info.package.name : '-')}</Text>
                    </VStack>
                  </HStack>
                </Card>
                <Card containerStyle={{borderRadius: 20}}>
                  <Text style={{fontWeight: 'bold', fontSize: 18, marginBottom: 5}}>VEHICLE INFORMATION</Text>
                  <HStack>
                    <VStack w="40%">
                      <Text style={styles.title}>Year: </Text>
                    </VStack>
                    <VStack w="60%">
                      <Text>-</Text>
                    </VStack>
                  </HStack>
                  <HStack>
                    <VStack w="40%">
                      <Text style={styles.title}>Make: </Text>
                    </VStack>
                    <VStack w="60%">
                      <Text>-</Text>
                    </VStack>
                  </HStack>
                  <HStack>
                    <VStack w="40%">
                      <Text style={styles.title}>Model: </Text>
                    </VStack>
                    <VStack w="60%">
                      <Text>-</Text>
                    </VStack>
                  </HStack>
                  <HStack>
                    <VStack w="40%">
                      <Text style={styles.title}>Trim: </Text>
                    </VStack>
                    <VStack w="60%">
                      <Text>-</Text>
                    </VStack>
                  </HStack>
                  <HStack>
                    <VStack w="40%">
                      <Text style={styles.title}>Color: </Text>
                    </VStack>
                    <VStack w="60%">
                      <Text>-</Text>
                    </VStack>
                  </HStack>
                  <HStack>
                    <VStack w="40%">
                      <Text style={styles.title}>Vin No.: </Text>
                    </VStack>
                    <VStack w="60%">
                      <Text>-</Text>
                    </VStack>
                  </HStack>
                </Card>
              </Card>
              <Text fontSize={20} fontWeight="bold" marginTop={10}>Rewards</Text>
            </Box>
          )
        }}
        ListFooterComponent={() => {
          return (<View
                  style={{
                    paddingVertical: 20,
                    backgroundColor: 'transparent'
                  }}
                >
                  {
                    loading ? <ActivityIndicator animating size="large" color="#0000ff" />
                    : (UserRewards.next == null ? <Text style={{color: 'black', textAlign: 'center'}}>End</Text> : null)
                  }
                  
                </View>)
        }}
        onRefresh={() => fetchUserRewards()}
        refreshing={UserRewards.loading}
    /> : <Center flex={1}>
      <HStack space={2}>
        <Heading color={"gray.500"}>Loading</Heading>
        <Spinner color={useColorModeValue("gray.500", "gray.100")} accessibilityLabel="Loading posts" />
      </HStack></Center>}
    </Box>
  )
}

export default (props) => {
  const auth = useSelector(state => state.Auth);
  

  if(auth.user.type === 1 || auth.user.type === 2) {

      return AdminProfile(props)

  } else {

      return CustomerProfile(props)

  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f4f4',
    flex: 1,
    padding: 10
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
