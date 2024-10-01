import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, Image, LayoutChangeEvent } from 'react-native';

type Item = {
  id: number;
  imageUrl: string;
};

const data: Item[] = Array.from({ length: 10 }).map((_, index) => ({
  id: index,
  imageUrl: `https://picsum.photos/id/${index + 1}/800/1600`
}));

export default function App() {
  useEffect(() => {
    // fetch all data
    Promise.all(data.map(item => fetch(item.imageUrl))).then(() => console.log('All images are fetched'));
  }, []);
  return <Reel />
}

function Reel() {
  const [screenHeight, setScreenHeight] = useState(0);

  const handleOnLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setScreenHeight(height);
  }

  return (
    <View style={styles.container} onLayout={handleOnLayout}>
      <FlatList
        data={data}
        disableIntervalMomentum={true}
        numColumns={1}
        horizontal={false}
        scrollEnabled={true}
        snapToInterval={screenHeight}
        pagingEnabled={true}
        initialScrollIndex={0}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({
          index,
          length: screenHeight,
          offset: screenHeight * index,
        })}
        renderItem={({ item, index }) => (
          <View
            key={index}
            style={{ width: "100%", height: screenHeight }}
          >
            <Image
              source={{ uri: item?.imageUrl }}
              style={styles.image}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  reelItem: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  }
});
