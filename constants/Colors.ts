/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4'
const tintColorDark = '#fff'

// Primary colors
const primaryBlue = '#016BFF'
const primaryBlueBorder = '#4090FF'
const primaryBlueLight = '#0a7ea4'
const primaryBlueLightBorder = '#0a9ec4'

// Error colors
const errorRed = '#FF4D4F'
const errorRedLight = '#FF7875'

// Background colors
const darkBackground = '#1F1F21'
const lightBackground = '#FFFFFF'

// Card and container colors
const darkCard = '#1F1F21'
const lightCard = '#F5F5F7'

// Input and secondary element colors
const darkInput = '#353638'
const lightInput = '#E5E5E7'

// Border colors
const darkBorder = '#353638'
const lightBorder = '#D1D1D6'

// Text colors
const darkText = '#FFFFFF'
const darkTextSecondary = '#50545D'
const lightText = '#000000'
const lightTextSecondary = '#6E6E73'

// Disabled button colors
const disabledButtonDark = '#6E87B7'
const disabledButtonLight = '#A5C0FF'

// Backdrop colors
const backdropDark = 'rgba(0,0,0,0.5)'
const backdropLight = 'rgba(0,0,0,0.3)'

// Line colors
const lineDark = 'grey'
const lineLight = '#AEAEB2'

// Navigation colors
const navBackgroundDark = '#1F1F21'
const navBackgroundLight = '#F5F5F7'
const navBorderDark = '#353638'
const navBorderLight = '#D1D1D6'
const tabIconDefaultDark = '#50545D'
const tabIconDefaultLight = '#8E8E93'

export const Colors = {
  light: {
    text: lightText,
    textSecondary: lightTextSecondary,
    background: lightBackground,
    tint: primaryBlueLight,
    icon: '#687076',
    tabIconDefault: tabIconDefaultLight,
    tabIconSelected: primaryBlueLight,
    card: lightCard,
    input: lightInput,
    border: lightBorder,
    primary: primaryBlueLight,
    primaryBorder: primaryBlueLightBorder,
    error: errorRedLight,
    disabledButton: disabledButtonLight,
    backdrop: backdropLight,
    line: lineLight,
    nav: {
      background: navBackgroundLight,
      border: navBorderLight,
    },
    newButton: {
      background: primaryBlueLight,
      border: primaryBlueLightBorder,
    },
    secondary: {
      background: lightInput,
      border: lightBorder,
      text: primaryBlueLight,
    },
    header: {
      background: navBackgroundLight,
      border: navBorderLight,
      text: lightText,
    }
  },
  dark: {
    text: darkText,
    textSecondary: darkTextSecondary,
    background: darkBackground,
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: tabIconDefaultDark,
    tabIconSelected: tintColorDark,
    card: darkCard,
    input: darkInput,
    border: darkBorder,
    primary: primaryBlue,
    primaryBorder: primaryBlueBorder,
    error: errorRed,
    disabledButton: disabledButtonDark,
    backdrop: backdropDark,
    line: lineDark,
    nav: {
      background: navBackgroundDark,
      border: navBorderDark,
    },
    newButton: {
      background: primaryBlue,
      border: primaryBlueBorder,
    },
    secondary: {
      background: darkInput,
      border: darkTextSecondary,
      text: primaryBlue,
    },
    header: {
      background: navBackgroundDark,
      border: navBorderDark,
      text: darkText,
    }
  },
}
