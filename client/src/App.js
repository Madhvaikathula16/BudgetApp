import Dashboard from "./components/dashboard";
import "./App.css";
import { Provider } from "react-redux";
import store from "./store/configureStore";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Router>
          <Dashboard />
        </Router>
      </Provider>
    </div>
  );
}

export default App;
