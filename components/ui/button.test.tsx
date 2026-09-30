import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react-native'
import { Button } from './button'

describe('Button', () => {
    it('renders the label and calls onPress when tapped', async () => {
        const onPress = jest.fn()
        await render(<Button label="Entrar" onPress={onPress} />)

        fireEvent.press(screen.getByText('Entrar'))

        expect(onPress).toHaveBeenCalledTimes(1)
    })

    it('shows a loading indicator instead of the label while loading', async () => {
        await render(<Button label="Entrar" onPress={jest.fn()} loading />)

        expect(screen.queryByText('Entrar')).toBeNull()
    })

    it('does not call onPress when disabled', async () => {
        const onPress = jest.fn()
        await render(<Button label="Entrar" onPress={onPress} disabled />)

        fireEvent.press(screen.getByText('Entrar'))

        expect(onPress).not.toHaveBeenCalled()
    })
})
