import { useState } from "react";
import Button from "@mui/material/Button";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1 className="text-3xl text-[var(--primary-color)]">Hello world!</h1>
      <Button variant="contained">Contained</Button>
    </div>
  );
}

export default App;
