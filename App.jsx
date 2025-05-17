import 'react-native-gesture-handler';
import 'react-native-reanimated';
import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Navigation } from './navigation';

function App() {
  return (
    <GestureHandlerRootView style={styles.wrapper}>
      <Navigation />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'white'
  }
});

export default App;
