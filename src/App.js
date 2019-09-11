import React from "react";
import "./App.css";
import Dictionary from "./components/Dictionary";
import { Box, Grommet, grommet } from "grommet";

function App() {
  return (
    <Grommet theme={grommet} full>
      <Box pad="xlarge" className="App">
        <Dictionary />
      </Box>
    </Grommet>
  );
}

export default App;
