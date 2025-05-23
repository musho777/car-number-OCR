import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Color } from "../../constants"
import { Swipeable } from "react-native-gesture-handler";
import { DelateSvg, EditSvg, Reject, Success } from "../../../assets/svg";
import { Alert } from 'react-native';
import { db } from "../../database";
import { useNavigation } from "@react-navigation/native";

const width = Dimensions.get("window").width - 20

export const Item = ({ number, image, date, id, delate, upload, number1 }) => {
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
  // renderLeftActions={() => LeftAction(id, number)}
  >
    <View style={styles.item}>
      <View style={styles.info}>
        <View>
          <Text style={{ fontWeight: "700", fontSize: 16 }} >{number || "NOT DECODED"}</Text>
          {number1 && <Text style={{ fontWeight: "700", fontSize: 16 }}>{number1 || "NOT DECODED"}</Text>}
        </View>
        <View>
          <Text>Uploaded {formattedDate}</Text>
          <Text style={{ fontSize: 18, marginTop: 15 }}>Image: {JSON.parse(image).length}</Text>
        </View>
      </View>
      <View style={[styles.image, { position: 'relative' }]}  >
        <Image source={{ uri: JSON.parse(image)[0]?.file }} style={styles.image} />
        <View style={{ position: "absolute", bottom: -10, right: -10 }}>
          {upload === 0 ?
            <View style={styles.status}>
              <Reject />
            </View> :
            <View style={styles.status}>
              <Success />
            </View>
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
    width: width / 2 - 30,
    height: 100,
    borderRadius: 5,
  },
  action: {
    justifyContent: 'center',
    width: 80,
    alignItems: 'center'
  },
  status: {
    shadowColor: "#000000",
    padding: 10,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 5,
    borderWidth: 1,
    borderColor: "white",
    backgroundColor: "white",
    borderRadius: 99999
  }
})