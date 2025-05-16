import { StyleSheet, Text, TouchableOpacity, ActivityIndicator } from "react-native"
import { Color } from "../../constants"

export const Button = ({ title, onPress, loading, disabled, ...rest }) => {
  return <TouchableOpacity  {...rest} disabled={disabled} onPress={onPress} style={[styles.button, disabled && { backgroundColor: '#ccc' }]}>
    {loading ?
      <ActivityIndicator color={"white"} /> :
      <Text style={styles.text}>{title}</Text>
    }
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
    fontSize: 16,
    color: 'white'
  }
})