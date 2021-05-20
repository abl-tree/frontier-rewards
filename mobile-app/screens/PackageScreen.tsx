import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackHeaderLeftButtonProps } from '@react-navigation/stack';
import { Button, FAB, Icon, ListItem, SearchBar } from 'react-native-elements';
import {useDispatch, useSelector} from "react-redux";
import { Text } from '../components/Themed';
import MenuIcon from '../components/MenuIcon';
import { useEffect } from 'react';
import _ from 'lodash';
import { DeleteData, GetData } from "../actions/PackageAction";
import { ActivityIndicator, Alert, StyleSheet, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'


export default function PackageScreen() {
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

  const handleAddAction = () => {
    
    navigation.navigate('PackageCreateScreen')
    
  }

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
    height: 60,
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