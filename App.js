/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react'
import { TouchableOpacity, Platform, StyleSheet, Text, View } from 'react-native'
import ImagePicker from 'react-native-image-picker'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' + 'Shake or press menu button for dev menu',
})

type Props = {}
export default class App extends Component<Props> {
  addImage = () => {
    ImagePicker.showImagePicker(
      {
        title: 'selectAvatar',
        cancelButtonTitle: 'cancel',
        takePhotoButtonTitle: 'takePhoto',
        chooseFromLibraryButtonTitle: 'chooseFromLibrary',
        permissionDenied: {
          title: 'permissionDenied',
          text: 'permissionDeniedInfo',
          reTryTitle: 'retry',
          okTitle: 'iAmSure',
        },
        cameraType: 'front',
        mediaType: 'photo',
        allowsEditing: true,
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      },
      async response => {
        const { fileName, uri } = response
        const id = '5b677d25c910920004c6802e'
        const cutName = fileName.split('.')
        const fileType = ['jpg', 'jpeg'].includes(cutName[cutName.length - 1].toLowerCase())
          ? 'jpeg'
          : 'png'
        const mimeType = `image/${fileType}`
        const data = await fetch(
          `http://localhost:5000/presigned_url?objectName=${fileName}&contentType=${mimeType}&id=${id}&type=users`,
        ).then(response => {
          return response.json()
        })
        fetch(data.signedUrl, {
          method: 'PUT',
          headers: {
            'content-type': mimeType,
          },
          body: uri,
        })
          .then(response => {
            console.log(response)
            console.log(`https://<BUCKET>.s3.amazonaws.com/users/${id}/files/${fileName}`)
          })
          .catch(e => console.log('UPLOAD FAILED', e))
      },
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.addImage}>
          <Text>Add image</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
})
