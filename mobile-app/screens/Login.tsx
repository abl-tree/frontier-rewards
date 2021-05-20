import * as React from 'react';
import {useDispatch, useSelector} from "react-redux";
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Auth } from "../actions/UserAction";

import { Text, View } from '../components/Themed';

export default function Login(props) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
    
  const dispatch = useDispatch();
  const auth = useSelector(state => state.Auth);

  function onLogin() {
    const data = {
        email: email,
        password: password
    }    

    dispatch(Auth(props, data));

    // Alert.alert(
    //   "Alert Title",
    //   "My Alert Msg",
    //   [
    //     {
    //       text: "Cancel",
    //       onPress: () => console.log("Cancel Pressed"),
    //       style: "cancel"
    //     },
    //     { text: "OK", onPress: () => console.log("OK Pressed") }
    //   ]
    // );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <View style={styles.inputView} >
        <TextInput
          style={styles.inputText} 
          onChangeText={(username) => setEmail(username)}
          placeholder="Email"
          placeholderTextColor="#003f5c"/>
      </View>
      <View style={styles.inputView} >
        <TextInput 
          style={styles.inputText} 
          onChangeText={(password) => setPassword(password)}
          placeholder="Password" 
          placeholderTextColor="#003f5c"
          secureTextEntry/>
      </View>
      <TouchableOpacity>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginBtn} onPress={onLogin}>
        <Text>LOGIN</Text>
      </TouchableOpacity>
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
  forgot:{
    fontSize:11
  },
  loginBtn:{
    width:"80%",
    backgroundColor:"#fb5b5a",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginBottom:10
  },
  inputView:{
    width:"80%",
    backgroundColor:"#465881",
    borderRadius:25,
    height:50,
    marginBottom:20,
    justifyContent:"center",
    padding:20
  },
  inputText:{
    height:50,
    color:"white"
  }
});

