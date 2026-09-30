import { generateDeterministicHexColorFromUUID, hexToRgba } from './utils'

describe('generateDeterministicHexColorFromUUID', () => {
    it('returns the same color for the same id every time', () => {
        const id = 'topic-123'

        expect(generateDeterministicHexColorFromUUID(id)).toBe(generateDeterministicHexColorFromUUID(id))
    })

    it('returns different colors for different ids (in the common case)', () => {
        expect(generateDeterministicHexColorFromUUID('topic-1')).not.toBe(
            generateDeterministicHexColorFromUUID('topic-2')
        )
    })

    it('returns a well-formed 6-digit hex color', () => {
        const color = generateDeterministicHexColorFromUUID('topic-123')

        expect(color).toMatch(/^#[0-9a-f]{6}$/)
    })
})

describe('hexToRgba', () => {
    it('converts a hex color to an rgba string with the given alpha', () => {
        expect(hexToRgba('#ff0000', 0.5)).toBe('rgba(255, 0, 0, 0.5)')
    })

    it('handles black and white correctly', () => {
        expect(hexToRgba('#000000', 1)).toBe('rgba(0, 0, 0, 1)')
        expect(hexToRgba('#ffffff', 1)).toBe('rgba(255, 255, 255, 1)')
    })
})
