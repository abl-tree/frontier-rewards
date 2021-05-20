import * as React from 'react';
import { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet } from 'react-native';

import axios from 'axios';
import { Text, View } from '../components/Themed';
import { Logout } from '../actions/UserAction';
import { useDispatch } from 'react-redux';
import RNMultiSelect, {
  IMultiSelectDataTypes,
} from "@freakycoder/react-native-multiple-select";
import { StackHeaderLeftButtonProps } from '@react-navigation/stack';
import MenuIcon from '../components/MenuIcon';

export default function TabOneScreen({navigation, route}) {
  const dispatch = useDispatch()
  const [selectedItems, setSelectedItems] = useState([])
  const [items, setItems] = useState([
    {
      id: 0,
      value: "Euismod Justo",
      isChecked: false,
    },
    {
      id: 1,
      value: "Risus Venenatis",
      isChecked: false,
    },
    {
      id: 2,
      value: "Vestibulum Ullamcorper",
      isChecked: false,
    },
    {
      id: 3,
      value: "Lorem Nibh",
      isChecked: false,
    },
    {
      id: 4,
      value: "Ligula Amet",
      isChecked: false,
    },
  ]);
  
  const onLogout = () => {
    
    dispatch(Logout())
    
  }

  React.useLayoutEffect(() => {

    // navigation.setOptions({
    //   headerRight: () => (
    //     <Button onPress={() => onLogout()} title="Logout" />
    //   )
    // })
    
    navigation.setOptions({
      showHeader: true,
      headerLeft: (props: StackHeaderLeftButtonProps) => (<MenuIcon/>)
    });

  }, [navigation])

  const fetchCampaigns = async (search) => {

      const res = await axios.get('/campaigns?search=' + search)

      var results = res.data.data

      var options = [];

      for (let a = 0; a < results.data.length; a++) {
          const result = results.data[a]
          
          options = [...options, {value: result.id, label: result.name}]
      }

      return options
      
  }

  const promiseCampaignOptions = inputValue => new Promise(resolve => {
      // setTimeout(() => {
          resolve(fetchCampaigns(inputValue));
      // }, 1000);
  });

  const onSelectedItemsChange = selectedItems => {
    console.log(selectedItems);
    
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>This is dashboard</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {/* <RNMultiSelect
        disableAbsolute
        data={items}
        onSelect={(selectedItems) => console.log("SelectedItems: ", selectedItems)}
      /> */}

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
});
