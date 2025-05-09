import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Input } from "../../components/input"
import { Button } from "../../components/button"
import { Color } from "../../constants"
import { useEffect, useState } from "react"
import { useNavigation, useRoute } from "@react-navigation/native"
import { db } from "../../database"


export const EditPhoto = () => {
  const route = useRoute();
  const { id, number } = route.params;
  const [value, setValue] = useState(number)
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)

  const editItem = () => {
    setLoading(true)
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE my_table SET text = ? WHERE id = ?',
        [value, id],
        (_, result) => {
          setLoading(false)
          navigation.goBack()
        },
        (error) => {
          console.log(error)
          console.log('Error updating item: ', error);
        }
      );
    });
  };


  useEffect(() => {
    if (number) {
      setValue(number)
    }
  }, [number])

  return <View style={styles.wrapper}>
    <View style={styles.header}>
      <TouchableOpacity disabled={loading} style={styles.save} onPress={() => editItem(value)}>
        {loading ?
          <ActivityIndicator size="small" color={Color.button} /> :
          <Text style={styles.text}>Save</Text>
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
    </View>
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