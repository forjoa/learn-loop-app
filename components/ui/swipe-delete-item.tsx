import React, { useRef, ReactNode } from 'react'
import { View, Text, StyleSheet, I18nManager } from 'react-native'

import Swipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable'

import Animated, {
    useAnimatedStyle,
    interpolate,
    Extrapolation,
    SharedValue,
} from 'react-native-reanimated'
import Feather from '@expo/vector-icons/Feather'

// const SCREEN_WIDTH = Dimensions.get('window').width
const RIGHT_ACTION_WIDTH = 80
const SWIPE_THRESHOLD = RIGHT_ACTION_WIDTH * 0.7

interface SwipeToDeleteItemProps {
    children: ReactNode;
    onDelete: () => void;
}

const RightActionComponent: React.FC<{
    dragX: SharedValue<number>;
}> = ({dragX}) => {

    const animatedIconStyle = useAnimatedStyle(() => {
        const iconScale = interpolate(
            dragX.value,
            [-RIGHT_ACTION_WIDTH - 20, -RIGHT_ACTION_WIDTH, -SWIPE_THRESHOLD, 0],
            [1.1, 1, 0.8, 0.6],
            Extrapolation.CLAMP
        )

        const iconOpacity = interpolate(
            dragX.value,
            [-RIGHT_ACTION_WIDTH, -SWIPE_THRESHOLD, -SWIPE_THRESHOLD / 1.5, 0],
            [1, 0.9, 0.3, 0],
            Extrapolation.CLAMP
        )

        return {
            opacity: iconOpacity,
            transform: [{scale: iconScale}],
        }
    })

    return (
        <View style={styles.rightActionBackground}>
            <Animated.View style={[styles.rightActionContent, animatedIconStyle]}>
                <Text style={styles.rightActionIcon}>
                    <Feather name={'trash'} size={28}/>
                </Text>
            </Animated.View>
        </View>
    )
}

const SwipeToDeleteItem: React.FC<SwipeToDeleteItemProps> = ({
                                                                 children,
                                                                 onDelete,
                                                             }) => {
    const swipeableRef = useRef<SwipeableMethods>(null)

    const handleSwipeOpen = (direction: 'left' | 'right') => {
        if (direction === 'left') {
            if (onDelete) {
                onDelete()
            }
        }
    }

    const renderRightActionsHandler = (
        progress: SharedValue<number>,
        dragX: SharedValue<number>
    ): ReactNode => {
        return <RightActionComponent dragX={dragX}/>
    }

    return (
        <Swipeable
            ref={swipeableRef}
            renderRightActions={renderRightActionsHandler}
            onSwipeableOpen={handleSwipeOpen}
            rightThreshold={SWIPE_THRESHOLD}
            friction={1}
            overshootRight={false}
            containerStyle={styles.swipeableContainer}
            enableTrackpadTwoFingerGesture
        >
            {children}
        </Swipeable>
    )
}

const styles = StyleSheet.create({
    swipeableContainer: {},
    rightActionBackground: {
        backgroundColor: '#FF3B30',
        justifyContent: 'center',
        alignItems: I18nManager.isRTL ? 'flex-start' : 'flex-end',
        width: RIGHT_ACTION_WIDTH,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        marginLeft: -20
    },
    rightActionContent: {
        paddingHorizontal: 20,
    },
    rightActionIcon: {
        color: 'white',
    },
})

export default SwipeToDeleteItem