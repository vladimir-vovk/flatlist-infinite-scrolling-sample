import React, { useState, useEffect } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import axios from 'axios'

const ITEM_HEIGHT = 40

const styles = StyleSheet.create({
  flatlist: {
    flex: 1
  },
  content: {
    padding: 16
  },
  card: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'gray'
  },
  loadingMore: {
    padding: 8
  }
})

type Country = {
  name: string
}

type RenderItemArgs = {
  item: Country
  index: number
}

const ENDPOINT = 'https://vvovk-countries-api.herokuapp.com/countries'
const LIMIT = 20

export default function App() {
  const [data, setData] = useState<Country[]>([])
  const [total, setTotal] = useState(0)
  const [isLoadingMore, setLoadingMore] = useState(false)
  const [offset, setOffset] = useState(0)

  const endpointWithParams = () => `${ENDPOINT}?offset=${offset}&limit=${LIMIT}`

  const fetchMoreData = () => {
    setLoadingMore(true)
    axios
      .get(endpointWithParams())
      .then((response) => {
        /*
        Response: {
          total: number
          data: [
            { name: string }
          ]
        }
      */
        setTotal(response?.data?.total)
        setOffset(offset + LIMIT)

        const countries = response?.data?.data
        setData([...data, ...countries])
        setLoadingMore(false)
      })
      .catch((err) => {
        console.log('Request error:', err)
      })
  }

  useEffect(() => {
    fetchMoreData()
  }, [])

  const renderItem = ({ item, index }: RenderItemArgs) => {
    const { name } = item

    return (
      <View style={styles.card}>
        <Text>{`${index} - ${name}`}</Text>
      </View>
    )
  }

  const keyExtractor = (item: Country) => item.name

  const onEndReachedThreshold = 0.1

  const onEndReached = () => {
    if (offset + 1 < total) {
      fetchMoreData()
    }
  }

  const ListFooterComponent = () => {
    if (isLoadingMore) {
      return (
        <View style={styles.loadingMore}>
          <ActivityIndicator />
        </View>
      )
    }

    return <></>
  }

  return (
    <FlatList
      style={styles.flatlist}
      contentContainerStyle={styles.content}
      {...{
        renderItem,
        keyExtractor,
        data,
        onEndReachedThreshold,
        onEndReached,
        ListFooterComponent
      }}
    />
  )
}
