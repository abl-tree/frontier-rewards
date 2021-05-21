import * as React from 'react';
import { Button, Input, ListItem, Text } from 'react-native-elements';
import {useDispatch} from "react-redux";
import { useEffect, useState } from 'react';
import _ from 'lodash';
import {EditData} from "../actions/UserAction";
import { Alert, Dimensions, StyleSheet, View } from 'react-native';
import SelectBox from 'react-native-multi-selectbox'
import axios from 'axios'
import moment from 'moment'

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

export default function TransactionEditScreen({navigation, route}) {
  const dispatch = useDispatch();
  const [dimensions, setDimensions] = useState({ window, screen });
  const [transaction, setTransaction] = React.useState({});
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

    let transactionData = route.params.data;    

    setTransaction(transactionData);

    setUserType({
      id: transactionData.status,
      item: Capitalize(transactionData.status)
    })

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

  const Capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

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
    
    dispatch(EditData(transaction))
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

  const onStatusChange = (val) => {
    console.log(val);
    

    Alert.alert(
      "Are you sure?",
      "You want to mark this as "+val.item+"?",
      [
        {
          text: "Cancel",
          // onPress: () => ,
          style: "cancel"
        },
        { text: "OK", onPress: async () => {

          await axios.put('transactions/' + transaction.id, {
            id: transaction.id,
            status: val.id
          })
          .then((res) => {
      
              dispatch({
                  type: "TRANSACTION_UPDATE",
                  payload: res.data.data
              })
  
              setUserType(val)
          })
          .catch((error) => {
              if(error.response) {
                  dispatch({
                      type: "TRANSACTION_FAIL",
                      payload: error.response.data.message
                  })
              }
          })

        } }
      ],
      {
        cancelable: false
      }
    );

    // setTransaction(prev => ({user_type_id: val.id}))
  }

  const onPackageChange = (val) => {
    setSelectedPackage(val)

    setTransaction(prev => ({...prev, package_id: {value: val.id, label: val.item}}))
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

      return options
      
  }

  const promisePackagesOptions = inputValue => new Promise(resolve => {
      setTimeout(() => {
          resolve(fetchPackages(inputValue));
      }, 1000);
  });

  const renderRewards = () => {    

    if(!_.isEmpty(transaction.item) && !_.isEmpty(transaction.item.rewards)) {

        return (
          <>
            <View style={styles.section}>
              <Text style={styles.label}>Rewards: </Text>
            </View>
            {transaction.item.rewards.map((item, i) => {
              return <ListItem key={i} bottomDivider style={{width: '100%', paddingLeft: 10, paddingRight: 10}}>
                    {/* <Avatar source={{uri: l.avatar_url}} /> */}
                    <ListItem.Content>
                      <ListItem.Title>{item.reward_name}</ListItem.Title>
                    </ListItem.Content>
                  </ListItem>
            })}
          </>
        )

    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <SelectBox
          label="Select type"
          options={[
            {
                'item': 'Pending',
                'id': 'pending'
            }, 
            {
                'item': 'Cancelled',
                'id': 'cancelled'
            }, 
            {
                'item': 'Confirmed',
                'id': 'confirmed'
            }, 
            {
                'item': 'Completed',
                'id': 'completed'
            }
        ]}
          value={userType}
          onChange={onStatusChange}
          hideInputFilter={true}
          optionsLabelStyle={{width: dimensions.screen.width}}
        />
      </View>
      <Text style={styles.text}><Text style={styles.label}>Transaction ID:</Text> {transaction.transaction_id}</Text>
      <Text style={styles.text}><Text style={styles.label}>Date:</Text> {moment(transaction.created_at).format('YYYY-MM-DD hh:mm a')}</Text>
      <Text style={styles.text}><Text style={styles.label}>Customer:</Text> {transaction.customer ? transaction.customer.name : ''}</Text>
      <Text style={styles.text}><Text style={styles.label}>Type:</Text> {transaction.type}</Text>

      {renderRewards()}
    </View >
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
    paddingRight: 10,
    width: '100%'
  },
  input: {
    height: 40
  },
  label: {
    fontWeight: 'bold'
  },
  text: {
    fontSize: 16,
    paddingBottom: 5,
    paddingTop: 5,
    paddingLeft: 10,
    paddingRight: 10
  }
});