export const generateDeterministicHexColorFromUUID = (uuid: string): string => {
    let hash = 0
    for (let i = 0; i < uuid.length; i++) {
        const char = uuid.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash
    }

    const p1 = 131
    const p2 = 173
    const p3 = 211
    const xor1 = 0x5A5A5A
    const xor2 = 0xA5A5A5
    const xor3 = 0xCACACA

    const positiveHash = Math.abs(hash || 1)
    let r_val = (positiveHash * p1) ^ xor1
    let g_val = (positiveHash * p2) ^ xor2
    let b_val = (positiveHash * p3) ^ xor3

    const r = (r_val & 0xFF) % 156 + 80
    const g = (g_val & 0xFF) % 156 + 80
    const b = (b_val & 0xFF) % 156 + 80

    const toHexComponent = (c: number): string => {
        const hex = Math.max(0, Math.min(255, Math.floor(c))).toString(16)
        return hex.length === 1 ? '0' + hex : hex
    }

    return `#${toHexComponent(r)}${toHexComponent(g)}${toHexComponent(b)}`
}

export const hexToRgba = (hex: string, alpha: number): string => {
    const bigint = parseInt(hex.slice(1), 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}