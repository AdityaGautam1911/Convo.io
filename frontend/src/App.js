import "./App.css";
import Homepage from "./Pages/Homepage";
import { Route } from "react-router-dom";
import Chatpage from "./Pages/Chatpage";
import { TabProvider } from "./Context/TabContext";

function App() {
  return (
    <div className="App">
      <TabProvider>
        <Route path="/" component={Homepage} exact />
        <Route path="/chats" component={Chatpage} />
      </TabProvider>
    </div>
  );
}

export default App;
