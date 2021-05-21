import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackHeaderLeftButtonProps } from '@react-navigation/stack';
import { Badge, Button, FAB, Icon, ListItem, SearchBar } from 'react-native-elements';
import {useDispatch, useSelector} from "react-redux";
import { Text } from '../components/Themed';
import MenuIcon from '../components/MenuIcon';
import { useEffect } from 'react';
import _ from 'lodash';
import { DeleteData, GetData } from "../actions/TransactionAction";
import { ActivityIndicator, Alert, StyleSheet, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import moment from "moment";
import DateRangePicker from "react-native-daterange-picker";


export default function TransactionScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const transactionList = useSelector(state => state.Transaction);
  const [loading, setLoading] = React.useState(false);
  const [filters, setFilters] = React.useState({
      type: 'all'
  });
  const [date, setDate] = React.useState({
    startDate: moment(),
    endDate: moment(),
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
    <View style={styles.container}>
      <View>
        <DateRangePicker
            onChange={setDates}
            endDate={date.endDate}
            startDate={date.startDate}
            displayedDate={date.displayedDate}
            range
            presetButtons={true}
          >
            <Text style={{color: 'black', fontSize: 20}}>Date: {date.startDate ? date.startDate.format('YYYY-MM-DD') : 'null'} - {date.endDate ? date.endDate.format('YYYY-MM-DD') : (date.startDate ? date.startDate.format('YYYY-MM-DD') : 'null')}</Text>
        </DateRangePicker>
      </View>
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