import * as React from 'react';
import { Input } from 'react-native-elements';
import {useDispatch} from "react-redux";
import { useEffect, useState } from 'react';
import _ from 'lodash';
import {EditData} from "../actions/ActionAction";
import { StyleSheet, View } from 'react-native';
import { Box, Button, Center, Image, VStack } from 'native-base';

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
    
    <Center flex={1} backgroundColor="white">
      <Image style={{position: 'absolute', bottom: 0, opacity: 0.30}} w="100%" h={250} resizeMode="contain" source={require('../assets/images/car-bg.png')} alt="car background"/>
      <Box flex={1} w="100%" padding={2}>
        <VStack space={3}>
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