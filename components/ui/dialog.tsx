import React from 'react'
import { Modal, View, Text, TouchableOpacity, StyleSheet, Platform, ColorSchemeName } from 'react-native'
import { BlurView } from 'expo-blur'
import { Colors } from '@/constants/Colors'

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

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onCancel}
        >
            <BlurView
                intensity={Platform.OS === 'ios' ? 30 : 20}
                tint={theme === 'dark' ? 'dark' : 'light'}
                style={[StyleSheet.absoluteFill, {backgroundColor: currentColors.backdrop}]}
            >
                <View style={styles.centeredView}>
                    <View style={[styles.alertContainer, {backgroundColor: currentColors.card}]}>
                        <Text style={[styles.title, {color: currentColors.text}]}>{title}</Text>
                        <Text style={[styles.message, {color: currentColors.textSecondary}]}>{message}</Text>

                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    {
                                        backgroundColor: currentColors.nav.background,
                                        borderWidth: 1,
                                        borderColor: currentColors.nav.border
                                    }
                                ]}
                                onPress={onCancel}
                            >
                                <Text style={[styles.buttonText, {color: currentColors.text}]}>
                                    {cancelText}
                                </Text>
                            </TouchableOpacity>

                            {onDeny && (
                                <TouchableOpacity
                                    style={[
                                        styles.button,
                                        {
                                            backgroundColor: currentColors.error,
                                            borderWidth: 1,
                                            borderColor: currentColors.errorBorder,
                                        }
                                    ]}
                                    onPress={onDeny}
                                >
                                    <Text style={[styles.buttonText, {
                                        color: currentColors.text
                                    }]}>{denyText}</Text>
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    {
                                        backgroundColor: currentColors.primary,
                                        borderWidth: 1,
                                        borderColor: currentColors.primaryBorder
                                    }
                                ]}
                                onPress={onConfirm}
                            >
                                <Text style={[styles.buttonText, {
                                    color: currentColors.text
                                }]}>{confirmText}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
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
        padding: 20,
    },
    alertContainer: {
        width: '100%',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    button: {
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        elevation: 2,
        minWidth: 100,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 14,
    },
})

export default CustomAlert