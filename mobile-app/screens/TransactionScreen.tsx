import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackHeaderLeftButtonProps } from '@react-navigation/stack';
import { Badge, FAB, ListItem, SearchBar } from 'react-native-elements';
import {useDispatch, useSelector} from "react-redux";
// import { Text } from '../components/Themed';
import MenuIcon from '../components/MenuIcon';
import { useEffect, useState } from 'react';
import _ from 'lodash';
import { DeleteData, GetData } from "../actions/TransactionAction";
import { ActivityIndicator, Alert, StyleSheet, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons"
import moment from "moment-timezone";
import DateRangePicker from "react-native-daterange-picker";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Box, Button, Center, CheckIcon, Divider, Heading, HStack, Icon, Image, Input, Select, Spinner, Text, useColorModeValue, VStack } from 'native-base';
import { config } from '../constants/API';
import {Collapse,CollapseHeader, CollapseBody, AccordionList} from 'accordion-collapse-react-native';

const AdminScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const transactionList = useSelector(state => state.Transaction);
  const [loading, setLoading] = React.useState(false);
  const [filters, setFilters] = React.useState({
      type: 'all'
  });
  const [date, setDate] = React.useState({
    startDate: moment().format('x'),
    endDate: moment().format('x'),
    displayedDate: moment()
  });

  useEffect(() => {
    navigation.setOptions({
      showHeader: true,
      headerLeft: (props: StackHeaderLeftButtonProps) => (<MenuIcon/>)
    });

  });
  
  React.useLayoutEffect(() => {

    fetchTransactions()

  }, [navigation])
  
  const fetchTransactions = async (url = '/transactions', params = {}) => {
    if(url == null || loading) return

    setLoading(true)    

    dispatch(GetData(url, params))
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

    navigation.navigate('TransactionEditScreen', { data: item })
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
      let badgeStatus = 'warning';

      if(data.item.status === 'completed') badgeStatus = 'success';
      else if(data.item.status === 'cancelled') badgeStatus = 'error';
      else if(data.item.status === 'confirmed') badgeStatus = 'primary';

      return (
          <View style={styles.rowFront}>
            <TouchableHighlight style={styles.rowFrontVisible}>
                <View>
                    <Text style={styles.title} numberOfLines={1}>Transaction ID: {data.item.transaction_id}</Text>
                    <Text style={styles.title} numberOfLines={1}>Customer: {data.item.customer ? data.item.customer.name : ''}</Text>
                    <Text style={styles.title} numberOfLines={1}>Type: {data.item.type}</Text>
                    <Text style={styles.title} numberOfLines={1}>Status: <Badge status={badgeStatus} value={data.item.status} /></Text>
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
              <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight, {backgroundColor: '#1f65ff'}]} onPress={onEdit}>
                <MaterialCommunityIcons name="pencil-outline" size={25} style={styles.trash} color="#fff"/>
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
    
    navigation.navigate('TabTwoScreen')
    
  }

  const setDates = (dates) => {
    setDate(prev => ({...prev, ...dates}))

    if(dates.endDate) {
      let start = date.startDate;
      let end = dates.endDate;

      let tmpFilter = {...filters, start_date: start.format('YYYY-MM-DD'), end_date: end ? end.format('YYYY-MM-DD') : start.format('YYYY-MM-DD')};

      setFilters(tmpFilter);

      fetchTransactions('/transactions', tmpFilter);
    }
    
  }

  return (
    <Center flex={1} backgroundColor="white">
      <Image style={{position: 'absolute', bottom: 0, opacity: 0.30}} w="100%" h={250} resizeMode="contain" source={require('../assets/images/car-bg.png')} alt="car background"/>

      <Center h="95%" w="90%" backgroundColor='#e3e3e3' borderRadius={20} shadow={5}>
        <Box flex={1}>
        </Box>
      </Center>
    </Center>
  )

  return (
    <View style={styles.container}>
      {transactionList.data.data ? <SwipeListView
          keyExtractor={(item) => item.id.toString()}
          data={transactionList.data.data}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          ListEmptyComponent={() => {
            return <Text style={{color: 'black', textAlign: 'center'}}>No data available</Text>
          }}
          leftOpenValue={75}
          rightOpenValue={-75}
          disableRightSwipe
          initialNumToRender={10}
          onEndReachedThreshold={0.5}
          onEndReached={() => {fetchTransactions(transactionList.data.next_page_url)}}
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
                      : (transactionList.next == null ? <Text style={{color: 'black', textAlign: 'center'}}>End</Text> : null)
                    }
                    
                  </View>)
          }}
          onRefresh={() => fetchTransactions()}
          refreshing={transactionList.loading}
      /> : <Text>Loading...</Text>}
      <FAB 
        placement="right"
        icon={
          <Icon
            name="camera"
            size={15}
            color="white"
          />
        }
        onPress={handleAddAction}
      />
    </View >
  )
};

const UserScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const transactionList = useSelector(state => state.Transaction);
  const [loading, setLoading] = React.useState(false);
  const [filters, setFilters] = React.useState({
      type: 'all'
  });
  const [date, setDate] = React.useState({
    startDate: Number(moment().format('x')),
    endDate: Number(moment().format('x')),
    displayedDate: moment().format('x')
  });
  const [showDP, setShowDP] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      showHeader: true,
      headerLeft: (props: StackHeaderLeftButtonProps) => (<MenuIcon/>)
    });

  });
  
  React.useLayoutEffect(() => {

    fetchTransactions()

  }, [navigation])
  
  const fetchTransactions = async (url = '/transactions', params = {}) => {
    if(url == null || loading) return

    setLoading(true)    

    dispatch(GetData(url, params))
    .then(() => {

      setLoading(false)

    }).catch((error) => {

      setLoading(false)

    })

  }

  const editRow = (item) => {
    navigation.navigate('TransactionEditScreen', { data: item })
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

  const timezoneConvert = (time) => {
      var userTz = moment.tz.guess(true);
      var time = moment.tz(time, config.url.TIMEZONE);

      return time.tz(userTz);
  }

  const VisibleItem = props => {
      const {data} = props
      let badgeStatus = 'warning';

      if(data.item.status === 'completed') badgeStatus = 'success';
      else if(data.item.status === 'cancelled') badgeStatus = 'error';
      else if(data.item.status === 'confirmed') badgeStatus = 'primary';

      return (
        <Box style={styles.rowFront}>
          <VStack space={2}>
            <HStack space={2}>
              <VStack w="40%">
                <Text style={styles.title}>TRANSACTION ID</Text>
              </VStack>
              <VStack w="60%">
                <Text>{data.item.transaction_id || '-'}</Text>
              </VStack>
            </HStack>
            <HStack space={2}>
              <VStack w="40%">
                <Text style={styles.title}>TYPE</Text>
              </VStack>
              <VStack w="60%">
                <Text>{data.item.type || '-'}</Text>
              </VStack>
            </HStack>
            <HStack space={2}>
              <VStack w="40%">
                <Text style={styles.title}>REFERENCE NO.</Text>
              </VStack>
              <VStack w="60%">
                <Text>{data.item.reference_no || '-'}</Text>
              </VStack>
            </HStack>
            <HStack space={2}>
              <VStack w="40%">
                <Text style={styles.title}>RUNNING BALANCE</Text>
              </VStack>
              <VStack w="60%">
                <Text>{data.item.balance || '-'}</Text>
              </VStack>
            </HStack>
            <HStack space={2}>
              <VStack w="40%">
                <Text style={styles.title}>COST</Text>
              </VStack>
              <VStack w="60%">
                <Text>{data.item.cost || '-'}</Text>
              </VStack>
            </HStack>
            <HStack space={2}>
              <VStack w="40%">
                <Text style={styles.title}>CUSTOMER</Text>
              </VStack>
              <VStack w="60%">
                <Text>{data.item.customer.name || '-'}</Text>
              </VStack>
            </HStack>
            <HStack space={2}>
              <VStack w="40%">
                <Text style={styles.title}>SALESPERSON</Text>
              </VStack>
              <VStack w="60%">
                <Text>{(data.item.salesperson && data.item.salesperson.name ? data.item.salesperson.name : null) || '-'}</Text>
              </VStack>
            </HStack>
            <HStack space={2}>
              <VStack w="40%">
                <Text style={styles.title}>CREATED</Text>
              </VStack>
              <VStack w="60%">
                <Text>{timezoneConvert(data.item.created_at).format('YYYY-MM-DD hh:mm:ss A') || '-'}</Text>
              </VStack>
            </HStack>
            <HStack space={2}>
              <VStack w="40%">
                <Text style={styles.title}>UPDATED</Text>
              </VStack>
              <VStack w="60%">
                <Text>{timezoneConvert(data.item.updated_at).format('YYYY-MM-DD hh:mm:ss A') || '-'}</Text>
              </VStack>
            </HStack>
            <HStack space={2}>
              <VStack w="40%">
                <Text style={styles.title}>STATUS</Text>
              </VStack>
              <VStack w="60%">
                <Text><Badge status={badgeStatus} value={data.item.status} /></Text>
              </VStack>
            </HStack>
          </VStack>
          <Divider my={2}/>
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
                width={1/2*100+'%'} 
                colorScheme="info"
                onPress={() => editRow(data.item)}
                >
                View
              </Button>
              <Button 
                startIcon={<Icon as={MaterialCommunityIcons} name="pencil-outline" size={5} />}
                variant="ghost" 
                size="sm" 
                width={1/2*100+'%'} 
                colorScheme="teal"
                onPress={() => editRow(data.item)}>
                Edit
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
              <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight, {backgroundColor: '#1f65ff'}]} onPress={onEdit}>
                <MaterialCommunityIcons name="pencil-outline" size={25} style={styles.trash} color="#fff"/>
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

  const setStartDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDP(false);
    if(date.endDate < currentDate) {
      setDate(prev => ({...prev, startDate: currentDate, endDate: currentDate}));
    } else setDate(prev => ({...prev, startDate: currentDate}));

    const start = timezoneConvert(moment(currentDate)).format('YYYY-MM-DD');
    const end = timezoneConvert(moment((date.endDate < currentDate ? currentDate : date.endDate))).format('YYYY-MM-DD');
    
    let tmpFilter = {...filters, start_date: start, end_date: end};

    setFilters(tmpFilter);

    fetchTransactions('/transactions', tmpFilter);
    
  }

  const setEndDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDP(false);
    setDate(prev => ({...prev, endDate: currentDate}));
    
    return
  }
  
  const handleShowDP = picker => {
    setShowDP(picker);
  }
  
  const handleTypeChange = type => {
    let tmpFilter = {...filters, type: type};

    setFilters(tmpFilter);

    fetchTransactions('/transactions', tmpFilter);
  }

  const handleFilterInputChange = (name, input) => {    
    let tmpFilter = {...filters, [name]: input};

    setFilters(tmpFilter);    

    fetchTransactions('/transactions', tmpFilter);
  }

  return (
    <Center flex={1} backgroundColor="white">
      <Image style={{position: 'absolute', bottom: 0, opacity: 0.30}} w="100%" h={250} resizeMode="contain" source={require('../assets/images/car-bg.png')} alt="car background"/>
      <Center h="95%" w="90%" backgroundColor='#e3e3e3' borderRadius={20} shadow={5}>
        <Box backgroundColor="white" w="100%" p={5}>
          <View>
            {showDP == 'from' && (<DateTimePicker
              value={new Date(date.startDate)}
              mode={'date'}
              is24Hour={true}
              display="default"
              onChange={setStartDate}
            />)}
            {showDP == 'to' && (<DateTimePicker
              value={new Date(date.endDate)}
              mode={'date'}
              is24Hour={true}
              display="default"
              onChange={setEndDate}
              minimumDate={new Date(date.startDate)}
            />)}
          </View>
          <Collapse>
            <CollapseHeader>
              <View>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>Filters</Text>
              </View>
            </CollapseHeader>
            <CollapseBody>
              <VStack space={2}>
                <HStack style={{alignItems: 'center'}}>
                  <VStack w="40%">
                    <Text style={styles.title}>TYPE</Text>
                  </VStack>
                  <VStack w="60%">
                    <Select
                      selectedValue={filters.type}
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
                      <Select.Item label="Rewards" value="rewards" />
                      <Select.Item label="Redeems" value="redeems" />
                    </Select>
                  </VStack>
                </HStack>
                <HStack style={{alignItems: 'center'}}>
                  <VStack w="40%">
                    <Text style={styles.title}>TRANSACTION ID</Text>
                  </VStack>
                  <VStack w="60%">
                    <Input
                      onChangeText={input => handleFilterInputChange('transaction_id', input)}
                      value={filters.transaction_id}
                      variant="underlined"
                      size="xs"
                      placeholder="Enter transaction ID"
                      _light={{
                        placeholderTextColor: "blueGray.400",
                      }}
                      _dark={{
                        placeholderTextColor: "blueGray.50",
                      }}
                      fontSize={14}
                      p={0}
                      _focus={{
                        padding: 0
                      }}
                      _hover={{
                        padding: 0
                      }}
                    />
                  </VStack>
                </HStack>
                <HStack style={{alignItems: 'center'}}>
                  <VStack w="40%">
                    <Text style={styles.title}>REFERENCE NO.</Text>
                  </VStack>
                  <VStack w="60%">
                    <Input
                      onChangeText={input => handleFilterInputChange('reference_no', input)}
                      value={filters.reference_no}
                      variant="underlined"
                      size="xs"
                      placeholder="Enter reference no."
                      _light={{
                        placeholderTextColor: "blueGray.400",
                      }}
                      _dark={{
                        placeholderTextColor: "blueGray.50",
                      }}
                      fontSize={14}
                      p={0}
                      _focus={{
                        padding: 0
                      }}
                      _hover={{
                        padding: 0
                      }}
                    />
                  </VStack>
                </HStack>
                <HStack style={{alignItems: 'center'}}>
                  <VStack w="40%">
                    <Text style={styles.title}>SALESPERSON</Text>
                  </VStack>
                  <VStack w="60%">
                    <Input
                      onChangeText={input => handleFilterInputChange('salesperson', input)}
                      value={filters.salesperson}
                      variant="underlined"
                      size="xs"
                      placeholder="Enter salesperson"
                      _light={{
                        placeholderTextColor: "blueGray.400",
                      }}
                      _dark={{
                        placeholderTextColor: "blueGray.50",
                      }}
                      fontSize={14}
                      p={0}
                      _focus={{
                        padding: 0
                      }}
                      _hover={{
                        padding: 0
                      }}
                    />
                  </VStack>
                </HStack>
                <HStack style={{alignItems: 'center'}}>
                  <VStack w="40%">
                    <Text style={styles.title}>DATE (FROM)</Text>
                  </VStack>
                  <VStack w="60%">
                    <Button
                      titleStyle={{textAlign: 'left', fontSize: 14}}
                      title={moment(date.startDate).format('MM-DD-YYYY')}
                      type="clear"
                      onPress={() => handleShowDP('from')}
                    />
                  </VStack>
                </HStack>
                <HStack style={{alignItems: 'center'}}>
                  <VStack w="40%">
                    <Text style={styles.title}>DATE (TO)</Text>
                  </VStack>
                  <VStack w="60%">
                    <Button
                      titleStyle={{textAlign: 'left', fontSize: 14}}
                      title={moment(date.endDate).format('MM-DD-YYYY')}
                      type="clear"
                      onPress={() => handleShowDP('to')}
                    /> 
                  </VStack>
                </HStack>
              
              </VStack>
            </CollapseBody>
          </Collapse>
        </Box>
        <Box flex={1}>
          {transactionList.data.data ? <SwipeListView
              contentContainerStyle={{padding: 15}}
              keyExtractor={(item) => item.id.toString()}
              data={transactionList.data.data}
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
              onEndReached={() => {fetchTransactions(transactionList.data.next_page_url)}}
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
                          : (transactionList.next == null ? <Text style={{color: 'black', textAlign: 'center'}}>End</Text> : null)
                        }
                        
                      </View>)
              }}
              onRefresh={() => fetchTransactions()}
              refreshing={transactionList.loading}
          /> : <Center flex={1}>
            <HStack space={2}>
              <Heading color={"gray.500"}>Loading</Heading>
              <Spinner color={useColorModeValue("gray.500", "gray.100")} accessibilityLabel="Loading posts" />
            </HStack></Center>}
        </Box>
      </Center>
    </Center>
  )
};

export default function TransactionScreen() {

  return UserScreen();

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
    borderRadius: 20,
    height: 'auto',
    margin: 5,
    marginBottom: 15,
    shadowColor: '#999',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    padding: 15
  },
  rowFrontVisible: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    height: 'auto',
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
    textAlignVertical: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    // marginBottom: 5,
    color: '#666'
  },
  details: {
    fontSize: 12,
    color: '#999',
  },
});