import * as React from 'react';
import { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

import { Text, View } from '../components/Themed';
import { StackHeaderLeftButtonProps } from '@react-navigation/stack';
import MenuIcon from '../components/MenuIcon';

export default function TabTwoScreen({navigation}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [qrTxt, setqrTxt] = useState('');

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
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {/* <EditScreenInfo path="/screens/TabTwoScreen.tsx" /> */}
    </View>
  ); 
}

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
});
