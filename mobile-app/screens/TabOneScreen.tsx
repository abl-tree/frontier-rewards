import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Alert, Button, Dimensions, ImageBackground, StyleSheet } from 'react-native';

import axios from 'axios';
import { View } from '../components/Themed';
import { Logout } from '../actions/UserAction';
import { useDispatch } from 'react-redux';
import RNMultiSelect, {
  IMultiSelectDataTypes,
} from "@freakycoder/react-native-multiple-select";
import { StackHeaderLeftButtonProps } from '@react-navigation/stack';
import MenuIcon from '../components/MenuIcon';
import { Box, Center, Container, Image, Text, VStack } from 'native-base';
import { Card } from 'react-native-elements';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
import Carousel from 'react-native-snap-carousel';
import {config} from '../constants/API';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function TabOneScreen({navigation, route}) {
  const dispatch = useDispatch()
  const carouselRef = useRef(null)
  const [campaigns, setCampaigns] = useState(0);
  const [actions, setActions] = useState(0);
  const [customers, setCustomers] = useState(0);
  const [packages, setPackages] = useState(0);
  const [transactions, setTransactions] = useState({
      pending: 0,
      confirmed: 0,
      cancelled: 0,
      completed: 0,
  })
  const [carouselState, setCarouselState] = useState({
      active:0,
      items: [
      {
          id:"transaction",
          title: "Transaction Summary",
      },
      {
          id:"active_campaigns",
          title: "Active Campaigns",
      },
      {
          id:"active_actions",
          title: "Active Actions",
      },
      {
          id:"users",
          title: "Users",
      },
      {
          id:"packages",
          title: "Packages",
      },
    ]
  })

  React.useLayoutEffect(() => {

    fetchTransactions()
    fetchActiveCampaigns()
    fetchActiveActions()
    fetchCustomers()
    fetchPackages()
    
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

  const fetchTransactions = async () => {

      const res = await axios.get('/summary/transactions')
      let data = res.data.data

      if(data.cancelled != 0 || data.pending != 0 || data.confirmed != 0 || data.completed)
      setTransactions(prev => ({...prev, cancelled: data.cancelled, pending: data.pending, confirmed: data.confirmed, completed: data.completed}))

  }

  const fetchActiveCampaigns = async () => {

      const res = await axios.get('/summary/active_campaigns')
      let data = res.data.data

      setCampaigns(data.total)

  }

  const fetchActiveActions = async () => {

      const res = await axios.get('/summary/active_actions')
      let data = res.data.data

      setActions(data.total)

  }

  const fetchCustomers = async () => {

      const res = await axios.get('/summary/total_customers')
      let data = res.data.data

      setCustomers(data.total)

  }

  const fetchPackages = async () => {

      const res = await axios.get('/summary/total_packages')
      let data = res.data.data

      setPackages(data.total)

  }

  const carouselItem = ({item, index}) => {
    
    if(item.id == 'transaction') {
      return (
        <Box shadow={5} minHeight={SCREEN_WIDTH * 0.5 + 100} w="100%" alignItems="center" backgroundColor="white" borderRadius={20} p={5}>
          <Center flex={1}>
            <PieChart
              data={[
                {
                  name: "Cancelled",
                  population: transactions.cancelled,
                  color: "#d8334a",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 11
                },
                {
                  name: "Pending",
                  population: transactions.pending,
                  color: "#ffd11f",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 11
                },
                {
                  name: "Confirmed",
                  population: transactions.confirmed,
                  color: "#f77c52",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 11
                },
                {
                  name: "Completed",
                  population: transactions.completed,
                  color: "#ffeea3",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 11
                },
              ]}
              width={SCREEN_WIDTH * 0.8}
              height={SCREEN_WIDTH * 0.5}
              chartConfig={{
                backgroundGradientFrom: "#1E2923",
                backgroundGradientFromOpacity: 0,
                backgroundGradientTo: "#08130D",
                backgroundGradientToOpacity: 0.5,
                color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                strokeWidth: 2, // optional, default 3
                barPercentage: 0.5,
                useShadowColorFromDataset: false // optional
              }}
              // hasLegend={false}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              center={[0, 0]}
              absolute
            /> 
          </Center>
        </Box>
      )
    } else if(item.id === 'active_campaigns') {
      return (
        <Box shadow={5} w="100%" minHeight={SCREEN_WIDTH * 0.5 + 100} alignItems="center" backgroundColor="white" borderRadius={20} p={5}>
          <Center flex={1}>
            <VStack alignItems="center">
              <Image alt="Campaigns icon" w={16} h={16} resizeMode="contain" source={{uri: config.url.BASE_URL + '/icons/campaign-icon.png'}} />
              <Text style={{fontSize: 20}}>Active</Text>
              <Text style={{fontSize: 20}}>Campaigns</Text>
              <Text style={{fontSize: 60}}>{campaigns}</Text>
            </VStack>
          </Center>
        </Box>
      )
    } else if(item.id === 'active_actions') {
      return (
        <Box shadow={5} w="100%" minHeight={SCREEN_WIDTH * 0.5 + 100} alignItems="center" backgroundColor="white" borderRadius={20} p={5}>
          <Center flex={1}>
            <VStack alignItems="center">
              <Image alt="Campaigns icon" w={16} h={16} resizeMode="contain" source={{uri: config.url.BASE_URL + '/icons/actions-icon.png'}} />
              <Text style={{fontSize: 20}}>Active</Text>
              <Text style={{fontSize: 20}}>Actions</Text>
              <Text style={{fontSize: 60}}>{actions}</Text>
            </VStack>
          </Center>
        </Box>
      )
    } else if(item.id === 'users') {
      return (
        <Box shadow={5} w="100%" minHeight={SCREEN_WIDTH * 0.5 + 100} alignItems="center" backgroundColor="white" borderRadius={20} p={5}>
          <Center flex={1}>
            <VStack alignItems="center">
              <Image alt="Users icon" w={16} h={16} resizeMode="contain" source={{uri: config.url.BASE_URL + '/icons/profile-icon.png'}} />
              <Text style={{fontSize: 20}}>Users</Text>
              <Text style={{fontSize: 60}}>{customers}</Text>
            </VStack>
          </Center>
        </Box>
      )
    } else if(item.id === 'packages') {
      return (
        <Box shadow={5} w="100%" minHeight={SCREEN_WIDTH * 0.5 + 100} alignItems="center" backgroundColor="white" borderRadius={20} p={5}>
          <Center flex={1}>
            <VStack alignItems="center" style={{shadowRadius: 4, shadowColor: 'black', shadowOpacity: 0.1}}>
              <Image alt="Packages icon" w={16} h={16} resizeMode="contain" source={{uri: config.url.BASE_URL + '/icons/package-icon.png'}} />
              <Text style={{fontSize: 20}}>Packages</Text>
              <Text style={{fontSize: 60}}>{packages}</Text>
            </VStack>
          </Center>
        </Box>
      )
    }
  }
  
  return (
    <Box flex={1} backgroundColor="white" width="100%">
      <Image style={{position: 'absolute', bottom: 0, alignSelf: 'flex-end', opacity: 0.30}} w="100%" h={250} resizeMode="contain" source={require('../assets/images/car-bg.png')} alt="car background"/>
      <VStack paddingLeft="5" paddingRight="5">
        <Image w="100%" h={200} alignContent="center" resizeMode="contain" source={require('../assets/images/image-1.png')} alt="car background"/>
        <Carousel
          containerCustomStyle={{alignSelf: 'center'}}
          slideStyle={{borderRadius: 20, padding: 10}}
          ref={carouselRef}
          data={carouselState.items}
          renderItem={carouselItem}
          sliderWidth={SCREEN_WIDTH}
          itemWidth={SCREEN_WIDTH * 0.8}
          layout={"default"}
          onSnapToItem = { index => setCarouselState(prev => ({...prev, active: index})) }
        />
      </VStack>
    </Box>
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
