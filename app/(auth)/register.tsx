import { useState } from 'react';
import { ImageSourcePropType, Image, StyleSheet, Text, View, Pressable, ScrollView, TextInput, ImageURISource } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Href, router } from 'expo-router';
import { KeyboardAvoidingView, Platform } from 'react-native';

const profileImages: Record<string, ImageSourcePropType> = {
    'ant.png': require('@/assets/images/profile/ant.png'),
    'bear.png': require('@/assets/images/profile/bear.png'),
    'bison.png': require('@/assets/images/profile/bison.png'),
    'buffalo.png': require('@/assets/images/profile/buffalo.png'),
    'cat-2.png': require('@/assets/images/profile/cat-2.png'),
    'cat-3.png': require('@/assets/images/profile/cat-3.png'),
    'chicken.png': require('@/assets/images/profile/chicken.png'),
    'cow.png': require('@/assets/images/profile/cow.png'),
    'crocodile.png': require('@/assets/images/profile/crocodile.png'),
    'dog-2.png': require('@/assets/images/profile/dog-2.png'),
    'dog-4.png': require('@/assets/images/profile/dog-4.png'),
    'doraemon.png': require('@/assets/images/profile/doraemon.png'),
    'duck.png': require('@/assets/images/profile/duck.png'),
    'eagle.png': require('@/assets/images/profile/eagle.png'),
    'elephant.png': require('@/assets/images/profile/elephant.png'),
    'fox.png': require('@/assets/images/profile/fox.png'),
    'giraffe.png': require('@/assets/images/profile/giraffe.png'),
    'gorilla.png': require('@/assets/images/profile/gorilla.png'),
    'hedgehog.png': require('@/assets/images/profile/hedgehog.png'),
    'hello-kitty.png': require('@/assets/images/profile/hello-kitty.png'),
    'hippo.png': require('@/assets/images/profile/hippo.png'),
    'horse.png': require('@/assets/images/profile/horse.png'),
    'keroppi.png': require('@/assets/images/profile/keroppi.png'),
    'koala.png': require('@/assets/images/profile/koala.png'),
    'leopard.png': require('@/assets/images/profile/leopard.png'),
    'lion.png': require('@/assets/images/profile/lion.png'),
    'monkey.png': require('@/assets/images/profile/monkey.png'),
    'moose.png': require('@/assets/images/profile/moose.png'),
    'mouse.png': require('@/assets/images/profile/mouse.png'),
    'otter.png': require('@/assets/images/profile/otter.png'),
    'owl.png': require('@/assets/images/profile/owl.png'),
    'panda.png': require('@/assets/images/profile/panda.png'),
    'penguin.png': require('@/assets/images/profile/penguin.png'),
    'pig.png': require('@/assets/images/profile/pig.png'),
    'pikachu.png': require('@/assets/images/profile/pikachu.png'),
    'raccoon.png': require('@/assets/images/profile/raccoon.png'),
    'sheep.png': require('@/assets/images/profile/sheep.png'),
    'sloth.png': require('@/assets/images/profile/sloth.png'),
    'snake.png': require('@/assets/images/profile/snake.png'),
    'squirrel.png': require('@/assets/images/profile/squirrel.png'),
    'tiger.png': require('@/assets/images/profile/tiger.png'),
    'wolf.png': require('@/assets/images/profile/wolf.png'),
    'zebra.png': require('@/assets/images/profile/zebra.png'),
};

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('STUDENT');
    const [profileImage, setProfileImage] = useState(profileImages['ant.png']);

    const handleRegister = () => {
        console.log({ name, email, password, role, profileImage });
        router.push('/(auth)');
    };

    const goTo = (route: Href) => {
        router.push(route);
    };

    return (
        <SafeAreaView style={styles.page}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                    <View style={styles.imageContainer}>
                        <Image style={styles.image} source={require('@/assets/images/droid.png')} />
                    </View>
                    <Text style={styles.title}>Registro</Text>
                    <Text style={styles.span}>Crea una cuenta para comenzar a aprender o enseñar</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Nombre"
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />

                    {/* Campo de contraseña */}
                    <TextInput
                        style={styles.input}
                        placeholder="****"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    {/* Selector de rol */}
                    <Picker
                        selectedValue={role}
                        onValueChange={(itemValue: string) => setRole(itemValue)}
                        style={styles.picker}
                        itemStyle={styles.pickerItem}
                        mode='dropdown'
                    >
                        <Picker.Item label="Estudiante" value="STUDENT" />
                        <Picker.Item label="Profesor" value="TEACHER" />
                    </Picker>

                    {/* Selección de imagen de perfil */}
                    <Text style={styles.sectionTitle}>Selecciona tu foto de perfil</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.profileScroll}>
                        {Object.keys(profileImages).map((image) => (
                            <Pressable
                                key={image}
                                onPress={() => setProfileImage(image as ImageURISource)}
                                style={[
                                    styles.profileOption,
                                    profileImage === image && styles.profileSelected,
                                ]}
                            >
                                <Image
                                    source={profileImages[image]} // Usas directamente la referencia de `profileImages`
                                    style={styles.profileImage}
                                />
                            </Pressable>
                        ))}
                    </ScrollView>

                    {/* Botón de registro */}
                    <Pressable style={styles.primary} onPress={handleRegister}>
                        <Text style={styles.textPrimary}>Registrarse</Text>
                    </Pressable>

                    <View style={styles.hr} />

                    {/* Enlace para ir al login */}
                    <Pressable style={styles.secondary} onPress={() => goTo('/(auth)')}>
                        <Text style={styles.textSecondary}>Inicia sesión</Text>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    container: {
        width: '90%',
        marginVertical: 20,
        backgroundColor: '#1F1F21',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    imageContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    image: {
        width: 100,
        height: 100,
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    span: {
        color: '#50545D',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#353638',
        color: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    picker: {
        backgroundColor: '#353638',
        color: '#fff',
        borderRadius: 10,
        marginBottom: 15,
    },
    pickerItem: {
        fontSize: 12
    },
    sectionTitle: {
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    profileScroll: {
        marginBottom: 20,
    },
    profileOption: {
        marginRight: 10,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    profileSelected: {
        borderColor: '#016BFF',
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    primary: {
        backgroundColor: '#016BFF',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        borderRadius: 10,
        marginBottom: 5,
        borderTopWidth: 2,
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
        borderColor: '#4090FF'
    },
    textPrimary: {
        color: '#fff',
    },
    hr: {
        backgroundColor: '#353638',
        height: 1,
        marginVertical: 20,
    },
    secondary: {
        backgroundColor: '#353638',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        borderRadius: 10,
        borderTopWidth: 2,
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
        borderColor: '#50545D',
        marginBottom: 25
    },
    textSecondary: {
        color: '#016BFF'
    },
});
