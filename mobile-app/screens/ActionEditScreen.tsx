import * as React from 'react';
import { Button, Input } from 'react-native-elements';
import {useDispatch} from "react-redux";
import { useEffect, useState } from 'react';
import _ from 'lodash';
import {EditData} from "../actions/ActionAction";
import { StyleSheet, View } from 'react-native';

export default function ActionEditScreen({navigation, route}) {
  const dispatch = useDispatch();
  const [action, setAction] = React.useState(route.params.data);
  const [nameError, setNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {

    navigation.setOptions({
      showHeader: true
    });

  });

  const handleEditSave = () => {

    setNameError('')
    setDescriptionError('')
    setSaving(true)
    
    dispatch(EditData(action))
    .then(() => {

      setSaving(false)

      navigation.goBack()

    }).catch((error) => {
      
      setSaving(false)

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

  return (
    <View style={styles.container}>
      <Input
        label='Name'
        value={action.name}
        onChangeText={(value) => setAction(prev => ({...prev, name: value}))}
        placeholder='Enter action name'
        errorStyle={{ color: 'red' }}
        errorMessage={nameError}
      />
      <Input
        label='Description'
        value={action.description}
        onChangeText={(value) => setAction(prev => ({...prev, description: value}))}
        placeholder='Enter action description'
        errorStyle={{ color: 'red' }}
        errorMessage={descriptionError}
      />
      <View style={{flexDirection:'row', justifyContent: 'space-between', paddingLeft: 10, paddingRight: 10}}>
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
  input: {
    height: 40
  }
});