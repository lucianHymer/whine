import {
  extendTheme,
  withDefaultColorScheme,
  theme as baseTheme,
} from '@chakra-ui/react'

const theme = extendTheme(
  {
    colors: {
      primary: baseTheme.colors.purple,
      foreground: baseTheme.colors.purple['500'],
      background: baseTheme.colors.purple['50'],
    },
    fonts: {
      heading: `'Kanit'`,
      body: `'Kanit'`,
    },
  },
  withDefaultColorScheme({ colorScheme: 'primary' })
);

export default theme;
