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
import { Box, Button, Center, Image, VStack } from 'native-base';

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

    setPackage(prev => ({...prev, rewards: selectedRewards.map((val, i) => {
      return {
        label: val.item,
        value: val.id
      }
    })}));

  }, []);  

  React.useLayoutEffect(() => {

    promiseRewardOptions('')

  }, [navigation])

  const handleEditSave = () => {    

    setNameError('')
    setDescriptionError('')
    setMultiplierError('')
    setSaving(true)
    
    dispatch(EditData(packageData))
    .then(() => {

      setSaving(false)

      navigation.goBack()

    }).catch((error) => {
      
      setSaving(false)

      if(error.response.data && error.response.data.data && error.response.data.data.description) {
        setDescriptionError(error.response.data.data.description[0])
      }

      if(error.response.data && error.response.data.data && error.response.data.data.multiplier) {
        setMultiplierError(error.response.data.data.multiplier[0])
      }

      if(error.response.data && error.response.data.data && error.response.data.data.name) {
        setNameError(error.response.data.data.name[0])
      }

    })
    
  }

  const handleCancel = () => {
      
    setSaving(false)

    navigation.goBack()

  }

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

  const promiseRewardOptions = inputValue => new Promise(resolve => {

      setTimeout(() => {
          resolve(fetchRewards(inputValue));
      }, 1000);

  });

  function onMultiChange() {
    return (item) => {
      let selectedTmp = xorBy(selectedRewards, [item], 'id');

      setPackage(prev => ({...prev, rewards: selectedTmp.map((val, i) => {
        return {
          label: val.item,
          value: val.id
        }
      })}));      
      
      setSelectedRewards(xorBy(selectedRewards, [item], 'id'))
    }
  }

  const multipleOptions = () => {
    let tmpSelected = [];

    selectedRewards.map((el, i) => {

      var index = rewardOptions.findIndex((item) => item.id === el.id)

      if(index == -1) {
        tmpSelected = [...tmpSelected, el]
      }
      
    })    

    return [...rewardOptions, ...tmpSelected];
  }

  return (
    <Center flex={1} backgroundColor="white">
      <Image style={{position: 'absolute', bottom: 0, opacity: 0.30}} w="100%" h={250} resizeMode="contain" source={require('../assets/images/car-bg.png')} alt="car background"/>
      <Box flex={1} w="100%" padding={2}>
        <VStack space={1}>
          <Input
            label='Name'
            value={packageData.name}
            onChangeText={(value) => setPackage(prev => ({...prev, name: value}))}
            placeholder='Enter package name'
            errorStyle={{ color: 'red' }}
            errorMessage={nameError}
          />
          <Input
            label='Description'
            value={packageData.description}
            onChangeText={(value) => setPackage(prev => ({...prev, description: value}))}
            placeholder='Enter package description'
            errorStyle={{ color: 'red' }}
            errorMessage={descriptionError}
          />
          <Input
            label='Multiplier'
            value={packageData.multiplier}
            onChangeText={(value) => setPackage(prev => ({...prev, multiplier: value}))}
            placeholder='Enter package multiplier'
            errorStyle={{ color: 'red' }}
            errorMessage={multiplierError}
          />
          <View style={{flexDirection:'row', justifyContent: 'space-between', paddingLeft: 10, paddingRight: 10, marginBottom: 10}}>
            <SelectBox
              label="Select multiple"
              options={multipleOptions()}
              selectedValues={selectedRewards}
              onMultiSelect={onMultiChange()}
              onTapClose={onMultiChange()}
              isMulti
            />
          </View>
          
          <Button.Group
            variant="solid"
            isAttached
            mx={{
              base: "auto",
              md: 0,
            }}
          >
            <Button
              mr="2%"
              w="45%"
              colorScheme="danger"
              _text={{
                color: "white",
              }}
              onPress={handleCancel}
            >
              Cancel
            </Button>
            <Button isLoading={saving} isLoadingText="Saving" w="45%" colorScheme="teal" 
            onPress={handleEditSave}>
              Save
            </Button>
          </Button.Group>
        </VStack>
      </Box>
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