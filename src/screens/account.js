import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'
import { Button, Card, Paragraph } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function Account() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(false)

    const getData = async () => {
        const querySnap = await firestore().collection('ads')
            .where('uid', '==', auth().currentUser.uid)
            .get()
        const res = querySnap.docs.map(docsSnap => docsSnap.data())
        setItems(res)
    }
    useEffect(() => {
        getData()
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <View style={{ height: "40%", justifyContent: "space-evenly", alignItems: "center" }}>
                <View style={styles.avatar}>
                    <AntDesign style={styles.icon} name="user" color="#333" size={50} />
                </View>
                <Text style={{ fontSize: 22 }}>{auth().currentUser.email}</Text>
                <Button style={{ marginHorizontal: 90, borderRadius: 12 }} mode="contained" onPress={() => auth().signOut()}>
                    logout
                </Button>
                <Text style={{ fontSize: 22 }}>your ads</Text>
            </View>
            <FlatList
                data={items.reverse()}
                renderItem={({ item }) =>
                    <Card style={styles.card}>
                        <Card.Title title={item.name} />
                        <Card.Content>
                            <Paragraph>{item.desc}</Paragraph>
                            <Paragraph>Year Of purchase :{item.year}</Paragraph>
                        </Card.Content>
                        <Card.Cover source={{ uri: item.image }} />
                        <Card.Actions>
                            <Button>₹ {item.price}</Button>
                        </Card.Actions>
                    </Card>
                }
                keyExtractor={(item) => item.id}
                onRefresh={() => {
                    setLoading(true)
                    getData()
                    setLoading(false)
                }}
                refreshing={loading}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    card: {
        margin: 10,
        elevation: 4
    },
    avatar: {
        marginHorizontal: 5,
        borderWidth: 15,
        borderRadius: 50,
        borderColor: "#ffff",
        elevation: 8
    },
    icon: {
        borderColor: "#ffff",
        backgroundColor: "#ffff"
    }
});