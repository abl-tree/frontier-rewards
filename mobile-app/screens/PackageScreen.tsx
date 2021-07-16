import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackHeaderLeftButtonProps } from '@react-navigation/stack';
import { FAB, ListItem, SearchBar } from 'react-native-elements';
import {useDispatch, useSelector} from "react-redux";
import MenuIcon from '../components/MenuIcon';
import { useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import { DeleteData, GetData } from "../actions/PackageAction";
import { ActivityIndicator, Alert, Dimensions, StyleSheet, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons"
import { Box, Button, Center, Divider, Heading, HStack, Icon, Image, Spinner, Text, useColorModeValue, VStack } from 'native-base';
import Carousel from 'react-native-snap-carousel';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const AdminScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const packageList = useSelector(state => state.Package);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    
    navigation.setOptions({
      showHeader: true,
      headerLeft: (props: StackHeaderLeftButtonProps) => (<MenuIcon/>)
    });

  });
  
  React.useLayoutEffect(() => {

    fetchPackages()

  }, [navigation])
  
  const fetchPackages = async (url = '/packages') => {
    if(url == null || loading) return

    setLoading(true)

    dispatch(GetData(url))
    .then(() => {

      setLoading(false)

    }).catch((error) => {

      setLoading(false)

    })

  }

  const viewRow = (item) => {

    navigation.navigate('PackageViewScreen', { data: item })

  }

  const editRow = (item) => {

    navigation.navigate('PackageEditScreen', { data: item })

  }

  const deleteRow = (item) => {
    Alert.alert(
      "Are you sure?",
      "This action cannot be undone.",
      [
        {
          text: "Cancel",
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
        <Box padding={3} style={[styles.rowFront, {minHeight: 100}]}>
          <Box flex={1} marginBottom={3}>
            <VStack space={1}>
              <Text style={{fontWeight: 'bold', fontSize: 18}}>{data.item.name}</Text>
              <Text style={{fontSize: 16}}>{data.item.description}</Text>
            </VStack>
          </Box>
          <Divider my={2} />
          <Box style={{height: 'auto', width: '100%', borderBottomLeftRadius: 5, borderBottomRightRadius: 5}}>
            <Button.Group
              w="100%"
              variant="solid"
              isAttached
              // space={6}
              mx={{
                base: "auto",
                md: 0,
              }}
            >
              <Button 
                startIcon={<Icon as={MaterialCommunityIcons} name="eye-outline" size={5} />}
                variant="ghost" 
                size="sm" 
                width={1/3*100+'%'} 
                colorScheme="info"
                onPress={() => viewRow(data.item)}
                >
                View
              </Button>
              <Button 
                startIcon={<Icon as={MaterialCommunityIcons} name="pencil-outline" size={5} />}
                variant="ghost" 
                size="sm" 
                width={1/3*100+'%'} 
                colorScheme="teal"
                onPress={() => editRow(data.item)}>
                Edit
              </Button>
              <Button
                startIcon={<Icon as={MaterialCommunityIcons} name="delete-outline" size={5} />}
                size="sm"
                variant="ghost"
                width={1/3*100+'%'}
                colorScheme="danger"
                onPress={() => deleteRow(data.item)}>
                Delete
              </Button>
            </Button.Group>
          </Box>
        </Box>
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
    
    navigation.navigate('PackageCreateScreen')
    
  }

  return (
    <Center flex={1} backgroundColor="white">
      <Image style={{position: 'absolute', bottom: 0, opacity: 0.30}} w="100%" h={250} resizeMode="contain" source={require('../assets/images/car-bg.png')} alt="car background"/>
      {packageList.data.data ? <SwipeListView
          keyExtractor={(item) => item.id.toString()}
          style={{padding: 5, width: '100%'}}
          data={packageList.data.data}
          renderItem={renderItem}
          leftOpenValue={75}
          rightOpenValue={-150}
          disableRightSwipe
          initialNumToRender={10}
          onEndReachedThreshold={0.5}
          onEndReached={() => {fetchPackages(packageList.data.next_page_url)}}
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
                      : (packageList.next == null ? <Text style={{color: 'black', textAlign: 'center'}}>End</Text> : null)
                    }
                    
                  </View>)
          }}
          onRefresh={() => fetchPackages()}
          refreshing={packageList.loading}
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
            as={MaterialCommunityIcons}
            name="plus"
            size={18}
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
  const packageList = useSelector(state => state.Package);
  const [loading, setLoading] = useState(false);
  const carouselRef = useRef(null);
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
  });

  useEffect(() => {
    
    navigation.setOptions({
      showHeader: true,
      headerLeft: (props: StackHeaderLeftButtonProps) => (<MenuIcon/>)
    });

  });
  
  React.useLayoutEffect(() => {

    fetchPackages()

  }, [navigation])  
  
  const fetchPackages = async (url = '/packages') => {
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

    navigation.navigate('PackageEditScreen', { data: item })
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
                    <Text style={styles.title} numberOfLines={1}>{data.item.name}</Text>
                    <Text style={styles.title} numberOfLines={1}>{data.item.description}</Text>
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
  
  const carouselItem = ({item, index}) => {
    return (
      <Box minHeight={SCREEN_HEIGHT * 0.45} borderRadius={20} p={10} backgroundColor="white" shadow={2}>
        <VStack alignItems="center" space={5}>
          <Image size="xl" resizeMode="cover" source={require('../assets/images/membership.png')} alt="Membership"/>
          <Text style={{textAlign: "center", fontSize: 25}}>{item.name}</Text>
        </VStack>
      </Box>
    )
  }

  const onSnapToItem = (index) => {    
    setCarouselState(prev => ({...prev, active: index}))
  }

  return (
    <Center flex={1} backgroundColor="white">
      <Image style={{position: 'absolute', bottom: 0, opacity: 0.30}} w="100%" h={250} resizeMode="contain" source={require('../assets/images/car-bg.png')} alt="car background"/>
      <Box w="100%">
        <Carousel
          containerCustomStyle={{alignSelf: 'center'}}
          slideStyle={{borderRadius: 20, padding: 10}}
          ref={carouselRef}
          data={packageList.data.data}
          renderItem={carouselItem}
          sliderWidth={SCREEN_WIDTH}
          itemWidth={SCREEN_WIDTH * 0.85}
          layout={"default"}
          onSnapToItem = { index => onSnapToItem(index) }
        />
      </Box>
    </Center>
  )

  return (
    <View style={styles.container}>
      {packageList.data.data ? <SwipeListView
          keyExtractor={(item) => item.id.toString()}
          data={packageList.data.data}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          leftOpenValue={75}
          rightOpenValue={-150}
          disableRightSwipe
          initialNumToRender={10}
          onEndReachedThreshold={0.5}
          onEndReached={() => {fetchPackages(packageList.data.next_page_url)}}
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
                      : (packageList.next == null ? <Text style={{color: 'black', textAlign: 'center'}}>End</Text> : null)
                    }
                    
                  </View>)
          }}
          onRefresh={() => fetchPackages()}
          refreshing={packageList.loading}
      /> : <Text>Loading...</Text>}
    </View >
  )
}

export default (props) => {
  const auth = useSelector(state => state.Auth);
  
  if(auth.user.type === 1 || auth.user.type === 2) {

      return AdminScreen(props)

  } else {

      return CustomerScreen(props)

  }
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
    color: 'black',
    backgroundColor: 'white'
  },
  details: {
    fontSize: 12,
    color: '#999',
  },
});