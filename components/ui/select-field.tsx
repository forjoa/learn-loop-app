import React, { useState } from 'react'
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import Feather from '@expo/vector-icons/Feather'
import { Colors } from '@/constants/Colors'
import { Radius, Spacing, Typography } from '@/constants/Theme'
import { GlassSurface } from './glass-view'

export interface SelectOption<T extends string> {
    label: string
    value: T
}

interface SelectFieldProps<T extends string> {
    label?: string
    placeholder?: string
    value: T | null | undefined
    options: SelectOption<T>[]
    onChange: (value: T) => void
    theme: 'light' | 'dark'
    disabled?: boolean
}

// In-house replacement for @expo/ui's native Picker, which crashed without a <Host>
// ancestor and then only ever showed its first option once that was fixed. No native
// binding risk here - just our own GlassSurface + ScrollView, following the same
// "glass as background sibling, never as the scrollable container" rule as BottomSheet.
export function SelectField<T extends string>({
    label,
    placeholder = 'Selecciona una opción',
    value,
    options,
    onChange,
    theme,
    disabled,
}: SelectFieldProps<T>) {
    const [visible, setVisible] = useState(false)
    const selected = options.find((option) => option.value === value)

    return (
        <View>
            {label && <Text style={[styles.label, { color: Colors[theme].textSecondary }]}>{label}</Text>}

            <Pressable
                disabled={disabled}
                onPress={() => setVisible(true)}
                style={[
                    styles.trigger,
                    {
                        backgroundColor: Colors[theme].input,
                        borderColor: Colors[theme].border,
                        opacity: disabled ? 0.5 : 1,
                    },
                ]}
            >
                <Text
                    style={[styles.triggerText, { color: selected ? Colors[theme].text : Colors[theme].textSecondary }]}
                    numberOfLines={1}
                >
                    {selected ? selected.label : placeholder}
                </Text>
                <Feather name="chevron-down" size={18} color={Colors[theme].textSecondary} />
            </Pressable>

            <Modal transparent visible={visible} animationType="none" onRequestClose={() => setVisible(false)}>
                <TouchableWithoutFeedback onPress={() => setVisible(false)}>
                    <View style={[StyleSheet.absoluteFill, { backgroundColor: Colors[theme].backdrop }]} />
                </TouchableWithoutFeedback>

                <View style={styles.sheetWrapper} pointerEvents="box-none">
                    <View style={[styles.sheet, { borderColor: Colors[theme].border }]}>
                        <GlassSurface tint={theme} radius={0} style={StyleSheet.absoluteFill} />
                        <View style={[styles.line, { backgroundColor: Colors[theme].line }]} />
                        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
                            {options.map((option) => {
                                const isSelected = option.value === value
                                return (
                                    <Pressable
                                        key={option.value}
                                        onPress={() => {
                                            onChange(option.value)
                                            setVisible(false)
                                        }}
                                        style={[styles.row, isSelected && { backgroundColor: Colors[theme].primaryBackground }]}
                                    >
                                        <Text style={[Typography.body, styles.rowText, { color: Colors[theme].text }]} numberOfLines={1}>
                                            {option.label}
                                        </Text>
                                        {isSelected && <Feather name="check" size={18} color={Colors[theme].primary} />}
                                    </Pressable>
                                )
                            })}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    label: {
        ...Typography.label,
        marginBottom: Spacing.sm,
    },
    trigger: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 52,
        borderRadius: Radius.md,
        borderWidth: StyleSheet.hairlineWidth,
        paddingHorizontal: Spacing.base,
    },
    triggerText: {
        ...Typography.body,
        flex: 1,
    },
    sheetWrapper: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    sheet: {
        maxHeight: '60%',
        borderTopLeftRadius: Radius.xl,
        borderTopRightRadius: Radius.xl,
        borderWidth: StyleSheet.hairlineWidth,
        overflow: 'hidden',
    },
    line: {
        width: 48,
        height: 5,
        alignSelf: 'center',
        marginVertical: Spacing.md,
        borderRadius: Radius.pill,
    },
    list: {
        paddingHorizontal: Spacing.base,
        paddingBottom: Spacing.xl,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.base,
        paddingHorizontal: Spacing.sm,
        borderRadius: Radius.md,
    },
    rowText: {
        flex: 1,
    },
})
