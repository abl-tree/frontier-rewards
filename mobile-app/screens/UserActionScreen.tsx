import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button, Dimensions, StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import axios from 'axios';
import _ from 'lodash';
import SelectBox from 'react-native-multi-selectbox'
import { xorBy } from 'lodash'
import { Box, Image, ScrollView, VStack } from 'native-base';

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

export default function UserActionScreen({navigation, route}) {

  const [dimensions, setDimensions] = useState({ window, screen });
  const [user, setUser] = useState({})
  const [campaigns, setCampaigns] = useState([])
  const [actions, setActions] = useState([])
  const [rewards, setRewards] = useState([])
  const [data, setData] = useState({});
  const [selectedCampaign, setSelectedCampaign] = useState({})
  const [selectedAction, setSelectedAction] = useState({})
  const [selectedReward, setSelectedReward] = useState([])

  React.useLayoutEffect(() => {

    promiseCampaignOptions('')

    fetchUser()

  }, [navigation])

  useEffect(() => {

    Dimensions.addEventListener("change", onDimensionChange);
    return () => {
      Dimensions.removeEventListener("change", onDimensionChange);
    };

  }, []);

  const onDimensionChange = ({ window, screen }) => {
    setDimensions({ window, screen });
  };
  
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
          
          options = [...options, {id: result.id, item: result.name}]
      }

      setCampaigns(options)

      return options
      
  }

  const promiseCampaignOptions = inputValue => new Promise(resolve => {
      setTimeout(() => {
          resolve(fetchCampaigns(inputValue));
      }, 1000);
  });

  const fetchActions = async (search, campaign_id) => {

      const res = await axios.get('/campaigns/'+campaign_id+'/actions?search=' + search)

      var results = res.data.data

      var options = [];

      for (let a = 0; a < results.data.length; a++) {
          const result = results.data[a].action
          
          options = [...options, {id: result.id, item: result.name}]
      }

      setActions(options)

      return options
  }
  
  const promiseActionOptions = (inputValue, id) => new Promise(resolve => {
      resolve(fetchActions(inputValue, id));
  });

  const fetchRewards = async (search, action_id) => {    

      const res = await axios.get('/campaigns/' + data.campaign_id + '/actions/' + action_id)

      var results = res.data.data

      var options = [];

      for (let a = 0; a < results.data.length; a++) {
          const result = results.data[a].reward
          
          options = [...options, {id: result.id, item: result.name}]
      }

      setRewards(options)

      return options
      
  }

  const promiseRewardOptions = (inputValue, id) => new Promise(resolve => {
      resolve(fetchRewards(inputValue, id));
  });

  const addAction = async () => {

    const res = await axios.post('transactions', data)

    navigation.goBack()
    
  }

  const onCampaignChange = (val) => {
    setSelectedCampaign(val)
    setSelectedAction({})
    setSelectedReward([])

    setData(prev => ({'type' : 'earn', 'user_id' : user.id, 'campaign_id' : val.id, 'campaign_name' : val.item}))

    promiseActionOptions('', val.id)
  }

  const onActionChange = (val) => {
    setSelectedAction(val)

    setData(prev => ({...prev, 'action_id' : val.id, 'action_name' : val.item}))

    promiseRewardOptions('', val.id)
  }

  function onRewardChange() {
    return (item) => {
      let selectedTmp = xorBy(selectedReward, [item], 'id');

      setData(prev => ({...prev, rewards: selectedTmp.map((val, i) => {
        return {
          label: val.item,
          value: val.id
        }
      })}));
      
      setSelectedReward(xorBy(selectedReward, [item], 'id'))
    }
  }

  const rewardOptions = () => {
    let tmpSelected = [];

    selectedReward.map((el, i) => {

      var index = rewards.findIndex((item) => item.id === el.id)

      if(index == -1) {
        tmpSelected = [...tmpSelected, el]
      }
      
    })    

    return [...rewards, ...tmpSelected];
  }

  return (
    <Box flex={1} backgroundColor="white">
      <Image style={{position: 'absolute', bottom: 0, opacity: 0.30}} w="100%" h={250} resizeMode="contain" source={require('../assets/images/car-bg.png')} alt="car background"/>
      <ScrollView p={5} w="100%" h="100%" paddingBottom={5} backgroundColor="transparent">
        <Box backgroundColor="white" shadow={5} p={5} paddingBottom={10} w="100%" borderRadius={20}>
          <VStack>
            <Text style={styles.title}>Name: {user.name}</Text>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
            <View style={styles.section}>
              <SelectBox
                label="Select campaign"
                options={campaigns}
                value={selectedCampaign}
                onChange={onCampaignChange}
                hideInputFilter={true}
                optionsLabelStyle={{width: dimensions.screen.width}}
              />
            </View>
            <View style={styles.section}>
              <SelectBox
                label="Select action"
                options={actions}
                value={selectedAction}
                onChange={onActionChange}
                hideInputFilter={true}
                optionsLabelStyle={{width: dimensions.screen.width}}
              />
            </View>
            <View style={styles.section}>
              <SelectBox
                label="Select rewards"
                options={rewardOptions()}
                selectedValues={selectedReward}
                onMultiSelect={onRewardChange()}
                onTapClose={onRewardChange()}
                isMulti
              />
            </View>
            {!_.isUndefined(data.campaign_id) && !_.isUndefined(data.action_id) && !_.isUndefined(data.rewards) ?
              <Button
                onPress={addAction}
                title="Submit"
                color="#841584"
                accessibilityLabel="Add Action"
              /> :  <Text></Text>
            }
          </VStack>
        </Box>
      </ScrollView>
    </Box>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Name: {user.name}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <View style={styles.section}>
        <SelectBox
          label="Select campaign"
          options={campaigns}
          value={selectedCampaign}
          onChange={onCampaignChange}
          hideInputFilter={true}
          optionsLabelStyle={{width: dimensions.screen.width}}
        />
      </View>
      <View style={styles.section}>
        <SelectBox
          label="Select action"
          options={actions}
          value={selectedAction}
          onChange={onActionChange}
          hideInputFilter={true}
          optionsLabelStyle={{width: dimensions.screen.width}}
        />
      </View>
      <View style={styles.section}>
        <SelectBox
          label="Select rewards"
          options={rewardOptions()}
          selectedValues={selectedReward}
          onMultiSelect={onRewardChange()}
          onTapClose={onRewardChange()}
          isMulti
        />
      </View>
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
    backgroundColor: 'white'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black'
  },
  section: {
    flexDirection:'row', 
    justifyContent: 'space-between', 
    paddingLeft: 10, 
    paddingRight: 10,
    backgroundColor: 'white'
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
