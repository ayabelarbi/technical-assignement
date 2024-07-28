import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MetaMaskContextProvider } from "./hooks/useMetaMask.tsx";
import { ChakraProvider } from "@chakra-ui/react";



import Home from "./pages/Home";
import Main from "./pages/Main";

function App() {
  return (
    <ChakraProvider>
    <BrowserRouter>
      <MetaMaskContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/main" element={<Main />} />
        </Routes>
      </MetaMaskContextProvider>
    </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
