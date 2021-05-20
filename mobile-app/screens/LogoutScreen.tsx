import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Logout } from '../actions/UserAction';
import { Text, View } from '../components/Themed';

export default function LogoutScreen(props) {
    
    const dispatch = useDispatch();
    const auth = useSelector(state => state.Auth);

    useEffect(() => {
      
      // dispatch(Logout(props));



    }, []);

    return (
        <View style={styles.container}>
        <Text style={styles.title}>ID:</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
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
