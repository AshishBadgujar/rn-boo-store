import React, { useState } from 'react'
import { View, StyleSheet, Text, KeyboardAvoidingView, Image, TouchableOpacity, Alert } from 'react-native'
import { TextInput, Button } from 'react-native-paper';
import auth from '@react-native-firebase/auth';

export default function Signup({ navigation }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const onSignup = async () => {
        if (!email || !password) {
            Alert.alert("Please fill all the fields!")
            return
        }
        try {
            await auth().createUserWithEmailAndPassword(email, password)
        } catch (err) {
            Alert.alert('Something went wrong ,Please try with different Password.')
        }
    }
    return (
        <KeyboardAvoidingView behavior="position">
            <View style={styles.box1}>
                <Image style={{ height: 200, opacity: 0.4 }} source={require('../assets/cnqlogo.png')} />
                <Text style={styles.text}>Signup Here !</Text>
            </View>

            <View style={styles.box2}>
                <TextInput
                    label="Email"
                    value={email}
                    mode="outlined"
                    onChangeText={email => setEmail(email)}
                />
                <TextInput
                    label="Password"
                    value={password}
                    mode="outlined"
                    onChangeText={password => setPassword(password)}
                />
                <Button style={{ marginHorizontal: 70, borderRadius: 12 }} mode="contained" onPress={() => onSignup()}>
                    signup
                </Button>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={{ textAlign: "center" }}>
                        Already have an account ?
                        <Text style={{ color: "blue" }}> login</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    box1: {
        alignItems: "center",
        backgroundColor: "black",
        height: 200
    },
    text: {
        marginTop: -120,
        fontSize: 30,
        color: "#ffff"
    },
    box2: {
        paddingHorizontal: 40,
        height: "60%",
        justifyContent: "space-evenly"
    }
});