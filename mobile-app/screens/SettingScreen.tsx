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
import { Box, Center, Container, HStack, Image, VStack, Text, ScrollView, Button, Pressable, Heading, Spinner, useColorModeValue, AlertDialog, Input, FormControl, useToast } from 'native-base';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import { SwipeListView } from 'react-native-swipe-list-view';
import { EditData, GetData } from '../actions/SettingAction';
import { backgroundColor, fontWeight } from 'styled-system';
import { preventAutoHide } from 'expo-splash-screen';
import { FA5Style } from '@expo/vector-icons/build/FontAwesome5';

const SCREEN_WIDTH = Dimensions.get('window').width;

const AdminSettings = () => {
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
    <ScrollView flex={1} backgroundColor="white">
      <Image style={{position: 'absolute', bottom: 0, opacity: 0.30}} w="100%" h={250} resizeMode="contain" source={require('../assets/images/car-bg.png')} alt="car background"/>
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
                <Text>{user.firstname || '-'} dsadsadsad dsadsadsadsa dsadsadsa</Text>
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
  );
}

const CustomerSettings = () => {
  const navigation = useNavigation();
  const Profile = useSelector(state => state.Profile);
  const [updating, setUpdating] = useState(false)
  const [tmpProfile, setTmpProfile] = useState({})
  const [errors, setErrors] = useState({})
  const dispatch = useDispatch();
  const toast = useToast()

  useEffect(() => {

    navigation.setOptions({
      showHeader: true,
      headerLeft: (props: StackHeaderLeftButtonProps) => (<MenuIcon/>)
    });
    
    fetchData()

  }, [])

  const fetchData = async event => {

    dispatch(GetData())
    .then((data) => {

      setTmpProfile(data);

    }).catch((error) => {

    })

  }

  const handleSubmit = () => {

    setUpdating(true)

    dispatch(EditData(tmpProfile))
    .then((data) => {

      setErrors({});
      
      toast.show({
        title: "Successful!",
        status: "success",
        description: "Account changes has been changed.",
        placement: 'top'
      })

      setUpdating(false)
      
    })
    .catch((errors) => {

      setErrors(errors);

      toast.show({
        title: "Something went wrong",
        status: "error",
        placement: 'top'
      })

      setUpdating(false)
      
    })

  }

  return (
    <Box flex={1} backgroundColor="white">
      <Image style={{position: 'absolute', bottom: 0, opacity: 0.30}} w="100%" h={250} resizeMode="contain" source={require('../assets/images/car-bg.png')} alt="car background"/>
      <ScrollView p={5} w="100%" h="100%" paddingBottom={5} backgroundColor="transparent">
        <Box backgroundColor="white" shadow={5} p={5} paddingBottom={10} w="100%" borderRadius={20}>
          <VStack space={5}>
            <Box>
              <VStack space={2}>
                <Text style={{fontSize: 25, fontWeight: 'bold', borderBottomWidth: 2, borderColor: 'rgba(217, 217, 217, 0.5)', paddingBottom: 10, marginBottom: 10}}>Personal Information</Text>
                <FormControl isInvalid={errors.firstname}>
                  <FormControl.Label>First name</FormControl.Label>
                  <Input type="text" _focus={{borderColor: 'rgb(240, 195, 0)'}} value={tmpProfile.firstname} onChangeText={input => setTmpProfile(prev => ({...prev, firstname: input}))} />
                  <FormControl.ErrorMessage>{errors.firstname}</FormControl.ErrorMessage>
                </FormControl>
                <FormControl>
                  <FormControl.Label>Middle name</FormControl.Label>
                  <Input type="text" _focus={{borderColor: 'rgb(240, 195, 0)'}} value={tmpProfile.middlename} onChangeText={input => setTmpProfile(prev => ({...prev, middlename: input}))} />
                </FormControl>
                <FormControl isInvalid={errors.lastname}>
                  <FormControl.Label>Last name</FormControl.Label>
                  <Input type="text" _focus={{borderColor: 'rgb(240, 195, 0)'}} value={tmpProfile.lastname} onChangeText={input => setTmpProfile(prev => ({...prev, lastname: input}))} />
                  <FormControl.ErrorMessage>{errors.lastname}</FormControl.ErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.phone_number}>
                  <FormControl.Label>Phone #</FormControl.Label>
                  <Input type="text" _focus={{borderColor: 'rgb(240, 195, 0)'}} value={tmpProfile.phone_number} onChangeText={input => setTmpProfile(prev => ({...prev, phone_number: input}))} />
                  <FormControl.ErrorMessage>{errors.phone_number}</FormControl.ErrorMessage>
                </FormControl>
              </VStack>
            </Box>
            <Box>
              <VStack space={2}>
                <Text style={{fontSize: 25, fontWeight: 'bold', borderBottomWidth: 2, borderColor: 'rgba(217, 217, 217, 0.5)', paddingBottom: 10, marginBottom: 10}}>Security</Text>
                <FormControl isInvalid={errors.email}>
                  <FormControl.Label>Email</FormControl.Label>
                  <Input type="email" _focus={{borderColor: 'rgb(240, 195, 0)'}} value={tmpProfile.email} onChangeText={input => setTmpProfile(prev => ({...prev, email: input}))} />
                  <FormControl.ErrorMessage>{errors.email}</FormControl.ErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.password}>
                  <FormControl.Label>Password</FormControl.Label>
                  <Input type="password" _focus={{borderColor: 'rgb(240, 195, 0)'}} placeholder="********" onChangeText={input => setTmpProfile(prev => ({...prev, password: input}))} />
                  <FormControl.ErrorMessage>{errors.password}</FormControl.ErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.new_password}>
                  <FormControl.Label>New password</FormControl.Label>
                  <Input type="password" _focus={{borderColor: 'rgb(240, 195, 0)'}} placeholder="********" onChangeText={input => setTmpProfile(prev => ({...prev, new_password: input}))} />
                  <FormControl.ErrorMessage>{errors.new_password}</FormControl.ErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.new_password}>
                  <FormControl.Label>Confirm password</FormControl.Label>
                  <Input type="text" _focus={{borderColor: 'rgb(240, 195, 0)'}} placeholder="********" onChangeText={input => setTmpProfile(prev => ({...prev, new_password_confirmation: input}))} />
                </FormControl>
              </VStack>
            </Box>
            <Button colorScheme="yellow" onPress={handleSubmit} isLoading={updating}>Update</Button>
          </VStack>
        </Box>
      </ScrollView>
    </Box>
  )
}

export default (props) => {
  const auth = useSelector(state => state.Auth);
  

  // if(auth.user.type === 1 || auth.user.type === 2) {

  //     return AdminSettings(props)

  // } else {

      return CustomerSettings(props)

  // }
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
