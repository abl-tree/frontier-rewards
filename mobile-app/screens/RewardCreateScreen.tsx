import * as React from 'react';
import { Button, Input, Text } from 'react-native-elements';
import {useDispatch} from "react-redux";
import { useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import {AddData} from "../actions/RewardAction";
import { Dimensions, Picker, StyleSheet, View } from 'react-native';
import SelectBox from 'react-native-multi-selectbox'

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

export default function RewardCreateScreen({navigation, route}) {
  const dispatch = useDispatch();
  const [dimensions, setDimensions] = useState({ window, screen });
  const [reward, setReward] = React.useState({type: 'item'});
  const [valueError, setValueError] = useState('');
  const [costError, setCostError] = useState('');
  const [nameError, setNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [saving, setSaving] = useState(false);
  const [rewardType, setRewardType] = useState({"id": "item","item": "Item"})

  useEffect(() => {

    navigation.setOptions({
      showHeader: true
    });

    Dimensions.addEventListener("change", onDimensionChange);
    return () => {
      Dimensions.removeEventListener("change", onDimensionChange);
    };

  });

  const onDimensionChange = ({ window, screen }) => {
    setDimensions({ window, screen });
  };

  const handleEditSave = () => {

    setNameError('')
    setDescriptionError('')
    setValueError('')
    setCostError('')
    setSaving(true)
    
    dispatch(AddData(reward))
    .then(() => {

      setSaving(false)

      navigation.goBack()
      
    }).catch((error) => {

      setSaving(false)

      if(error.response.data && error.response.data.data && error.response.data.data.value) {
        setValueError(error.response.data.data.value[0])
      }

      if(error.response.data && error.response.data.data && error.response.data.data.cost) {
        setCostError(error.response.data.data.cost[0])
      }

      if(error.response.data && error.response.data.data && error.response.data.data.description) {
        setDescriptionError(error.response.data.data.description[0])
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

  const onTypeChange = (val) => {
    setRewardType(val)

    setReward(prev => ({...prev, type: val.id}))
  }

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <SelectBox
          label="Select type"
          options={[
            {
                'item': 'Item',
                'id': 'item'
            }, 
            {
                'item': 'Discount',
                'id': 'discount'
            },
            {
                'item': 'Points',
                'id': 'points'
            }
        ]}
          value={rewardType}
          onChange={onTypeChange}
          hideInputFilter={true}
          optionsLabelStyle={{width: dimensions.screen.width}}
        />
      </View>
      {rewardType.id == 'item' ? <Input
        label='Cost'
        value={reward.cost}
        onChangeText={(value) => setReward(prev => ({...prev, cost: value}))}
        placeholder='Enter reward cost'
        errorStyle={{ color: 'red' }}
        errorMessage={costError}
        keyboardType="numeric"
      /> :
      <Input
        label='Value'
        value={reward.value}
        onChangeText={(value) => setReward(prev => ({...prev, value: value}))}
        placeholder='Enter reward value'
        errorStyle={{ color: 'red' }}
        errorMessage={valueError}
        keyboardType="numeric"
      />}
      <Input
        label='Name'
        value={reward.name}
        onChangeText={(value) => setReward(prev => ({...prev, name: value}))}
        placeholder='Enter reward name'
        errorStyle={{ color: 'red' }}
        errorMessage={nameError}
      />
      <Input
        label='Description'
        value={reward.description}
        onChangeText={(value) => setReward(prev => ({...prev, description: value}))}
        placeholder='Enter reward description'
        errorStyle={{ color: 'red' }}
        errorMessage={descriptionError}
      />
      <View style={styles.section}>
        <View style={{width: '50%'}}>
          <Button
            title="Cancel"
            buttonStyle={{backgroundColor: '#bdbdbd'}}
            onPress={handleCancel}
          />
        </View>
        <View style={{width: '50%'}}>
          <Button
            title="Save"
            onPress={handleEditSave}
            loading={saving}
          />
        </View>
      </View>
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
    paddingRight: 10
  },
  input: {
    height: 40
  }
});