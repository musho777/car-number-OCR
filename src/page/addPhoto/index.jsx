import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Input } from "../../components/input"
import { Button } from "../../components/button"
import { Color } from "../../constants"
import { launchCamera } from "react-native-image-picker"

export const AddPhot = () => {

  const openCamera = () => {
    const options = {
      mediaType: 'photo',
      cameraType: 'back',
      saveToPhotos: true,
    };
    console.log("fdfd")
    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log('Camera error: ', response.errorMessage);
      } else {
        console.log('Camera result: ', response.assets);
      }
    });
  };

  return <View style={styles.wrapper}>
    <View style={styles.header}>
      <TouchableOpacity>
        <Text style={styles.text}>Save</Text>
      </TouchableOpacity>
    </View>
    <Input width={"100%"} placeholderTextColor="#888" placeholder={"Car number"} />
    <Button onPress={() => openCamera()} title="scan" />
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
  }
})