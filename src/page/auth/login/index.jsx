import React, { useState } from 'react';
import { Dimensions, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Input } from '../../../components/input';
import { Button } from '../../../components/button';
import { Color } from '../../../constants';
import { CommonActions, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigation = useNavigation()
  const login = () => {
    setLoading(true);
    setError(null);
    fetch('https://xn----nbck7b7ald8atlv.xn--y9a3aq/iosapp.loc/public/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      })
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw data;
        }
        if (data.success) {
          await AsyncStorage.setItem("token", data.token)
          await AsyncStorage.setItem("user", data.user.email)
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            })
          )
        }
      })
      .catch((err) => {
        if (err.data?.email) {
          setError(err.data?.email);
        } else {
          setError("Произошла неизвестная ошибка.");
        }
      })
      .finally((r) => {
        setLoading(false);
      });
  };
  return <KeyboardAvoidingView
    style={{ flex: 1 }}
  >
    <Image style={styles.image} source={require("../../../../assets/image/bg.jpeg")} />
    <View style={styles.loginWrapper}>
      <Text style={styles.title}>Login</Text>
      {error && <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>}
      <View style={styles.inputWrapper}>
        <Input
          value={email}
          onChangeText={(e) => setEmail(e)}
          placeholder={"login"}
          width={"100%"}
          autoCorrect={false}
          autoCapitalize="none"
        />
        <Input
          secureTextEntry
          value={password}
          onChangeText={(e) => setPassword(e)}
          placeholder={"password"}
          width={"100%"}
        />
      </View>
      <Button
        disabled={email === "" || password === ""}
        loading={loading}
        onPress={() => login()}
        title={"login"}
      />
    </View>
  </KeyboardAvoidingView>
};

const styles = StyleSheet.create({
  image: {
    objectFit: 'cover',
    width: '100%',
    height: '100%'
  },
  loginWrapper: {
    position: 'absolute',
    backgroundColor: Color.loginBg,
    width: '90%',
    height: 350,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    top: '50%',
    left: '50%',
    transform: [
      { translateX: -0.45 * Dimensions.get('window').width },
      { translateY: -200 }
    ]
  },
  inputWrapper: {
    width: '100%',
    gap: 10,
    marginBlock: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "500"
  },
  link: {
    color: '#007bff',
    textDecorationLine: 'underline',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 10,
    textAlign: 'center',
  },
});
