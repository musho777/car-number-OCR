import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Input } from "../../components/input"
import { Button } from "../../components/button"
import { Color } from "../../constants"
import { launchCamera } from "react-native-image-picker"
import TextRecognition from "@react-native-ml-kit/text-recognition"
import { useEffect, useState } from "react"
import { db } from "../../database"
import { useNavigation } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import RNFS from 'react-native-fs';
import { ScrollView } from "react-native-gesture-handler"

const getImageBase64 = async (filePath) => {
  try {
    const cleanPath = filePath.replace('file://', '');
    const base64 = await RNFS.readFile(cleanPath, 'base64');
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error('Failed to convert image to base64:', error);
    throw error;
  }
};

export const AddPhot = () => {
  const [value, setValue] = useState("")
  const [url, setUrl] = useState([])
  const [name, setName] = useState("")
  const [hasPermission, setHasPermission] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation()
  const [token, setToken] = useState("")

  const dropAllTables = () => {
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


  const GetText = async (uri) => {
    try {
      const result = await TextRecognition.recognize(uri);
      const text = result.blocks?.map(block => block.text).join(' ');
      setValue(text)
    } catch (e) {
      console.error('OCR error:', e);
    }
  }

  const processImage = async (uri) => {
    setUrl([...url, { file: await getImageBase64(uri) }])
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

  const openCamera1 = () => {
    launchCamera({ mediaType: 'photo', includeBase64: true }, (response) => {
      if (response.assets && response.assets.length > 0) {
        const image = response.assets[0];
        GetText(image.uri)
      }
    });
  };


  const getToken = async () => {
    let t = await AsyncStorage.getItem("token")
    setToken(t)
  }


  const handleSaveData = async () => {
    const date = new Date();
    const isoDate = date.toISOString().split('T')[0];
    const image = {
      value,
      upload_date: isoDate,
      images: url
    }

    setLoading(true)
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(image),
      redirect: "follow"
    };
    fetch("https://xn----nbck7b7ald8atlv.xn--y9a3aq/iosapp.loc/public/api/uploadImageCar", requestOptions)
      .then((response) => {
        response.json()
      })
      .then((result) => {
        saveData(name, value, JSON.stringify(url), 1)
      })
      .catch((error) => saveData(name, value, JSON.stringify(url), 0))
      .finally(() => setLoading(false))
  }


  const removeImage = (indexToRemove) => {
    setUrl((prev) => prev.filter((_, index) => index !== indexToRemove));
  }


  const onTextDetected = (textBlocks) => {
    if (textBlocks.length > 0 && !detectedText) {
      const fullText = textBlocks.map(t => t.text).join(' ');
      setValue(fullText);
    }
  };

  // const frameProcessor = useFrameProcessor((frame) => {
  //   'worklet';
  //   const result = scanText(frame);
  //   runOnJS(onTextDetected)(result.blocks);
  // }, []);



  useEffect(() => {
    getToken()
  }, [])


  // if (scanning)
  //   return <Camera
  //     ref={camera}
  //     style={StyleSheet.absoluteFill}
  //     device={device}
  //     isActive={true}
  //     frameProcessor={frameProcessor}
  //     frameProcessorFps={5}
  //   />

  return <ScrollView >
    <View style={styles.wrapper}>
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
        <Button onPress={() => openCamera1()} title="scan" />
        <Button onPress={() => openCamera()} title="photo" />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: "space-between", width: '100%', gap: 10, flexWrap: "wrap" }}>
        {url.map((elm, i) => {
          return <View key={i} style={{ position: 'relative' }}>
            <TouchableOpacity onPress={() => removeImage(i)} style={{ position: 'absolute', zIndex: 1, right: 10, top: 0 }}>
              <Text style={{ fontWeight: "900", fontSize: 25, color: 'red' }}>x</Text>
            </TouchableOpacity>
            <Image key={i} source={{ uri: elm.file }} style={{ width: 150, height: 150, borderRadius: 20 }} />
          </View>
        })}
      </View>
    </View>


  </ScrollView >
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