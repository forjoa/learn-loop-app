import { Image, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native'
import Main from '@/components/ui/Main'
import { Colors } from '@/constants/Colors'
import { useAuth } from '@/hooks/useAuth'
import { profileImages } from '@/assets/profile-images'
import SelectDropdown from 'react-native-select-dropdown'
import { MaterialIcons } from '@expo/vector-icons'
import { router } from 'expo-router'

export default function ProfileScreen() {
    const colorScheme = useColorScheme() || 'dark'
    const {user, logout} = useAuth()

    const roles = [
        {label: 'Estudiante', value: 'STUDENT'},
        {label: 'Profesor', value: 'TEACHER'}
    ]

    return (
        <Main>
            <View style={styles.container}>
                <Image
                    source={profileImages[user?.photo as string]}
                    style={styles.image}
                />
                <Text style={[styles.name, {color: Colors[colorScheme].text}]}>
                    {user?.name}
                </Text>

                <SelectDropdown
                    data={roles}
                    defaultValue={user?.role === 'TEACHER' ? roles[1] : roles[0]}
                    onSelect={(selectedItem) => {
                        console.log('Rol seleccionado:', selectedItem.value)
                    }}
                    renderButton={(selectedItem, isOpened) => (
                        <View style={[
                            styles.dropdownButton,
                            {
                                backgroundColor: Colors[colorScheme].input,
                                borderColor: Colors[colorScheme].border
                            }
                        ]}>
                            <Text style={[
                                styles.dropdownButtonText,
                                {color: Colors[colorScheme].text}
                            ]}>
                                {selectedItem?.label || 'Seleccionar rol'}
                            </Text>
                            <MaterialIcons
                                name={isOpened ? 'arrow-drop-up' : 'arrow-drop-down'}
                                size={24}
                                color={Colors[colorScheme].text}
                            />
                        </View>
                    )}
                    renderItem={(item, index, isSelected) => (
                        <View style={[
                            styles.dropdownItem,
                            isSelected && {
                                backgroundColor: Colors[colorScheme].primary
                            },
                            {backgroundColor: Colors[colorScheme].input}
                        ]}>
                            <Text style={[
                                styles.dropdownItemText,
                                {color: Colors[colorScheme].text}
                            ]}>
                                {item.label}
                            </Text>
                        </View>
                    )}
                    dropdownStyle={[
                        styles.dropdown,
                        {
                            backgroundColor: Colors[colorScheme].input,
                            borderColor: Colors[colorScheme].border
                        }
                    ]}
                />

                <View style={styles.sendContainer}>
                    <Pressable
                        style={[
                            styles.primary,
                            {
                                backgroundColor: Colors[colorScheme].error,
                                borderColor: Colors[colorScheme].errorBorder
                            }
                        ]}
                        onPress={() => {
                            logout()
                            router.navigate('/(auth)')
                        }}
                    >
                        <Text style={[
                            styles.textPrimary,
                            {color: '#fff'}
                        ]}>Cerrar sesión</Text>
                    </Pressable>
                    <Pressable
                        style={[
                            styles.primary,
                            {
                                backgroundColor: Colors[colorScheme].primary,
                                borderColor: Colors[colorScheme].primaryBorder,
                            }
                        ]}
                    >
                        <Text style={[
                            styles.textPrimary,
                            {color: '#fff'}
                        ]}>Guardar cambios</Text>
                    </Pressable>
                </View>
            </View>
        </Main>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 30
    },
    dropdownButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 300,
        height: 50,
        borderRadius: 10,
        borderWidth: 1,
        paddingHorizontal: 15
    },
    dropdownButtonText: {
        // fontSize: 16,
        flex: 1
    },
    dropdown: {
        borderRadius: 10,
        borderWidth: 1,
        marginTop: 5
    },
    dropdownItem: {
        padding: 15,
        height: 50,
        justifyContent: 'center',
        backdropFilter: 'blur(10px)'
    },
    dropdownItemText: {
        // fontSize: 16
    },
    primary: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        borderRadius: 10,
        marginBottom: 5,
        borderTopWidth: 2,
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
    },
    textPrimary: {},
    sendContainer: {
        marginTop: 20,
        width: 300,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
})