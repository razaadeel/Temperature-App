import React from 'react';
import { StyleSheet, Text, View, Alert, BackHandler, PermissionsAndroid } from 'react-native';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Weather from './components/weather';
import { API_KEY } from './components/weatherAPI';
import Loader from './components/Loader';
import Geolocation from 'react-native-geolocation-service';


export default class App extends React.Component {
  state = {
    isLoading: true,
    temperature: 0,
    weatherCondition: null
  };

  async componentDidMount() {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the location");
        this.getPosition();
      } else {
        console.log("location permission denied");
      }
    } catch (err) {
      console.warn(err)
    }


  }

  getPosition = () => {
    RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 })
      .then(data => {
        Geolocation.getCurrentPosition(
          position => {
            this.fetchWeather(position.coords.latitude, position.coords.longitude);
          },
          error => {
            alert(error.message);
          }
        );
      }).catch(err => {
        alert(err.message);
      });
  }

  fetchWeather(lat = 15, lon = 15) {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=metric`
    )
      .then(res => res.json())
      .then(json => {
        console.log(json)
        this.setState({
          temperature: json.main.temp,
          weatherCondition: json.weather[0].main,
          isLoading: false
        });
      })
      .catch(err => {
        Alert.alert(
          'Error',
          err.message,
          [{ text: 'OK', onPress: () => BackHandler.exitApp() }]
        )
      })
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.isLoading ?
          <View style={styles.container}>
            <Loader />
            <Text style={{ color: '#ffffff', fontSize: 20 }}>Fething Weather</Text>
          </View>
          :
          <Weather weather={this.state.weatherCondition} temperature={this.state.temperature} />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3498DB',
    justifyContent: 'center',
    alignItems: 'center',
  }
});