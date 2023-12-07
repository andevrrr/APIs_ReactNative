import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Linking } from 'react-native';
import * as Location from 'expo-location';
import * as Battery from 'expo-battery';

const App = () => {
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [batteryLevel, setBatteryLevel] = useState(null);

  useEffect(() => {
    requestLocationPermission();
    subscribeToBatteryLevel();
    getBatteryLevel();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        getCurrentLocation();
      } else {
        console.log('Location permission denied');
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = location.coords;
      setLocation({ latitude, longitude });
    } catch (error) {
      console.error('Error getting current location:', error);
    }
  };

  const openMaps = () => {
    const { latitude, longitude } = location;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  const makePhoneCall = () => {
    if (phoneNumber) {
      const telUrl = `tel:${phoneNumber}`;
      Linking.openURL(telUrl);
    } else {
      console.log('Please enter a valid phone number');
    }
  };

  const subscribeToBatteryLevel = () => {
    Battery.addBatteryLevelListener(({ batteryLevel }) => {
      setBatteryLevel(batteryLevel * 100);
    });
  };

  const getBatteryLevel = async () => {
    try {
      const batteryInfo = await Battery.getBatteryLevelAsync();
      setBatteryLevel(batteryInfo * 100);
    } catch (error) {
      console.error('Error getting battery level:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text>Latitude: {location.latitude}</Text>
        <Text>Longitude: {location.longitude}</Text>
      </View>

      <View style={styles.section}>
        <Button title="Open Maps" onPress={openMaps} />
      </View>

      <View style={styles.section}>
        <TextInput
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          onChangeText={(text) => setPhoneNumber(text)}
          style={styles.input}
        />
        <Button title="Make Phone Call" onPress={makePhoneCall} />
      </View>

      <View style={styles.section}>
        <Text>Battery Level: {batteryLevel !== null ? `${batteryLevel.toFixed(2)}%` : 'Loading...'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 16,
  },
  section: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 20,
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginBottom: 8,
  },
});

export default App;