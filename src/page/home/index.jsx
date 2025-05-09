import { View, SafeAreaView, TouchableOpacity, StyleSheet, Text, FlatList, Alert } from "react-native"
import { Item } from "../../components/item"
import { Color } from "../../constants"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { useCallback, useState } from "react";
import { db } from "../../database";

export const Home = () => {
  const [dataList, setDataList] = useState([])
  const navigation = useNavigation()

  const fetchData = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM my_table ORDER BY id DESC',
        [],
        (_, results) => {
          const rows = results.rows;
          let items = [];
          for (let i = 0; i < rows.length; i++) {
            items.push(rows.item(i));
          }
          setDataList(items);
        },
        (error) => {
          console.log('Error fetching data: ', error);
        }
      );
    });
  };
  const confirmDelete = (id) => {
    console.log(id)
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this item?',
      [
        {
          text: 'Cancel',
          onPress: () => { },
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => deleteItem(id),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const deleteItem = (id) => {
    setDataList(prevList => prevList.filter(item => item.id !== id));
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM my_table WHERE id = ?',
        [id],
        (_, result) => {
          console.log('Item deleted');
        },
        (error) => {
          console.log('Error deleting item: ', error);
        }
      );
    });
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  return <SafeAreaView style={{ flex: 1 }}>
    <View style={styles.wrapper}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={dataList}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <Item
          delate={(id) => confirmDelete(id)}
          id={item.id}
          image={item.imageUri}
          number={item.text}
          date={item.createat}
        />}
      />
    </View>
    <TouchableOpacity onPress={() => navigation.navigate('addPhot')} style={styles.add}>
      <Text style={styles.addText}>+</Text>
    </TouchableOpacity>
  </SafeAreaView>
}

const styles = StyleSheet.create({
  wrapper: {
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