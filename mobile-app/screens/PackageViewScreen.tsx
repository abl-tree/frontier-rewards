import * as React from 'react';
import { Input } from 'react-native-elements';
import {useDispatch} from "react-redux";
import { useEffect, useState } from 'react';
import _ from 'lodash';
import {EditData} from "../actions/PackageAction";
import { StyleSheet, View } from 'react-native';
import SelectBox from 'react-native-multi-selectbox'
import { xorBy } from 'lodash'
import axios from 'axios'
import moment from "moment-timezone";
import { config } from '../constants/API';
import { Box, Button, Center, Divider, HStack, Image, ScrollView, Text, VStack } from 'native-base';

export default function PackageEditScreen({navigation, route}) {
  const dispatch = useDispatch();
  const [packageData, setPackage] = React.useState(route.params.data);
  const [nameError, setNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [multiplierError, setMultiplierError] = useState('');
  const [selectedRewards, setSelectedRewards] = useState(route.params.data.rewards.map((val, i) => {
    return {
      id: val.reward.id,
      item: val.reward.name
    }
  }))
  const [rewardOptions, setRewardOptions] = useState([])
  const [saving, setSaving] = useState(false);

  useEffect(() => {

    navigation.setOptions({
      showHeader: true
    });

  }, []);

  const fetchRewards = async () => {

      const res = await axios.get('/rewards')

      var results = res.data.data

      var options = [];

      for (let a = 0; a < results.data.length; a++) {
          const result = results.data[a]
          
          options = [...options, {id: result.id, item: result.name}]
      }

      setRewardOptions(options)
      
      return options
  }
  
  const rewards = () => {
    return packageData.rewards.map((data, index) => {      
      return (
        <Text style={{fontSize: 18}}>{index + 1}. {data.reward.name}</Text>
      )
    })
  }

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
          <HStack w="100%">
            <Text style={{fontSize: 18, width: '40%'}}>Name</Text>
            <Text style={{fontWeight: 'bold', fontSize: 18, width: '60%'}}>{packageData.name}</Text>
          </HStack>
          <HStack w="100%">
            <Text style={{fontSize: 18, width: '40%'}}>Description</Text>
            <Text style={{fontSize: 18, width: '60%'}}>{packageData.description}</Text>
          </HStack>
          <HStack w="100%">
            <Text style={{fontSize: 18, width: '40%'}}>Multiplier</Text>
            <Text style={{fontSize: 18, width: '60%'}}>{packageData.multiplier}</Text>
          </HStack>
          <HStack w="100%">
            <Text style={{fontSize: 18, width: '40%'}}>Created</Text>
            <Text style={{fontSize: 18, width: '60%'}}>{timezoneConvert(packageData.created_at).format('YYYY-MM-DD hh:mm:ss A') || '-'}</Text>
          </HStack>
          <HStack w="100%">
            <Text style={{fontSize: 18, width: '40%'}}>Updated</Text>
            <Text style={{fontSize: 18, width: '60%'}}>{timezoneConvert(packageData.updated_at).format('YYYY-MM-DD hh:mm:ss A') || '-'}</Text>
          </HStack>
          <Divider my={2} />
          <Text style={{fontWeight: 'bold', fontSize: 18}}>Rewards ({packageData.rewards.length}):</Text>
          {rewards()}
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
  input: {
    height: 40
  }
});