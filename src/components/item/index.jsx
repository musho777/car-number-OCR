import { Dimensions, Image, StyleSheet, Text, View } from "react-native"
import { Color } from "../../constants"

const width = Dimensions.get("window").width - 20

export const Item = () => {
  return <View style={styles.item}>
    <View style={styles.info}>
      <View>
        <Text>BEND</Text>
        <Text>NOT DECODED</Text>
      </View>
      <View>
        <Text>Uploaded May 1, 2025 at 6:30 AM</Text>
        <Text>Images: 1</Text>
      </View>
    </View>
    <View>
      <Image style={styles.image} source={require("../../../assets/image/bg.jpeg")} />
    </View>
  </View>
}

const styles = StyleSheet.create({
  item: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: Color.itemBorder
  },
  info: {
    gap: 10,
    width: width / 2
  },
  image: {
    width: width / 2 - 30,
    height: 100,
    borderRadius: 20,
  }
})