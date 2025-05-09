import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Color } from "../../constants"
import { CommonActions, useNavigation } from "@react-navigation/native"


export const SettingsPage = () => {
  const navigation = useNavigation()
  return <View style={styles.wrapper}>
    <Text style={styles.title}>Settings</Text>
    <View style={styles.container}>
      <View style={styles.accountRow}>
        <Text>Accaunt</Text>
        <Text>mt-car-1</Text>
      </View>
      <TouchableOpacity
        onPress={() =>
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'login' }],
            })
          )
        }
        style={styles.logoutButton}
      >
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  </View>
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 20,
    gap: 10,
    alignItems: 'center'
  },
  title: {
    fontWeight: '700',
    marginBottom: 20,
  },
  container: {
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: Color.itemBorder,
    paddingBottom: 10,
    marginBottom: 20,
  },
  logoutButton: {
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
  },
  logoutText: {
    color: Color.red,
  },
})