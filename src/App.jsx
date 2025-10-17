import { BrowserRouter, Route, Routes } from "react-router";
import MainPage from "./MainPage";
import Login from "./Login";
import Register from "./Register";
import AllPrompts from "./AllPrompts";
import MyPrompts from "./MyPrompts";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />}>
          <Route index element={<AllPrompts />} />
          <Route path="/my-prompts" element={<MyPrompts />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
