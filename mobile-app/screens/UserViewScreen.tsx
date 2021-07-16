import * as React from 'react';
import { Input } from 'react-native-elements';
import {useDispatch} from "react-redux";
import { useEffect, useState } from 'react';
import _ from 'lodash';
import {EditData} from "../actions/UserAction";
import { Dimensions, StyleSheet, View } from 'react-native';
import SelectBox from 'react-native-multi-selectbox'
import axios from 'axios'
import moment from "moment-timezone";
import { config } from '../constants/API';
import { Box, Button, Center, Divider, HStack, Image, ScrollView, Text, VStack } from 'native-base';

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

export default function UserViewScreen({navigation, route}) {
  const dispatch = useDispatch();
  const [dimensions, setDimensions] = useState({ window, screen });
  const [user, setUser] = React.useState(route.params.data);
  const [customerIDError, setCustomerIDError] = useState('');
  const [firstnameError, setFirstnameError] = useState('');
  const [middlenameError, setMiddlenameError] = useState('');
  const [lastnameError, setLastnameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [packageError, setPackageError] = useState('');
  const [saving, setSaving] = useState(false);
  const [userType, setUserType] = useState({})
  const [selectedPackage, setSelectedPackage] = useState({})
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

  const onDimensionChange = ({ window, screen }) => {
    setDimensions({ window, screen });
  };

  const timezoneConvert = (time) => {
    var userTz = moment.tz.guess(true);
    time = moment.tz(time, config.url.TIMEZONE);

    return time.tz(userTz);
  }  

  return (
    <Center flex={1} backgroundColor="white">
      <Image style={{position: 'absolute', bottom: 0, opacity: 0.30}} w="100%" h={250} resizeMode="contain" source={require('../assets/images/car-bg.png')} alt="car background"/>
      <ScrollView w="100%" padding={5}>
        <VStack space={3} marginBottom={10}>
          <Text style={{fontWeight: 'bold', fontSize: 18, textTransform: 'uppercase'}}>Personal Information</Text>
          <Divider />
          <HStack w="100%">
            <Text style={{fontSize: 16, width: '40%', fontWeight: 'bold'}}>First name:</Text>
            <Text style={{fontSize: 16, width: '60%'}}>{user.firstname}</Text>
          </HStack>
          <HStack w="100%">
            <Text style={{fontSize: 16, width: '40%', fontWeight: 'bold'}}>Middle name:</Text>
            <Text style={{fontSize: 16, width: '60%'}}>{user.middlename || '-'}</Text>
          </HStack>
          <HStack w="100%">
            <Text style={{fontSize: 16, width: '40%', fontWeight: 'bold'}}>Last name:</Text>
            <Text style={{fontSize: 16, width: '60%'}}>{user.lastname}</Text>
          </HStack>
          <HStack w="100%">
            <Text style={{fontSize: 16, width: '40%', fontWeight: 'bold'}}>Type:</Text>
            <Text style={{fontSize: 16, width: '60%'}}>{user.type.name}</Text>
          </HStack>
          <HStack w="100%">
            <Text style={{fontSize: 16, width: '40%', fontWeight: 'bold'}}>Points:</Text>
            <Text style={{fontSize: 16, width: '60%'}}>{parseFloat(user.points)} PTS</Text>
          </HStack>
          <HStack w="100%">
            <Text style={{fontSize: 16, width: '40%', fontWeight: 'bold'}}>Email:</Text>
            <Text style={{fontSize: 16, width: '60%'}}>{user.email}</Text>
          </HStack>
          <HStack w="100%">
            <Text style={{fontSize: 16, width: '40%', fontWeight: 'bold'}}>Phone:</Text>
            <Text style={{fontSize: 16, width: '60%'}}>{user.phone_number}</Text>
          </HStack>
          <HStack w="100%">
            <Text style={{fontSize: 16, width: '40%', fontWeight: 'bold'}}>Created:</Text>
            <Text style={{fontSize: 16, width: '60%'}}>{timezoneConvert(user.created_at).format('YYYY-MM-DD hh:mm:ss A') || '-'}</Text>
          </HStack>
          <HStack w="100%">
            <Text style={{fontSize: 16, width: '40%', fontWeight: 'bold'}}>Updated:</Text>
            <Text style={{fontSize: 16, width: '60%'}}>{timezoneConvert(user.updated_at).format('YYYY-MM-DD hh:mm:ss A') || '-'}</Text>
          </HStack>
          <Text style={{marginTop: 20, fontWeight: 'bold', fontSize: 18, textTransform: 'uppercase'}}>Package Information</Text>
          <Divider />
          <HStack w="100%">
            <Text style={{fontSize: 16, width: '40%', fontWeight: 'bold'}}>Package:</Text>
            <Text style={{fontSize: 16, width: '60%'}}>{user.info.package.name}</Text>
          </HStack>
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