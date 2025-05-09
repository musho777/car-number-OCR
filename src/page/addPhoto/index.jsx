import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Input } from "../../components/input"
import { Button } from "../../components/button"
import { Color } from "../../constants"
import { launchCamera } from "react-native-image-picker"
import TextRecognition from "@react-native-ml-kit/text-recognition"
import { useEffect, useState } from "react"
import SQLite from 'react-native-sqlite-storage';
import { db } from "../../database"
import { useNavigation } from "@react-navigation/native"

export const AddPhot = () => {
  const [value, setValue] = useState("")
  const [url, setUrl] = useState("")

  const [loading, setLoading] = useState(false)
  const navigation = useNavigation()

  const saveData = (text, imageUri) => {
    setLoading(true)
    const date = new Date().toISOString();
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO my_table (text, imageUri, createat) VALUES (?, ?, ?)',
        [text, imageUri, date],
        (r) => {
          navigation.goBack()
          setLoading(false)
        },
        (error) => {
          setLoading(false)
          console.log('Error saving data: ', error);
        }
      );
    });
  };

  const processImage = async (uri) => {
    setUrl(uri)
    try {
      const result = await TextRecognition.recognize(uri);
      const text = result.blocks?.map(block => block.text).join(' ');
      setValue(text)
    } catch (e) {
      console.error('OCR error:', e);
    }
  };
  const openCamera = () => {
    launchCamera({ mediaType: 'photo', includeBase64: true }, (response) => {
      if (response.assets && response.assets.length > 0) {
        const image = response.assets[0];
        processImage(image.uri);
      }
    });
  };


  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS my_table (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, imageUri TEXT, createat TEXT)',
        [],
        () => {
          console.log('Table created successfully');
        },
        (error) => {
          console.log('Error creating table: ', error);
        }
      );
    });
  }, []);

  return <View style={styles.wrapper}>
    <View style={styles.header}>
      <TouchableOpacity disabled={loading || !url} style={styles.save} onPress={() => saveData(value, url)}>
        {loading ?
          <ActivityIndicator size="small" color={Color.button} /> :
          <Text style={[styles.text, url === "" && { color: Color.itemBorder }]}>Save</Text>
        }
      </TouchableOpacity>
    </View>
    <View style={styles.inputWrapper}>
      <Input
        value={value}
        onChangeText={(e) => setValue(e)}
        width={"100%"}
        placeholderTextColor={Color.placeholderTextColor}
        placeholder={"Car number"}
      />
      <Button onPress={() => openCamera()} title="scan" />
    </View>
  </View>
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 20,
    gap: 10,
    alignItems: 'center'
  },
  text: {
    color: Color.blue,
    fontWeight: '700'
  },
  header: {
    alignItems: 'flex-end',
    width: '100%'
  },
  save: {
    height: 40,
    width: 40,
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  inputWrapper: {
    gap: 20,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
})