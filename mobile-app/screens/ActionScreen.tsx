import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackHeaderLeftButtonProps } from '@react-navigation/stack';
import { FAB, ListItem, SearchBar } from 'react-native-elements';
import {useDispatch, useSelector} from "react-redux";
import MenuIcon from '../components/MenuIcon';
import { useEffect } from 'react';
import _ from 'lodash';
import { DeleteData, GetData } from "../actions/ActionAction";
import { ActivityIndicator, Alert, StyleSheet, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons"
import { Box, Button, Center, Divider, Heading, HStack, Icon, Image, Spinner, Text, useColorModeValue, VStack } from 'native-base';

const AdminScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const actionList = useSelector(state => state.Action);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    navigation.setOptions({
      showHeader: true,
      headerLeft: (props: StackHeaderLeftButtonProps) => (<MenuIcon/>)
    });

  });
  
  React.useLayoutEffect(() => {

    fetchActions()

  }, [navigation])
  
  const fetchActions = async (url = '/actions') => {
    if(url == null || loading) return

    setLoading(true)

    dispatch(GetData(url))
    .then(() => {

      setLoading(false)

    }).catch((error) => {

      setLoading(false)

    })

  }

  const editRow = (item) => {

    navigation.navigate('ActionEditScreen', { data: item })

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
                startIcon={<Icon as={MaterialCommunityIcons} name="pencil-outline" size={5} />}
                variant="ghost" 
                size="sm" 
                width={1/2*100+'%'} 
                colorScheme="teal"
                onPress={() => editRow(data.item)}>
                Edit
              </Button>
              <Button
                startIcon={<Icon as={MaterialCommunityIcons} name="delete-outline" size={5} />}
                size="sm"
                variant="ghost"
                width={1/2*100+'%'}
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
    
    navigation.navigate('ActionCreateScreen')
    
  }

  return (
    <Center flex={1} backgroundColor="white">
      <Image style={{position: 'absolute', bottom: 0, opacity: 0.30}} w="100%" h={250} resizeMode="contain" source={require('../assets/images/car-bg.png')} alt="car background"/>
      {
        actionList.data.data ? <SwipeListView
          keyExtractor={(item) => item.id.toString()}
          style={{padding: 5, width: '100%'}}
          data={actionList.data.data}
          renderItem={renderItem}
          // renderHiddenItem={renderHiddenItem}
          leftOpenValue={75}
          rightOpenValue={-150}
          disableRightSwipe
          initialNumToRender={10}
          onEndReachedThreshold={0.5}
          onEndReached={() => {fetchActions(actionList.data.next_page_url)}}
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
                      : (actionList.next == null ? <Text style={{color: 'black', textAlign: 'center'}}>End</Text> : null)
                    }
                    
                  </View>)
          }}
          onRefresh={() => fetchActions()}
          refreshing={actionList.loading}
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
};

const CustomerScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const actionList = useSelector(state => state.Action);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    navigation.setOptions({
      showHeader: true,
      headerLeft: (props: StackHeaderLeftButtonProps) => (<MenuIcon/>)
    });

  });
  
  React.useLayoutEffect(() => {

    fetchActions()

  }, [navigation])
  
  const fetchActions = async (url = '/actions') => {
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

    navigation.navigate('ActionEditScreen', { data: item })
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
        <Box shadow={2} p={5} marginBottom={3} borderRadius={20} w="100%" backgroundColor="white">
          <HStack w="100%" minHeight={70} alignItems="center">
            <Text style={{fontSize: 20, fontWeight: 'bold', textTransform: 'capitalize'}}>{data.item.name}</Text>
          </HStack>
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

  return (
    <Center flex={1} backgroundColor="white">
      <Image style={{position: 'absolute', bottom: 0, opacity: 0.30}} w="100%" h={250} resizeMode="contain" source={require('../assets/images/car-bg.png')} alt="car background"/>
      {actionList.data.data ? <SwipeListView
          style={{padding: 5, width: '100%'}}
          contentContainerStyle={{paddingLeft: 20, paddingRight: 20}}
          keyExtractor={(item) => item.id.toString()}
          data={actionList.data.data}
          renderItem={renderItem}
          leftOpenValue={75}
          rightOpenValue={-150}
          disableRightSwipe
          disableLeftSwipe
          initialNumToRender={10}
          onEndReachedThreshold={0.5}
          onEndReached={() => {fetchActions(actionList.data.next_page_url)}}
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
                      : (actionList.next == null ? <Text style={{color: 'black', textAlign: 'center'}}>End</Text> : null)
                    }
                    
                  </View>)
          }}
          onRefresh={() => fetchActions()}
          refreshing={actionList.loading}
      /> : <Center flex={1}>
        <HStack space={2}>
          <Heading color={"gray.500"}>Loading</Heading>
          <Spinner color={useColorModeValue("gray.500", "gray.100")} accessibilityLabel="Loading posts" />
        </HStack></Center>
      }
      {/* </Center> */}
    </Center>
  )
};

export default function ActionScreen() {

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