import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Input } from '../../../components/input';
import { Button } from '../../../components/button';
import { Color } from '../../../constants';


export const Login = () => (
  <View>
    <Image style={styles.image} source={require("../../../../assets/image/bg.jpeg")} />
    <View style={styles.loginWrapper}>
      <Text style={styles.title}>Login</Text>
      <View style={styles.inputWrapper}>
        <Input placeholder={"login"} width={"100%"} />
        <Input placeholder={"password"} width={"100%"} />
      </View>
      <Button title={"login"} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  image: {
    objectFit: 'cover',
    width: '100%',
    height: '100%'
  },
  loginWrapper: {
    position: 'absolute',
    backgroundColor: Color.loginBg,
    width: '100%',
    bottom: 0,
    height: 350,
    padding: 20,
    borderTopEndRadius: 25,
    borderTopLeftRadius: 25,
    alignItems: 'center'
  },
  inputWrapper: {
    width: '100%',
    gap: 10,
    marginBlock: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "500"
  }
});
