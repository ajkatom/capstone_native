/* eslint-disable */
import React from 'react';
import { View, Text, StyleSheet, TextInput, Button, KeyboardAvoidingView, AsyncStorage, TouchableOpacity } from 'react-native';
import socket from '../socket-client';
window.navigator.userAgent = "react-native";

class TeamName extends React.Component {
  constructor() {
    super()
    this.state = { name: '' }
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount() {
    socket.emit('get bar name')
    socket.once('sending bar name', (bar) => {
      AsyncStorage.setItem('bar_name', bar.name)
    })
  }

  onSubmit() {
    const { name } = this.state
    Promise.all([ AsyncStorage.getItem('bar_id') ])
      .then(([ bar_id ]) => {
        socket.emit('choose team name', { name, bar_id })
        socket.on('team register', (name) => {
          console.log(`component from socket: team ${name}`)
        })
      })
    AsyncStorage.setItem('team_name', name)
    this.props.navigation.navigate('PregameCountdown', { name })
  }

  render() {
    const { name } = this.state
    const { onSubmit } = this
    const noName = name.length < 4
    return (
      <KeyboardAvoidingView style={ styles.container} behavior="padding" enabled>
        <Text style={ styles.h1 }>Team Name</Text>
        <Text style={ styles.h2 }>Choose your team name</Text>
        <View style={ styles.inputContainer }>
          <TextInput
            onChangeText={(name) => this.setState({ name })}
            style={ styles.input }
            autoFocus
            value={ name }
            placeholder="Team name"
            maxLength={25}
            onSubmitEditing={ onSubmit }
            autoCapitalize="words"
          />
        </View>
        <View style={ styles.button }>
          <TouchableOpacity style={[styles.submitView, { backgroundColor: noName ? '#4591AF' : '#006992' }]} disabled={noName} title="Submit" onPress={onSubmit}>
            <Text style={styles.submitButton}>Submit</Text>
          </TouchableOpacity>
        </View>
        <Text style={ styles.h3 }>Be careful: once you submit, no edits</Text>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
    backgroundColor: '#E7F1F5',
  },
  h1: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#27476E',
  },
  h2: {
    fontSize: 20,
    paddingTop: 20,
    paddingBottom: 40,
    textAlign: 'center',
    color: '#27476E',
  },
  h3: {
    fontSize: 14,
    paddingTop: 20,
    textAlign: 'center',
    color: '#27476E',
  },
  input: {
    fontSize: 20,
    textAlign: 'center',
    color: '#27476E',
  },
  inputContainer: {
    paddingTop: 10,
    paddingRight: 20,
    paddingBottom: 10,
    paddingLeft: 20,
    backgroundColor: '#fff',
    borderRadius: 5
  },
  button: {
    paddingTop: 50
  },
  submitView: {
    borderRadius: 30,
    width: 160,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#006992',
  },
  submitButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 10,
    paddingBottom: 10,
  }
})

export default TeamName;
