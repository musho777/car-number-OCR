import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Color } from "../../constants"
import { Swipeable } from "react-native-gesture-handler";
import { DelateSvg, EditSvg, Reject, Success } from "../../../assets/svg";
import { Alert } from 'react-native';
import { db } from "../../database";
import { useNavigation } from "@react-navigation/native";

const width = Dimensions.get("window").width - 20

export const Item = ({ number, image, date, id, delate, upload, name }) => {
  const navigation = useNavigation()
  const formattedDate = new Date(date).toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const RightActions = (id) => (
    <TouchableOpacity
      onPress={() => delate(id)}
      style={[{ backgroundColor: Color.red }, styles.action]}>
      <DelateSvg />
    </TouchableOpacity>
  );
  const LeftAction = (id, text) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("edit", {
        id,
        number,
      })}
      style={[{ backgroundColor: Color.green }, styles.action]}>
      <EditSvg />
    </TouchableOpacity>
  );



  return <Swipeable
    renderRightActions={() => RightActions(id)}
    renderLeftActions={() => LeftAction(id, number)}
  >
    <View style={styles.item}>
      <View style={styles.info}>
        <View>
          <Text>{number || "NOT DECODED"}</Text>
        </View>
        <View>
          <Text>Uploaded {formattedDate}</Text>
          <Text>Image: {JSON.parse(image).length}</Text>
        </View>
      </View>
      <View style={[styles.image, { position: 'relative' }]}  >
        <Image source={{ uri: JSON.parse(image)[0].file }} style={styles.image} />
        <View style={{ position: "absolute", bottom: 0, right: 0 }}>
          {upload === 0 ?
            <Reject /> :
            <Success />
          }
        </View>
      </View>
    </View>
  </Swipeable>
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: Color.itemBorder,
    zIndex: 9,
    backgroundColor: 'white'
  },
  info: {
    gap: 10,
    width: width / 2
  },
  image: {
    width: width / 2 - 50,
    height: 100,
    borderRadius: 20,
  },
  action: {
    justifyContent: 'center',
    width: 80,
    alignItems: 'center'
  }
})