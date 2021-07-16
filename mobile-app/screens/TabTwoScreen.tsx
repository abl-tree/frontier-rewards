import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Alert, Button, Dimensions, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

import { Text, View } from '../components/Themed';
import { StackHeaderLeftButtonProps } from '@react-navigation/stack';
import MenuIcon from '../components/MenuIcon';
import { Box, Center, HStack, Modal } from 'native-base';
import { height } from 'styled-system';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const maskRowHeight = Math.round((SCREEN_HEIGHT - 300) / 20);
const maskColWidth = (SCREEN_WIDTH - 300) / 2;

export default function TabTwoScreen({navigation}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [qrTxt, setqrTxt] = useState('');
  const [body, setBody] = useState({})

  useEffect(() => {
    
    navigation.setOptions({
      showHeader: true,
      headerLeft: (props: StackHeaderLeftButtonProps) => (<MenuIcon/>)
    });

    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);

    navigation.navigate('UserActionScreen', { qrCode: data })
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <BarCodeScanner
      onBarCodeScanned={handleBarCodeScanned}
      style={styles.cameraView}
      onLayout={(event) => {
        setBody(event.nativeEvent.layout)
      }}
    >
      <Center>
        <Box w="100%" h={body && body.height ? (body.height-SCREEN_WIDTH * 0.6)/2 : 0} backgroundColor="rgba(0,0,0,0.5)"></Box>
        <Box w="100%" h={SCREEN_WIDTH * 0.6} backgroundColor="transparent">
          <HStack h="100%" w="100%">
            <Box backgroundColor="rgba(0,0,0,0.5)" w={SCREEN_WIDTH * 0.2}></Box>
            <Box backgroundColor="transparent" w={SCREEN_WIDTH * 0.6} borderColor="yellow" borderWidth={2}></Box>
            <Box backgroundColor="rgba(0,0,0,0.5)" w={SCREEN_WIDTH * 0.2}></Box>
          </HStack>
        </Box>
        <Box w="100%" h={body && body.height ? (body.height-SCREEN_WIDTH * 0.6)/2 : 0} backgroundColor="rgba(0,0,0,0.5)"></Box>
      </Center>
    </BarCodeScanner>
  )
}

const opacity = 'rgba(0, 0, 0, .6)';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  layerTop: {
    flex: 2,
    backgroundColor: opacity
  },
  layerCenter: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    height: 1000
  },
  layerLeft: {
    flex: 1,
    backgroundColor: opacity
  },
  focused: {
    flex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  layerRight: {
    flex: 1,
    backgroundColor: opacity
  },
  layerBottom: {
    flex: 2,
    backgroundColor: opacity
  },
  cameraView: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'black'
  },
  maskOutter: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  maskInner: {
    width: 300,
    backgroundColor: 'rgba(1,1,1,0)',
    borderColor: 'blue',
    borderWidth: 2,
  },
  maskFrame: {
    backgroundColor: 'rgba(1,1,1,0.6)',
  },
  maskRow: {
    width: '100%',
  },
  maskCenter: { flexDirection: 'row' },
});
