import React from 'react'
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import Feather from '@expo/vector-icons/Feather'
import Constants from 'expo-constants'
import { router } from 'expo-router'
import { GlassSurface } from './glass-view'
import { Colors } from '@/constants/Colors'
import { Motion, Radius, Spacing, Typography } from '@/constants/Theme'
import { profileImages } from '@/assets/profile-images'
import { User } from '@/lib/interfaces'

function getGreeting() {
    const hour = new Date().getHours()
    if (hour < 6) return 'Buenas noches'
    if (hour < 13) return 'Buenos días'
    if (hour < 20) return 'Buenas tardes'
    return 'Buenas noches'
}

function IconButton({ name, onPress, badge, theme, variant = 'default' }: { name: keyof typeof Feather.glyphMap, onPress: () => void, badge?: number, theme: 'light' | 'dark', variant?: 'default' | 'primary' }) {
    const scale = useSharedValue(1)
    const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))
    const isPrimary = variant === 'primary'

    return (
        <Animated.View style={animatedStyle}>
            <Pressable
                onPressIn={() => { scale.value = withSpring(Motion.pressScale, Motion.spring) }}
                onPressOut={() => { scale.value = withSpring(1, Motion.spring) }}
                onPress={onPress}
                style={[
                    styles.iconButton,
                    { backgroundColor: isPrimary ? Colors[theme].primary : Colors[theme].input },
                ]}
            >
                <Feather name={name} size={20} color={isPrimary ? '#fff' : Colors[theme].text} />
                {!!badge && badge > 0 && (
                    <View style={[styles.badge, { backgroundColor: Colors[theme].error, borderColor: Colors[theme].header.background }]}>
                        <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
                    </View>
                )}
            </Pressable>
        </Animated.View>
    )
}

interface AppHeaderProps {
    theme: 'light' | 'dark'
    variant: 'home' | 'title'
    title?: string
    subtitle?: string
    icon?: keyof typeof Feather.glyphMap
    user?: User | null
    notificationCount?: number
    onAddPress?: () => void
    searchValue?: string
    onSearchChange?: (value: string) => void
    searchPlaceholder?: string
}

export function AppHeader({
    theme,
    variant,
    title,
    subtitle,
    icon,
    user,
    notificationCount = 0,
    onAddPress,
    searchValue,
    onSearchChange,
    searchPlaceholder = 'Buscar temas...',
}: AppHeaderProps) {
    return (
        <GlassSurface tint={theme} radius={0} style={[styles.header, { borderColor: Colors[theme].header.border }]}>
            {variant === 'home' ? (
                <>
                    <View style={styles.row}>
                        <Pressable style={styles.identity} onPress={() => router.push('/profile')}>
                            {user?.photo ? (
                                <Image source={profileImages[user.photo]} style={styles.avatar} />
                            ) : (
                                <View style={[styles.avatar, { backgroundColor: Colors[theme].input }]} />
                            )}
                            <View>
                                <Text style={[styles.greeting, { color: Colors[theme].textSecondary }]}>{getGreeting()}</Text>
                                <Text style={[styles.name, { color: Colors[theme].header.text }]} numberOfLines={1}>
                                    {user?.name?.split(' ')[0] ?? 'Learn Loop'}
                                </Text>
                            </View>
                        </Pressable>
                        <View style={styles.actions}>
                            {onAddPress && (
                                <IconButton name="plus" theme={theme} variant="primary" onPress={onAddPress} />
                            )}
                            <IconButton
                                name="bell"
                                theme={theme}
                                badge={notificationCount}
                                onPress={() => router.push('/notifications')}
                            />
                        </View>
                    </View>

                    {onSearchChange && (
                        <GlassSurface tint={theme} radius={Radius.pill} bordered={false} style={styles.searchBar}>
                            <Feather name="search" size={18} color={Colors[theme].textSecondary} />
                            <TextInput
                                style={[styles.searchInput, { color: Colors[theme].text }]}
                                placeholder={searchPlaceholder}
                                placeholderTextColor={Colors[theme].textSecondary}
                                value={searchValue}
                                onChangeText={onSearchChange}
                            />
                        </GlassSurface>
                    )}
                </>
            ) : (
                <View style={styles.row}>
                    <View style={styles.identity}>
                        {icon && (
                            <View style={[styles.titleIcon, { backgroundColor: Colors[theme].primaryBackground }]}>
                                <Feather name={icon} size={20} color={Colors[theme].primary} />
                            </View>
                        )}
                        <View>
                            <Text style={[styles.title, { color: Colors[theme].header.text }]}>{title}</Text>
                            {subtitle && (
                                <Text style={[styles.subtitle, { color: Colors[theme].textSecondary }]}>{subtitle}</Text>
                            )}
                        </View>
                    </View>
                </View>
            )}
        </GlassSurface>
    )
}

const styles = StyleSheet.create({
    header: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderLeftWidth: StyleSheet.hairlineWidth,
        borderRightWidth: StyleSheet.hairlineWidth,
        borderBottomLeftRadius: Radius.xxl,
        borderBottomRightRadius: Radius.xxl,
        overflow: 'hidden',
        paddingTop: Constants.statusBarHeight + Spacing.sm,
        paddingBottom: Spacing.base,
        paddingHorizontal: Spacing.lg,
        gap: Spacing.md,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    identity: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        flexShrink: 1,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: Radius.pill,
    },
    titleIcon: {
        width: 40,
        height: 40,
        borderRadius: Radius.pill,
        alignItems: 'center',
        justifyContent: 'center',
    },
    greeting: {
        ...Typography.label,
        fontWeight: '500',
        textTransform: 'none',
    },
    name: {
        ...Typography.subtitle,
    },
    title: {
        ...Typography.title,
        fontSize: 22,
    },
    subtitle: {
        ...Typography.small,
        marginTop: 1,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: Radius.pill,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badge: {
        position: 'absolute',
        top: -2,
        right: -2,
        minWidth: 18,
        height: 18,
        borderRadius: Radius.pill,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 3,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        paddingHorizontal: Spacing.base,
        height: 44,
    },
    searchInput: {
        ...Typography.body,
        flex: 1,
        height: '100%',
    },
})
