import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import axios from 'axios'
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import QRCode from 'react-native-qrcode-generator';
import { useNavigation } from '@react-navigation/native';
import { StackHeaderLeftButtonProps } from '@react-navigation/stack';
import MenuIcon from '../components/MenuIcon';

export default function ProfileScreen() {
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
    <View style={styles.container}>
      {
        user.info ? 
        <QRCode
            value={user.info.customer_id}
            size={300}
            bgColor='black'
            fgColor='white'/>
        : <Text></Text>
      }
      <Text style={styles.title}>Name: {user.name}</Text>
      <Text style={styles.title}>Email: {user.email}</Text>
    </View>
  );
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
