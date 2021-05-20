import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button, StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import axios from 'axios';
import AsyncSelect from 'react-select/async';
import {Picker} from '@react-native-picker/picker';
import _ from 'lodash';
import MultiSelect from 'react-native-multiple-select';

export default function UserActionScreen({navigation, route}) {

  const [user, setUser] = useState({})
  const [campaigns, setCampaigns] = useState([])
  const [actions, setActions] = useState([])
  const [rewards, setRewards] = useState([])
  const [data, setData] = useState({});
  const [selectedItems, setSelectedItems] = useState([])
  const [items, setItems] = useState([{
      id: '92iijs7yta',
      name: 'Ondo'
    }, {
      id: 'a0s0a8ssbsd',
      name: 'Ogun'
    }, {
      id: '16hbajsabsd',
      name: 'Calabar'
    }, {
      id: 'nahs75a5sg',
      name: 'Lagos'
    }, {
      id: '667atsas',
      name: 'Maiduguri'
    }, {
      id: 'hsyasajs',
      name: 'Anambra'
    }, {
      id: 'djsjudksjd',
      name: 'Benue'
    }, {
      id: 'sdhyaysdj',
      name: 'Kaduna'
    }, {
      id: 'suudydjsjd',
      name: 'Abuja'
      }
  ]);

  React.useLayoutEffect(() => {

    promiseCampaignOptions('')

    fetchUser()

  }, [navigation])

  useEffect(() => {

    if(data && data.campaign_id) {
      promiseActionOptions('')
    }

  }, [data.campaign_id]);

  useEffect(() => {

    if(data && data.action_id) {
      promiseRewardOptions('')
    }

  }, [data.action_id]);
  
  const fetchUser = async () => {

    await axios.get('/users/' + route.params.qrCode + '/qr')
    .then(res => {

      setUser(res.data.data)

    })
    .catch(error => {
      console.error(error)
    })

  }

  const fetchCampaigns = async (search) => {

      const res = await axios.get('/campaigns?search=' + search)

      var results = res.data.data

      var options = [];

      for (let a = 0; a < results.data.length; a++) {
          const result = results.data[a]
          
          options = [...options, {value: result.id, label: result.name}]
      }

      setCampaigns(options)

      return options
      
  }

  const promiseCampaignOptions = inputValue => new Promise(resolve => {
      setTimeout(() => {
          resolve(fetchCampaigns(inputValue));
      }, 1000);
  });

  const fetchActions = async (search) => {    

      const res = await axios.get('/campaigns/'+data.campaign_id+'/actions?search=' + search)

      var results = res.data.data

      var options = [];

      for (let a = 0; a < results.data.length; a++) {
          const result = results.data[a].action
          
          options = [...options, {value: result.id, label: result.name}]
      }

      setActions(options)

      return options
  }
  
  const promiseActionOptions = inputValue => new Promise(resolve => {
      setTimeout(() => {
          resolve(fetchActions(inputValue));
      }, 1000);
  });

  const fetchRewards = async (search) => {

      const res = await axios.get('/campaigns/' + data.campaign_id + '/actions/' + data.action_id)

      var results = res.data.data

      var options = [];

      for (let a = 0; a < results.data.length; a++) {
          const result = results.data[a].reward
          
          options = [...options, {value: result.id, label: result.name}]
      }

      setRewards(options)

      return options
      
  }

  const promiseRewardOptions = inputValue => new Promise(resolve => {
      setTimeout(() => {
          resolve(fetchRewards(inputValue));
      }, 1000);
  });

  const addAction = async () => {
    const res = await axios.post('transactions', data)
    
    console.log(res);
    
  }

  const onSelectedItemsChange = selectedItems => {
    console.log(selectedItems);
    
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Name: {user.name}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Text style={styles.title}>Test</Text>
        {/* <MultiSelect
          hideTags
          items={items}
          uniqueKey="id"
          onSelectedItemsChange={onSelectedItemsChange}
          selectedItems={selectedItems}
          selectText="Pick Items"
          searchInputPlaceholderText="Search Items..."
          onChangeInput={ (text)=> console.log(text)}
          tagRemoveIconColor="#CCC"
          tagBorderColor="#CCC"
          tagTextColor="#CCC"
          selectedItemTextColor="#CCC"
          selectedItemIconColor="#CCC"
          itemTextColor="#000"
          displayKey="name"
          searchInputStyle={{ color: '#CCC' }}
          submitButtonColor="#CCC"
          submitButtonText="Submit"
        /> */}
      <Picker
        style={{color: 'white'}} 
        selectedValue={data.campaign_id}
        style={{ height: 50, width: 150 }}
        onValueChange={(itemValue, itemIndex) => setData(prev => ({'type' : 'earn', 'user_id' : 11, 'campaign_id' : Number.parseInt(itemValue), 'campaign_name' : campaigns[itemIndex-1].label}))}
      >
        <Picker.Item label='Please select a campaign...' value='0' />
        {campaigns.map((item, index) => {
            return (<Picker.Item label={item.label} value={item.value} key={index}/>) 
        })}
      </Picker>
      {!_.isUndefined(data.campaign_id) ? 
        <Picker
          style={{color: 'white'}} 
          selectedValue={data.action_id}
          style={{ height: 50, width: 150 }}
          onValueChange={(itemValue, itemIndex) => setData(prev => ({...prev, 'action_id' : Number.parseInt(itemValue), 'action_name' : actions[itemIndex-1].label}))}
        >
          <Picker.Item label='Please select an action...' value='0' />
          {actions.map((item, index) => {
              return (<Picker.Item label={item.label} value={item.value} key={index}/>) 
          })}
        </Picker>
      : <Text></Text>}
      {!_.isUndefined(data.action_id) ? 
        <Picker
          style={{color: 'white'}} 
          selectedValue={data.reward_id}
          style={{ height: 50, width: 150 }}
          onValueChange={(itemValue, itemIndex) => setData(prev => ({...prev, 'rewards' : [{'value': Number.parseInt(itemValue), 'label' : rewards[itemIndex-1].label}]}))}
        >
          <Picker.Item label='Please select an action...' value='0' />
          {rewards.map((item, index) => {
              return (<Picker.Item label={item.label} value={item.value} key={index}/>) 
          })}
        </Picker>
      : <Text></Text>}
      {!_.isUndefined(data.campaign_id) && !_.isUndefined(data.action_id) && !_.isUndefined(data.rewards) ?
        <Button
          onPress={addAction}
          title="Submit"
          color="#841584"
          accessibilityLabel="Add Action"
        /> :  <Text></Text>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black'
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  picker: {
    tintColor: 'white'
  }
});
