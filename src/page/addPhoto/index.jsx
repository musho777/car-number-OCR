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
import AsyncStorage from "@react-native-async-storage/async-storage"
import RNFS from 'react-native-fs';

const getImageBase64 = async (filePath) => {
  try {
    const cleanPath = filePath.replace('file://', '');
    const base64 = await RNFS.readFile(cleanPath, 'base64');
    console.log(base64, 'base64')
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error('Failed to convert image to base64:', error);
    throw error;
  }
};

export const AddPhot = () => {
  const [value, setValue] = useState("")
  const [url, setUrl] = useState("")
  const [name, setName] = useState("")

  const [loading, setLoading] = useState(false)
  const navigation = useNavigation()
  const [token, setToken] = useState("")

  const dropAllTables = () => {
    console.log("fdj")
    db.transaction(tx => {
      tx.executeSql(
        `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`,
        [],
        (_, result) => {
          const tables = result.rows.raw().map(row => row.name);
          tables.forEach(tableName => {
            tx.executeSql(`DROP TABLE IF EXISTS ${tableName}`);
          });
          console.log('All tables dropped successfully');
        },
        (_, error) => {
          console.log('Error fetching tables: ', error);
          return false;
        }
      );
    });
  };


  const saveData = (name, text, imageUri, upload) => {
    const date = new Date().toISOString();
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO my_table (name, text, imageUri, createat, upload) VALUES (?, ?, ?, ?, ?)',
        [name, text, imageUri, date, upload],
        () => {
          navigation.goBack();
        },
        (error) => {
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
        setName(image.fileName)
        processImage(image.uri);
      }
    });
  };



  const getToken = async () => {
    let t = await AsyncStorage.getItem("token")
    setToken(t)
  }

  useEffect(() => {
    getToken()
  }, [])

  const handleSaveData = async () => {
    const date = new Date();
    const isoDate = date.toISOString().split('T')[0];
    let imageur = await getImageBase64(url)
    console.log(url)
    const image = [
      {
        value,
        upload_date: isoDate,
        image_number: name,
        file: imageur
      }
    ]
    setLoading(true)

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({ images: image }),
      redirect: "follow"
    };

    fetch("https://xn----nbck7b7ald8atlv.xn--y9a3aq/iosapp.loc/public/api/uploadImage", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        saveData(name, value, imageur, 1)
      })
      .catch((error) => saveData(name, value, imageur, 0))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS my_table (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          text TEXT,
          imageUri TEXT,
          createat TEXT,
          upload INTEGER DEFAULT 0
        )`,
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

  // useEffect(() => {
  //   dropAllTables()
  // }, [])

  return <View style={styles.wrapper}>
    <View style={styles.header}>
      <TouchableOpacity disabled={loading || !url} style={styles.save} onPress={() => handleSaveData()}>
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