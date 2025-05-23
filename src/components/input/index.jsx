import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { Color } from "../../constants"

export const Input = ({ placeholder, scan, onPress, label, ...rest }) => {
  return <>
    <Text style={{ alignItems: "flex-start", width: '100%', marginBottom: -15 }}>{label}</Text>
    <View style={{ width: "100%", position: 'relative', justifyContent: 'center' }}>
      <TextInput
        {...rest}
        placeholder={placeholder}
        placeholderTextColor={"#888"}
        style={[styles.input, scan && { paddingRight: 50 }]} />
      {scan && <TouchableOpacity onPress={() => onPress()} style={{ position: 'absolute', right: 10 }}>
        <Text style={{ color: "#125dde", fontSize: 15, fontWeight: '500' }}>Scan</Text>
      </TouchableOpacity>}
    </View>
  </>
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 10,
    height: 45,
    backgroundColor: Color.white,
    paddingHorizontal: 20,
  }
})