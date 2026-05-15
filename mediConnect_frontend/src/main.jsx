import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { ChakraProvider } from "@chakra-ui/react";
import store from "@/app/store";
import theme from "@/styles/theme";
import { Toaster } from "@/components/ui/toaster";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ChakraProvider value={theme}>
      <App />
      <Toaster />
    </ChakraProvider>
  </Provider>,
);
