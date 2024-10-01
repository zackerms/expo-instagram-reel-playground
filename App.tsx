import { ReactNode, useEffect, useRef, useState } from 'react';
import {
    FlatList,
    Image,
    LayoutChangeEvent,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Pressable,
    StyleSheet,
    View
} from 'react-native';

type Item = {
    id: number;
    imageUrl: string;
};

const data: Item[] = Array.from({ length: 10 }).map((_, index) => ({
    id: index,
    imageUrl: `https://picsum.photos/id/${index + 1}/800/1600`,
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
    const [currentPageIndex, setCurrentPageIndex] = useState(0);

    const handleOnLayout = (event: LayoutChangeEvent) => {
        const { height } = event.nativeEvent.layout;
        setScreenHeight(height);
    }

    // ================================
    // タップでページング

    const flatListRef = useRef<FlatList>(null);

    const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {

        const { contentOffset } = e.nativeEvent;
        const currentPage = Math.floor(contentOffset.y / screenHeight);
        if (currentPage >= 0 && currentPage <= data.length - 1) {
            setCurrentPageIndex(currentPage);
        }
    };

    const onTapPrev = () => {
        const isFirstPage = currentPageIndex === 0;
        if (isFirstPage) {
            return;
        }

        flatListRef.current?.scrollToIndex({
            index: currentPageIndex - 1,
            animated: true,
        });
    }

    const onTapNext = () => {
        const isLastPage = currentPageIndex === data.length - 1;
        if (isLastPage) {
            return;
        }

        flatListRef.current?.scrollToIndex({
            index: currentPageIndex + 1, animated: true,
        });
    };

    // タップでページング
    // ================================

    return (<View style={styles.container} onLayout={handleOnLayout}>
        <FlatList
            ref={flatListRef}
            data={data}
            disableIntervalMomentum={true}
            numColumns={1}
            horizontal={false}
            scrollEnabled={true}
            snapToInterval={screenHeight}
            pagingEnabled={true}
            initialScrollIndex={0}
            scrollEventThrottle={16}
            onScroll={onScroll}
            getItemLayout={(_, index) => ({
                index,
                length: screenHeight,
                offset: screenHeight * index,
            })}
            renderItem={({ item, index }) => (<View
                key={index}
                style={{ width: "100%", height: screenHeight }}
            >
                <TapPager
                    onPrev={onTapPrev}
                    onNext={onTapNext}
                >
                    <Image
                        source={{ uri: item?.imageUrl }}
                        style={styles.image}
                    />
                </TapPager>
            </View>)}
        />
    </View>);
}

function TapPager({
    onPrev, 
    onNext, 
    children
}: {
    onPrev: () => void; 
    onNext: () => void; 
    children?: ReactNode;
}) {
    return <View style={styles.tapPagerContainer}>
        {children}
        <View style={styles.tapPager}>
            <TapPagerButton onPress={onPrev} />
            <TapPagerButton onPress={onNext} />
        </View>
    </View>
}

function TapPagerButton({
    onPress
}: {
    onPress: () => void;
}) {
    return <Pressable
        style={({ pressed }) => [
            styles.tapPagerButton,
            {
                backgroundColor: pressed ? 'rgba(0, 0, 0, 0.6)' : 'transparent'
            }
        ]}
        onPress={onPress}
    />
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
    },
    tapPagerContainer: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    tapPager: {
        display: 'flex',
        flexDirection: 'row',
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
    tapPagerButton: {
        height: "100%",
        flex: 1,
    },
});
