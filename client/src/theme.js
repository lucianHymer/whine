import {
  extendTheme,
  withDefaultColorScheme,
  theme as baseTheme
} from '@chakra-ui/react'

const theme = extendTheme(
  {
    colors: {
      primary: {
        ...baseTheme.colors.purple,
        main: baseTheme.colors.purple['500']
      },
      secondary: {
        ...baseTheme.colors.green,
        main: baseTheme.colors.green['300']
      },
      foreground: baseTheme.colors.purple['500'],
      background: baseTheme.colors.purple['50'],
      midground: baseTheme.colors.whiteAlpha['800']
    },
    fonts: {
      heading: `'Kanit'`,
      body: `'Kanit'`
    }
  },
  withDefaultColorScheme({ colorScheme: 'primary' })
)

export default theme
