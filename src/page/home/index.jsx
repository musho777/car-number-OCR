import { View, SafeAreaView, TouchableOpacity, StyleSheet, Text, FlatList, Alert } from "react-native"
import { Item } from "../../components/item"
import { Color } from "../../constants"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { useCallback, useEffect, useState } from "react";
import { db } from "../../database";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const Home = () => {
  const [dataList, setDataList] = useState([])
  const navigation = useNavigation()
  const [token, setToken] = useState()

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

  const getNotUploadedData = () => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM my_table WHERE upload = 0',
          [],
          (txObj, result) => {
            const items = [];
            for (let i = 0; i < result.rows.length; i++) {
              items.push(result.rows.item(i));
            }
            resolve(items);
          },
          (txObj, error) => {
            reject(error);
          }
        );
      });
    });
  };


  useEffect(() => {
    let isCancelled = false;

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const startUploading = async () => {
      while (!isCancelled) {
        const rows = await getNotUploadedData();
        if (!rows || rows.length === 0) {
          await sleep(1000);
          continue;
        }

        const date = new Date().toISOString().split('T')[0];

        for (const row of rows) {
          if (isCancelled) break;

          const imageData = {
            value: row.text,
            upload_date: date,
            images: JSON.parse(row.imageUri)
          };

          try {
            const response = await fetch('https://xn----nbck7b7ald8atlv.xn--y9a3aq/iosapp.loc/public/api/uploadImageCar', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(imageData)
            });

            if (response.ok) {
              db.transaction(tx => {
                tx.executeSql(
                  'UPDATE my_table SET upload = 1 WHERE id = ?',
                  [row.id], // update only the specific row
                  () => console.log(`Uploaded and updated row with ID ${row.id}`),
                  (txObj, err) => console.log('Error updating row:', err)
                );
              });
              fetchData();
            } else {
              console.log('Upload failed for row, will retry later.');
            }
          } catch (err) {
            console.error('Network error:', err);
          }

          await sleep(2500);
        }
      }
    };

    startUploading();

    return () => {
      isCancelled = true;
    };
  }, [token]);


  // useEffect(() => {
  //   const interval = setInterval(async () => {
  //     const rows = await getNotUploadedData();
  //     if (rows?.length === 0) return;

  //     const date = new Date();
  //     const isoDate = date.toISOString().split('T')[0];

  //     const images = rows.map((row, index) => ({
  //       value: row.text,
  //       upload_date: isoDate,
  //       images: JSON.parse(row.imageUri)
  //     }));

  //     const response = await fetch('https://xn----nbck7b7ald8atlv.xn--y9a3aq/iosapp.loc/public/api/uploadImageCar', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}`
  //       },
  //       body: JSON.stringify(images[0])
  //     });
  //     if (!response.ok) {
  //       console.log('Server responded with error, keeping items as not uploaded.');
  //       return;
  //     }

  //     db.transaction(tx => {
  //       tx.executeSql(
  //         'UPDATE my_table SET upload = 1 WHERE upload = 0',
  //         [],
  //         () => console.log('Successfully updated all rows to upload=1'),
  //         (txObj, err) => console.log('Error updating rows:', err)
  //       );
  //     });
  //     fetchData()
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, [token]);

  const getToken = async () => {
    let t = await AsyncStorage.getItem("token")
    setToken(t)
  }

  useEffect(() => {
    getToken()
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS my_table (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          text TEXT,
          imageUri TEXT,
          createat TEXT,
          upload INTEGER DEFAULT 0
        )`,
        [],
        () => {
          console.log('Table created successfully');
        },
        (error) => {
          console.log('Error creating table: ', error);
        }
      );
    });
  }, []);


  return <SafeAreaView style={{ flex: 1 }}>
    <View style={styles.wrapper}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={dataList}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <Item
          delate={(id) => confirmDelete(id)}
          id={item.id}
          name={item.name}
          image={item.imageUri}
          number={item.text}
          date={item.createat}
          upload={item.upload}
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