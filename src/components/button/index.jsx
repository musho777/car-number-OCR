import { StyleSheet, Text, TouchableOpacity } from "react-native"
import { Color } from "../../constants"

export const Button = ({ title, onPress }) => {
  return <TouchableOpacity onPress={onPress} style={styles.button}>
    <Text style={styles.text}>{title}</Text>
  </TouchableOpacity>
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Color.button,
    width: 200,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  text: {
    fontSize: 20,
    color: 'white'
  }
})