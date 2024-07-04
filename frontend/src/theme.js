// theme.js
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    customColorScheme: {
      50: "#006a4e",
      100: "#dbd2c3",
      200: "#80dbc9",
      300: "linear-gradient(184deg, rgba(183,183,183,1) 0%, rgba(125,114,93,1) 100%)",
      400: "#26d8a3",
      500: "#00cc93",
      600: "#00b381",
      700: "#009b6f",
      800: "#007e5c",
      900: "#00563b",
    },
  },
  components: {
    Tabs: {
      variants: {
        "custom-variant": {
          tab: {
            borderRadius: "full", // Makes tabs circular
            _selected: {
              bg: "customColorScheme.300",
              color: "white",
            },
            _hover: {
              bg: "customColorScheme.300",
              color: "white",
            },
          },
          tabpanel: {
            p: 4,
          },
        },
      },
    },
  },
});

export default theme;
