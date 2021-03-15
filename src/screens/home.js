import React, { useEffect, useState } from 'react'
import { View, FlatList, StyleSheet, Linking, Platform } from 'react-native';
import { Button, Card, Paragraph } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

export default function Home() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(false)

    const getData = async () => {
        const querySnap = await firestore().collection('ads').get()
        const res = querySnap.docs.map(docsSnap => docsSnap.data())
        setItems(res)
    }
    useEffect(() => {
        getData()
    }, [])

    const openDial = (phone) => {
        if (Platform.OS === 'android') {
            Linking.openURL(`tel:${phone}`)
        } else {
            Linking.openURL(`telprompt:${phone}`)
        }
    }
    return (
        <View>
            <FlatList
                data={items.reverse()}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) =>
                    <Card style={styles.card}>
                        <Card.Title title={item.name} />
                        <Card.Content>
                            <Paragraph>{item.desc}</Paragraph>
                            <Paragraph>Year Of purchase : {item.year}</Paragraph>
                        </Card.Content>
                        <Card.Cover source={{ uri: item.image }} />
                        <Card.Actions>
                            <Button>₹ {item.price}</Button>
                            <Button onPress={() => openDial(item.phone)}>Call seller</Button>
                        </Card.Actions>
                    </Card>
                }
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
    }
});