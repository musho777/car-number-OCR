import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Color } from "../../constants"
import { CommonActions, useNavigation } from "@react-navigation/native"
import { db } from "../../database"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"


export const SettingsPage = () => {
  const navigation = useNavigation()

  const deleteUploadedData = () => {
    Alert.alert(
      'Удалить загруженные данные',
      'Вы уверены, что хотите удалить все загруженные записи?',
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Удалить',
          onPress: () => {
            db.transaction(tx => {
              tx.executeSql(
                'DELETE FROM my_table WHERE upload = 1',
                [],
                () => {
                  console.log('Успешно удалены загруженные строки');
                },
                (txObj, error) => {
                  console.log('Ошибка при удалении строк: ', error);
                }
              );
            });
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };


  const logout = async () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'login' }],
      })
    )
    await AsyncStorage.removeItem("token")
    await AsyncStorage.removeItem("user")
  }
  const [name, setName] = useState("")

  const getName = async () => {
    let n = await AsyncStorage.getItem("user")
    setName(n)
  }

  useEffect(() => {
    getName()
  }, [])

  return <View style={styles.wrapper}>
    <Text style={styles.title}>Settings</Text>
    <View style={styles.container}>
      <TouchableOpacity onPress={() => deleteUploadedData()}>
        <Text style={{ textAlign: 'center' }}>Clear History</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.container}>
      <View style={styles.accountRow}>
        <Text>Accaunt</Text>
        <Text>{name}</Text>
      </View>
      <TouchableOpacity
        onPress={() => logout()}
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