import { StyleSheet, TextInput } from "react-native"
import { Color } from "../../constants"

export const Input = ({ placeholder, ...rest }) => {
  return <TextInput
    {...rest}
    placeholder={placeholder}
    placeholderTextColor={"#888"}
    style={[styles.input]} />
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 10,
    height: 45,
    backgroundColor: Color.white,
    paddingHorizontal: 20,
  }
})