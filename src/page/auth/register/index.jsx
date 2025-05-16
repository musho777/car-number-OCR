import React, { useState } from 'react';
import { Dimensions, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Input } from '../../../components/input';
import { Button } from '../../../components/button';
import { Color } from '../../../constants';
import { useNavigation } from '@react-navigation/native';

export const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigation = useNavigation()

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


  const register = async () => {
    if (!emailRegex.test(email)) {
      setError("Введите корректный email.");
      return;
    }
    if (password.length < 8) {
      setError("Пароль должен содержать минимум 8 символов.");
      return;
    }

    if (password !== confirm) {
      setError("Пароли не совпадают.");
      return;
    }

    setLoading(true);
    setError(null);

    fetch('https://xn----nbck7b7ald8atlv.xn--y9a3aq/iosapp.loc/public/api/registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        password_confirmation: confirm,
      })
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw data;
        }
        if (data.success) {
          navigation.navigate("login")
        }
      })
      .catch((err) => {
        if (err.data?.email) {
          setError(err.data?.email);
        } else {
          setError("Произошла неизвестная ошибка.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "height" : "height"}
    >
      <Image style={styles.image} source={require("../../../../assets/image/bg.jpeg")} />
      <View style={styles.loginWrapper}>
        <Text style={styles.title}>Register</Text>
        {error && <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>}
        <View style={styles.inputWrapper}>
          <Input value={email} onChangeText={setEmail} placeholder={"login"} width={"100%"} />
          <Input value={password} onChangeText={setPassword} placeholder={"password"} width={"100%"} secureTextEntry />
          <Input value={confirm} onChangeText={setConfirm} placeholder={"confirm password"} width={"100%"} secureTextEntry />
        </View>
        <Button disabled={email === "" || password === "" || confirm === ""} loading={loading} onPress={register} title={"Register"} />
        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("login")}>
            <Text style={styles.link}>Login here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
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
  linkContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  linkText: {
    color: 'black',
    fontSize: 14,
  },
  link: {
    color: '#007bff',
    textDecorationLine: 'underline',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 5,
  },
});
