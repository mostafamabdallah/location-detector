import { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import axios from "axios";

const LOCATION_TASK_NAME = "background-location-task";

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error("An error occurred:", error);
    return;
  }
  if (data) {
    const { locations } = data;
    console.log("Received new locations", locations);
    // Handle location updates here, such as sending them to a server.
  }
});

const App = () => {
  const [inputValue, setInputValue] = useState("");
  const [location, setLocation] = useState(null);

  const handleInputChange = (text) => {
    setInputValue(text);
  };

  const handleButtonPress = async () => {
    console.log(inputValue);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }

    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.BestForNavigation,
      timeInterval: 1000, // Fetch location every second
      distanceInterval: 1, // Fetch location when the device moves at least 1 meter
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (location) {
        try {
          const response = await axios.put(
            `https://taswika.vercel.app/api/employees/${inputValue}/?type=update_location`,
            location
          );
          console.log(response.data);
        } catch (error) {
          console.log(error);
        }
      }
    };

    const interval = setInterval(fetchData, 1000); // Fetch data every 1 second

    return () => {
      clearInterval(interval); // Cleanup interval on unmount
    };
  }, [location, inputValue]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={handleInputChange}
        value={inputValue}
        placeholder="Enter text..."
        keyboardType="numeric"
      />
      <Button title="Submit" onPress={handleButtonPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 20,
  },
});

export default App;
