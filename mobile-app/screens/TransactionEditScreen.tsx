import * as React from 'react';
import { Button, Input, ListItem, Text } from 'react-native-elements';
import {useDispatch} from "react-redux";
import { useEffect, useState } from 'react';
import _ from 'lodash';
import { Alert, Dimensions, StyleSheet, View } from 'react-native';
import SelectBox from 'react-native-multi-selectbox'
import axios from 'axios'
import moment from 'moment'
import Dialog from "react-native-dialog";
import { Box, HStack, Image, ScrollView, VStack } from 'native-base';

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

export default function TransactionEditScreen({navigation, route}) {
  const dispatch = useDispatch();
  const [dimensions, setDimensions] = useState({ window, screen });
  const [transaction, setTransaction] = React.useState({});
  const [referenceError, setReferenceError] = useState('');
  const [userType, setUserType] = useState({})
  const [visible, setVisible] = useState(false);
  const [dialog, setDialog] = useState({});

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

  const Capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const onDimensionChange = ({ window, screen }) => {
    setDimensions({ window, screen });
  };

  const onStatusChange = (val) => {

    setDialog(prev=> ({status: val.id, type: val.item, id: transaction.id}))
    
    showDialog();

  }

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

  const showDialog = () => {
    setReferenceError('')

    setVisible(true);
  };

  const handleCancelDialog = () => {
    setVisible(false);

    setDialog({})
  };

  const handleContinueDialog = async () => {

    await axios.put('transactions/' + transaction.id, dialog)
    .then((res) => {

        dispatch({
            type: "TRANSACTION_UPDATE",
            payload: res.data.data
        })

        setUserType({id: dialog.status, item: dialog.type})
        
        setVisible(false);

        setDialog({})

    })
    .catch((error) => {      

      if(error.response.data && error.response.data.data && error.response.data.data.reference_no) {

        console.log(error.response.data.data.reference_no);
        setReferenceError(error.response.data.data.reference_no[0])
      }

    })
    
  };

  return (
    <Box flex={1} backgroundColor="white">
      <Image style={{position: 'absolute', bottom: 0, opacity: 0.30}} w="100%" h={250} resizeMode="contain" source={require('../assets/images/car-bg.png')} alt="car background"/>
      <ScrollView p={5} w="100%" h="100%" paddingBottom={5} backgroundColor="transparent">
        <VStack marginBottom={10} space={3}>
          <Dialog.Container visible={visible}>
            <Dialog.Title style={{color: 'black'}}>Are you sure?</Dialog.Title>
            <Dialog.Description>
                You want to mark this as {dialog.type}?
            </Dialog.Description>
            {
              dialog.status == 'confirmed' &&
              <>
              <Dialog.Input 
                style={{color: 'black'}}
                placeholder='Enter reference number'
                onChangeText={(value) => setDialog(prev => ({...prev, reference_no: value}))}
              /> 
              <Text style={{marginTop: -20, marginLeft: 10, marginRight: 10, color: 'red'}}>{referenceError}</Text>
              </>
            }
            <Dialog.Button label="Cancel" onPress={handleCancelDialog} />
            <Dialog.Button label="Continue" onPress={handleContinueDialog} />
          </Dialog.Container>
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
          <HStack w="100%">
            <Text style={{fontWeight: 'bold', fontSize: 16, width: '40%'}}>Transaction ID:</Text>
            <Text style={{fontSize: 16, width: '60%'}}>{transaction.transaction_id}</Text>
          </HStack>
          <HStack w="100%">
            <Text style={{fontWeight: 'bold', fontSize: 16, width: '40%'}}>Date:</Text>
            <Text style={{fontSize: 16, width: '60%'}}>{moment(transaction.created_at).format('YYYY-MM-DD hh:mm a')}</Text>
          </HStack>
          <HStack w="100%">
            <Text style={{fontWeight: 'bold', fontSize: 16, width: '40%'}}>Customer:</Text>
            <Text style={{fontSize: 16, width: '60%'}}>{transaction.customer ? transaction.customer.name : '-'}</Text>
          </HStack>
          <HStack w="100%">
            <Text style={{fontWeight: 'bold', fontSize: 16, width: '40%'}}>Type:</Text>
            <Text style={{fontSize: 16, width: '60%'}}>{transaction.type}</Text>
          </HStack>

          {renderRewards()}
        </VStack>
      </ScrollView>
    </Box>
  )

  return (
    <View style={styles.container}>
      <Dialog.Container visible={visible}>
        <Dialog.Title style={{color: 'black'}}>Are you sure?</Dialog.Title>
        <Dialog.Description>
            You want to mark this as {dialog.type}?
        </Dialog.Description>
        {
          dialog.status == 'confirmed' ?
          <>
          <Dialog.Input 
            style={{color: 'black'}}
            placeholder='Enter reference number'
            onChangeText={(value) => setDialog(prev => ({...prev, reference_no: value}))}
          /> 
          <Text style={{marginTop: -20, marginLeft: 10, marginRight: 10, color: 'red'}}>{referenceError}</Text>
          </>
          : null
        }
        <Dialog.Button label="Cancel" onPress={handleCancelDialog} />
        <Dialog.Button label="Continue" onPress={handleContinueDialog} />
      </Dialog.Container>
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