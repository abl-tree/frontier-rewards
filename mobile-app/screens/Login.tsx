import * as React from 'react';
import {useDispatch, useSelector} from "react-redux";
import { Alert, Dimensions, ImageBackground, KeyboardAvoidingView, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Auth } from "../actions/UserAction";

import { View } from '../components/Themed';

import * as Font from 'expo-font';
import { Box, Button, Container, Content, Form, Header, Input, Item, Image, Label, NativeBaseProvider, Text, VStack, FormControl, Stack, HStack, Center, Heading, Icon, IconButton, Link } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Login(props) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const window = Dimensions.get("window");
  const screen = Dimensions.get("screen");
    
  const dispatch = useDispatch();
  const auth = useSelector(state => state.Auth);

  function onLogin() {
    const data = {
        email: email,
        password: password
    }

    dispatch(Auth(props, data));
  }

  return (
    <Box flex={1} backgroundColor="white">
      <Image style={{position: 'absolute', bottom: 0, opacity: 0.30}} w="100%" h={250} resizeMode="contain" source={require('../assets/images/car-bg.png')} alt="car background"/>

      <Center flex={1}>
        <Center
          position="absolute"
        >
          <Center
            w="90%"
          >
            <VStack>
              <Image h="200" resizeMode="contain" source={require('../assets/images/logo.png')} alt="logo"/>
            </VStack>
          </Center>
          <Center
            mt={10}
            bg="#fae80c"
            borderRadius={40}
            _text={{
              color: "white",
              fontWeight: "bold",
            }}
            w="90%"
            p={2}
            mx="auto"
          >
            <VStack w="100%" space={2} p={5}>
              <FormControl>
                <Input 
                  size="sm"
                  onChangeText={(username) => setEmail(username)}
                  type="email" 
                  placeholder="EMAIL" 
                  textAlign="center" 
                  backgroundColor="white" 
                  borderRadius={15}/>
              </FormControl>
              <FormControl>
                <Input 
                  size="sm"
                  onChangeText={(password) => setPassword(password)}
                  type="password" 
                  placeholder="PASSWORD" 
                  textAlign="center" 
                  backgroundColor="white" 
                  borderRadius={15}/>
              </FormControl>
            </VStack>
            <VStack mb={5}>
              <Button onPress={onLogin}>
                LOG IN
              </Button>
            </VStack>
          </Center>
        </Center>
      </Center>
    </Box>
  )

  return (
    <ImageBackground style={{flex: 1}} imageStyle={{opacity: 0.07, resizeMode: 'cover', flex: 1}} source={require('../assets/images/login-bg.png')}>  
      <Center flex={1}>
        <Center
          position="absolute"
        >
          <Center
            w="90%"
          >
            <VStack>
              <Image h="200" resizeMode="contain" source={require('../assets/images/logo.png')} alt="logo"/>
            </VStack>
          </Center>
          <Center
            mt={10}
            bg="#fae80c"
            borderRadius={40}
            _text={{
              color: "white",
              fontWeight: "bold",
            }}
            w="90%"
            p={2}
            mx="auto"
          >
            <VStack w="100%" space={2} p={5}>
              <FormControl>
                <Input 
                  size="sm"
                  onChangeText={(username) => setEmail(username)}
                  type="email" 
                  placeholder="EMAIL" 
                  textAlign="center" 
                  backgroundColor="white" 
                  borderRadius={15}/>
              </FormControl>
              <FormControl>
                <Input 
                  size="sm"
                  onChangeText={(password) => setPassword(password)}
                  type="password" 
                  placeholder="PASSWORD" 
                  textAlign="center" 
                  backgroundColor="white" 
                  borderRadius={15}/>
              </FormControl>
            </VStack>
            <VStack mb={5}>
              <Button onPress={onLogin}>
                LOG IN
              </Button>
            </VStack>
          </Center>
        </Center>
      </Center>
    </ImageBackground>
  )

  return (
    <Container>
      <KeyboardAvoidingView style={{width: Dimensions.get('screen').width, height: Dimensions.get('screen').height}}>
        <ImageBackground style={{flex: 1}} imageStyle={{opacity: 0.07, resizeMode: 'cover', flex: 1}} source={require('../assets/images/login-bg.png')}>
          <Center flex={1} w="100%" alignItems="center">
            <Image style={styles.logo} source={require('../assets/images/logo.png')} alt="logo"/>
          </Center>
          {/* <Box flex={1} p={2} w="90%" mx="auto" backgroundColor="red"> */}
            <VStack space={2} mt={1} backgroundColor="yellow">
              
              <FormControl>
                <FormControl.Label _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                    Email ID
                </FormControl.Label>
                <Input type="email"/>
              </FormControl>
            </VStack>
          {/* </Box> */}
            {/* <Form style={{backgroundColor: '#fae80c', borderRadius: 40, padding: 20, marginTop: 70}}>
              <Item style={{backgroundColor: 'white', borderRadius: 10, marginLeft: 5, marginRight: 5, marginTop: 5, marginBottom: 5}}>
                <Input placeholder="EMAIL"
                onChange={(username) => setEmail(username)}
                style={{textAlign: 'center'}}/>
              </Item>
              <Item style={{backgroundColor: 'white', borderRadius: 10, marginLeft: 5, marginRight: 5, marginTop: 5, marginBottom: 5}}>
                <Input placeholder="PASSWORD"
                onChange={(password) => setPassword(password)}
                style={{textAlign: 'center', flex: 1}}
                secureTextEntry/>
              </Item>
              <Button small dark style={{alignSelf: 'center', marginTop: 15}} onClick={onLogin}>
                <Text>LOG IN</Text>
              </Button>
            </Form> */}
          {/* </Content> */}
        </ImageBackground>
      </KeyboardAvoidingView>
    </Container>
  );

  return (
    <View style={styles.container}>
      {/* <View style={styles.logoContainer}> */}
        <Image style={styles.logo} source={require('../assets/images/logo.png')}/>
      {/* </View> */}
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
  },
  logoContainer: {
    height: 100,
    width: "100%",
    justifyContent:"center",
    backgroundColor: 'red',
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    height: 10,
    resizeMode: 'contain',
    flex: 1,
    // alignItems: 'center',
    backgroundColor: 'blue'
  }
});

