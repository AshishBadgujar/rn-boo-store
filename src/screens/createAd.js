import React, { useState } from 'react'
import { View, StyleSheet, Text, Alert } from 'react-native'
import { Modal, Portal, Button, TextInput } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

export default function CreateAd() {
    const [visible, setVisible] = useState(false)
    const [name, setName] = useState('')
    const [desc, setDesc] = useState('')
    const [year, setYear] = useState('')
    const [price, setPrice] = useState('')
    const [phone, setPhone] = useState('')
    const [image, setImage] = useState('')

    const onSubmit = async () => {
        if (!name || !desc || !price || !year || !phone) {
            Alert.alert("Please fill all the fields!")
            return
        }
        try {
            await firestore().collection('ads')
                .add({
                    id: String(Date.now()),
                    name,
                    desc,
                    year,
                    price,
                    phone,
                    image,
                    uid: auth().currentUser.uid
                })
            Alert.alert('Congrats! your add is now live.')
            setDesc('')
            setImage('')
            setName('')
            setPhone('')
            setPrice('')
            setYear('')
        } catch (err) {
            Alert.alert('Something went wrong.')
        }
    }

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const openGallery = () => {
        setVisible(false)
        launchImageLibrary({ quality: 0.5 }, (fileobj) => {
            uploadFile(fileobj)
        })
    }
    const openCamera = () => {
        setVisible(false)
        launchCamera({ quality: 0.5 }, (fileobj) => {
            uploadFile(fileobj)
        })
    }
    const uploadFile = (fileObj) => {
        if (fileObj.didCancel) {
            return
        } else {
            const uploadTask = storage().ref().child(`/items/${Date.now()}`).putFile(fileObj.uri)
            uploadTask.on('state_changed',
                (snapshot) => {
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes);
                    if (progress == 1) { Alert.alert('Uploaded Sucessfully!') }
                },
                (error) => {
                    Alert.alert('something went wrong.')
                },
                () => {
                    uploadTask.snapshot.ref.getDownloadURL().then((downloadedURL) => {
                        setImage(downloadedURL)
                    })
                }
            )
        }
    }
    const containerStyle = { backgroundColor: 'white', padding: 20 };
    return (
        <View style={styles.container}>
            <Portal>
                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                    <View>
                        <Button icon="camera" style={{ marginBottom: 10, borderRadius: 12 }} mode="contained" onPress={() => openCamera()}>
                            Camera
                    </Button>
                        <Button style={styles.btn} mode="contained" onPress={() => openGallery()}>
                            Gallery
                    </Button>
                    </View>
                </Modal>
            </Portal>
            <Text style={styles.text}>Create Ad</Text>
            <TextInput
                label="Ad title"
                value={name}
                mode="outlined"
                onChangeText={name => setName(name)}
            />
            <TextInput
                label="Describe about your books"
                value={desc}
                numberOfLines={3}
                multiline={true}
                mode="outlined"
                onChangeText={desc => setDesc(desc)}
            />
            <TextInput
                label="Year of purchase"
                value={year}
                mode="outlined"
                keyboardType="numeric"
                onChangeText={year => setYear(year)}
            />
            <TextInput
                label="Price"
                value={price}
                mode="outlined"
                keyboardType="numeric"
                onChangeText={price => setPrice(price)}
            />
            <TextInput
                label="Your contact number"
                value={phone}
                mode="outlined"
                keyboardType="numeric"
                onChangeText={phone => setPhone(phone)}
            />
            <Button style={styles.btn} icon="camera" mode="contained" onPress={showModal}>
                Upload image
                </Button>
            <Button style={styles.btn} disabled={image ? false : true} mode="contained" onPress={() => onSubmit()}>
                post
                </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 30,
        justifyContent: "space-evenly"
    },
    text: {
        textAlign: "center",
        fontSize: 22
    },
    btn: {
        borderRadius: 12
    }
});