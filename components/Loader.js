import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Spinner from 'react-native-spinkit'

export default class Loader extends React.Component{
render(){
    return(
        <View>
            <Spinner size={60} type="Bounce" color="#FFFFFF"/>
        </View>
    )
}
}