import { View, SafeAreaView, TouchableOpacity, StyleSheet, Text } from "react-native"
import { Item } from "../../components/item"
import { Color } from "../../constants"
import { useNavigation } from "@react-navigation/native"

export const Home = () => {
  const navigation = useNavigation()
  return <SafeAreaView style={{ flex: 1 }}>
    <View style={styles.wrapper}>
      <Item />
      <Item />
      <Item />
      <Item />
      <Item />
    </View>
    <TouchableOpacity onPress={() => navigation.navigate('addPhot')} style={styles.add}>
      <Text style={styles.addText}>+</Text>
    </TouchableOpacity>
  </SafeAreaView>
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    gap: 10
  },
  add: {
    width: 50,
    height: 50,
    backgroundColor: Color.button,
    borderRadius: "50%",
    position: 'absolute',
    bottom: 30,
    right: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  addText: {
    color: Color.white,
    fontSize: 20,
    fontWeight: 'bold'
  }
})