import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
    config: {
        initialColorMode: 'light',
        useSystemColorMode: false,
    },
    colors: {
        brand: {
            50: '#F5E6FF',
            100: '#E1CCFF',
            200: '#C299FF',
            300: '#A366FF',
            400: '#8533FF',
            500: '#6600FF',
            600: '#5200CC',
            700: '#3D0099',
            800: '#290066',
            900: '#140033',
        },
    },
    styles: {
        global: (props) => ({
            body: {
                bg: props.colorMode === 'dark' ? 'gray.900' : 'white',
                color: props.colorMode === 'dark' ? 'white' : 'gray.800',
            },
            a: {
                color: props.colorMode === 'dark' ? 'purple.200' : 'purple.600',
                _hover: {
                    textDecoration: 'none',
                    color: props.colorMode === 'dark' ? 'purple.300' : 'purple.700',
                },
            },
        }),
    },
    components: {
        Button: {
            defaultProps: {
                colorScheme: 'purple',
            },
        },
        Link: {
            baseStyle: (props) => ({
                color: props.colorMode === 'dark' ? 'purple.200' : 'purple.600',
                _hover: {
                    textDecoration: 'none',
                    color: props.colorMode === 'dark' ? 'purple.300' : 'purple.700',
                },
            }),
        },
    },
});

export default theme; 