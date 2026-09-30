import React, { useEffect } from 'react'
import { Modal, View, Text, StyleSheet } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
import { BlurView } from 'expo-blur'
import { Colors } from '@/constants/Colors'
import { GlassSurface } from './glass-view'
import { Button } from './button'
import { Motion, Radius, Spacing, Typography } from '@/constants/Theme'

interface CustomAlertProps {
    visible: boolean;
    title: string;
    message: string;
    confirmText?: string;
    denyText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onDeny?: () => void;
    onCancel?: () => void;
    theme?: 'light' | 'dark';
}

const CustomAlert: React.FC<CustomAlertProps> = ({
                                                     visible,
                                                     title,
                                                     message,
                                                     confirmText = 'Aceptar',
                                                     denyText = 'Denegar',
                                                     cancelText = 'Cancelar',
                                                     onConfirm,
                                                     onDeny,
                                                     onCancel,
                                                     theme = 'light',
                                                 }) => {
    const currentColors = Colors[theme]
    const scale = useSharedValue(0.9)
    const opacity = useSharedValue(0)

    useEffect(() => {
        if (visible) {
            scale.value = withSpring(1, Motion.spring)
            opacity.value = withTiming(1, { duration: Motion.durationFast })
        } else {
            scale.value = 0.9
            opacity.value = 0
        }
    }, [visible])

    const cardStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
    }))

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onCancel}
        >
            <BlurView
                intensity={30}
                tint={theme}
                style={[StyleSheet.absoluteFill, {backgroundColor: currentColors.backdrop}]}
            >
                <View style={styles.centeredView}>
                    <Animated.View style={[styles.alertWrapper, cardStyle]}>
                        <GlassSurface tint={theme} radius={Radius.xl} style={styles.alertContainer}>
                            <Text style={[styles.title, {color: currentColors.text}]}>{title}</Text>
                            <Text style={[styles.message, {color: currentColors.textSecondary}]}>{message}</Text>

                            <View style={styles.buttonsContainer}>
                                <Button label={cancelText} variant="secondary" onPress={onCancel ?? (() => {})} />

                                {onDeny && (
                                    <Button
                                        label={denyText}
                                        onPress={onDeny}
                                        style={{ backgroundColor: currentColors.error }}
                                    />
                                )}

                                <Button label={confirmText} onPress={onConfirm ?? (() => {})} />
                            </View>
                        </GlassSurface>
                    </Animated.View>
                </View>
            </BlurView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.lg,
    },
    alertWrapper: {
        width: '100%',
    },
    alertContainer: {
        padding: Spacing.lg,
    },
    title: {
        ...Typography.title,
        marginBottom: Spacing.xs,
        textAlign: 'center',
    },
    message: {
        ...Typography.body,
        marginBottom: Spacing.lg,
        textAlign: 'center',
    },
    buttonsContainer: {
        gap: Spacing.sm,
    },
})

export default CustomAlert
