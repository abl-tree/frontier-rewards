import * as React from 'react';
import { Input, Text } from 'react-native-elements';
import {useDispatch} from "react-redux";
import { useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import {AddData} from "../actions/UserAction";
import { Dimensions, Picker, StyleSheet, View } from 'react-native';
import SelectBox from 'react-native-multi-selectbox'
import axios from 'axios'
import { Button, Center, Image, ScrollView, VStack } from 'native-base';

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

export default function UserCreateScreen({navigation, route}) {
  const dispatch = useDispatch();
  const [dimensions, setDimensions] = useState({ window, screen });
  const [user, setUser] = React.useState({user_type_id: 3});
  const [customerIDError, setCustomerIDError] = useState('');
  const [firstnameError, setFirstnameError] = useState('');
  const [middlenameError, setMiddlenameError] = useState('');
  const [lastnameError, setLastnameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [packageError, setPackageError] = useState('');
  const [saving, setSaving] = useState(false);
  const [userType, setUserType] = useState({"id": 3,"item": "Customer"})
  const [selectedPackage, setSelectedPackage] = useState([])
  const [packageOptions, setPackageOptions] = useState([])

  useEffect(() => {

    navigation.setOptions({
      showHeader: true
    });

    Dimensions.addEventListener("change", onDimensionChange);
    return () => {
      Dimensions.removeEventListener("change", onDimensionChange);
    };

  }, []);

  React.useLayoutEffect(() => {

    promisePackagesOptions('')

  }, [navigation])

  const onDimensionChange = ({ window, screen }) => {
    setDimensions({ window, screen });
  };

  const handleEditSave = () => {        

    setCustomerIDError('')
    setFirstnameError('')
    setLastnameError('')
    setMiddlenameError('')
    setEmailError('')
    setPhoneNumberError('')
    setPackageError('')
    setSaving(true)
    
    dispatch(AddData(user))
    .then(() => {

      setSaving(false)

      navigation.goBack()
      
    }).catch((error) => {

      setSaving(false)

      if(error.response.data && error.response.data.data && error.response.data.data.customer_id) {
        setCustomerIDError(error.response.data.data.customer_id[0])
      }

      if(error.response.data && error.response.data.data && error.response.data.data.firstname) {
        setFirstnameError(error.response.data.data.firstname[0])
      }

      if(error.response.data && error.response.data.data && error.response.data.data.middlename) {
        setMiddlenameError(error.response.data.data.middlename[0])
      }

      if(error.response.data && error.response.data.data && error.response.data.data.lastname) {
        setLastnameError(error.response.data.data.lastname[0])
      }

      if(error.response.data && error.response.data.data && error.response.data.data.email) {
        setEmailError(error.response.data.data.email[0])
      }

      if(error.response.data && error.response.data.data && error.response.data.data.phone_number) {
        setPhoneNumberError(error.response.data.data.phone_number[0])
      }

      if(error.response.data && error.response.data.data && error.response.data.data['package_id.value']) {
        setPackageError(error.response.data.data['package_id.value'][0])
      }

    })
    
  }

  const handleCancel = () => {

    setSaving(false)

    navigation.goBack()
    
  }

  const onTypeChange = (val) => {
    setUserType(val)

    setUser(prev => ({user_type_id: val.id}))
  }

  const onPackageChange = (val) => {
    setSelectedPackage(val)

    setUser(prev => ({...prev, package_id: {value: val.id, label: val.item}}))
  }

  const fetchPackages = async (search) => {

      const res = await axios.get('/packages?search=' + search)

      var results = res.data.data

      var options = [];

      for (let a = 0; a < results.data.length; a++) {
          const result = results.data[a]
          
          options = [...options, {id: result.id, item: result.name}]
      }

      setPackageOptions(options)

      console.log(options);
      

      return options
      
  }

  const promisePackagesOptions = inputValue => new Promise(resolve => {
      setTimeout(() => {
          resolve(fetchPackages(inputValue));
      }, 1000);
  });

  return (
    <Center flex={1} backgroundColor="white">
      <Image style={{position: 'absolute', bottom: 0, opacity: 0.30}} w="100%" h={250} resizeMode="contain" source={require('../assets/images/car-bg.png')} alt="car background"/>
      <ScrollView flex={1} w="100%" padding={2}>
        <VStack space={1} marginBottom={10}>
          <View style={styles.section}>
            <SelectBox
              label="Select type"
              options={[
                {
                    'item': 'Customer',
                    'id': '3'
                }, 
                {
                    'item': 'Admin',
                    'id': '2'
                }
            ]}
              value={userType}
              onChange={onTypeChange}
              hideInputFilter={true}
              optionsLabelStyle={{width: dimensions.screen.width}}
            />
          </View>
          {userType.id == 3 ? 
            <>
              <Input
                label='Customer ID'
                value={user.customer_id}
                onChangeText={(value) => setUser(prev => ({...prev, customer_id: value}))}
                placeholder='Enter customer ID'
                errorStyle={{ color: 'red' }}
                errorMessage={customerIDError}
              />
              <Input
                label='First name'
                value={user.firstname}
                onChangeText={(value) => setUser(prev => ({...prev, firstname: value}))}
                placeholder='Enter first name'
                errorStyle={{ color: 'red' }}
                errorMessage={firstnameError}
              />
              <Input
                label='Middle name'
                value={user.middlename}
                onChangeText={(value) => setUser(prev => ({...prev, middlename: value}))}
                placeholder='Enter middle name'
                errorStyle={{ color: 'red' }}
                errorMessage={middlenameError}
              />
              <Input
                label='Last name'
                value={user.lastname}
                onChangeText={(value) => setUser(prev => ({...prev, lastname: value}))}
                placeholder='Enter last name'
                errorStyle={{ color: 'red' }}
                errorMessage={lastnameError}
              />
              <Input
                label='Email'
                value={user.email}
                onChangeText={(value) => setUser(prev => ({...prev, email: value}))}
                placeholder='Enter email address'
                errorStyle={{ color: 'red' }}
                errorMessage={emailError}
              />
              <Input
                label='Phone number'
                value={user.phone_number}
                onChangeText={(value) => setUser(prev => ({...prev, phone_number: value}))}
                placeholder='Enter phone number'
                errorStyle={{ color: 'red' }}
                errorMessage={phoneNumberError}
              />
              <View style={styles.section}>
                <SelectBox
                  label="Select type"
                  options={packageOptions}
                  value={selectedPackage}
                  onChange={onPackageChange}
                  hideInputFilter={true}
                  optionsLabelStyle={{width: dimensions.screen.width}}
                />
              </View>
              <View style={styles.section}>
              <Text style={{color: 'red', fontSize: 12}}>{packageError}</Text>
              </View>
            </>
          :
            <>
              <Input
                label='First name'
                value={user.firstname}
                onChangeText={(value) => setUser(prev => ({...prev, firstname: value}))}
                placeholder='Enter first name'
                errorStyle={{ color: 'red' }}
                errorMessage={firstnameError}
              />
              <Input
                label='Middle name'
                value={user.middlename}
                onChangeText={(value) => setUser(prev => ({...prev, middlename: value}))}
                placeholder='Enter middle name'
                errorStyle={{ color: 'red' }}
                errorMessage={middlenameError}
              />
              <Input
                label='Last name'
                value={user.lastname}
                onChangeText={(value) => setUser(prev => ({...prev, lastname: value}))}
                placeholder='Enter last name'
                errorStyle={{ color: 'red' }}
                errorMessage={lastnameError}
              />
              <Input
                label='Email'
                value={user.email}
                onChangeText={(value) => setUser(prev => ({...prev, email: value}))}
                placeholder='Enter email address'
                errorStyle={{ color: 'red' }}
                errorMessage={emailError}
              />
            </>
          }
          
          <Button.Group
            variant="solid"
            isAttached
            mx={{
              base: "auto",
              md: 0,
            }}
          >
            <Button isLoading={saving} isLoadingText="Saving" w="45%" colorScheme="teal" mr="2%" 
            onPress={handleEditSave}>
              Save
            </Button>
            <Button
              w="45%"
              colorScheme="danger"
              _text={{
                color: "white",
              }}
              onPress={handleCancel}
            >
              Cancel
            </Button>
          </Button.Group>
        </VStack>
      </ScrollView>
    </Center>
  )
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f4f4',
    flex: 1,
  },
  section: {
    flexDirection:'row', 
    justifyContent: 'space-between', 
    paddingLeft: 10, 
    paddingRight: 10
  },
  input: {
    height: 40
  }
});