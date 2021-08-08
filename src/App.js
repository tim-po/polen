import React, {useState}       from 'react';
import './index.scss';
import PredictPage from "./moduels/predictionPage";
import LoginPage from "./moduels/loginPage";

function App() {

  const [page, setPage] = useState("login")

  let pageDict = {
    "login": <LoginPage setPage={(page) => setPage(page)}/>,
    "predict": <PredictPage setPage={(page) => setPage(page)}/>
  }

  return (
    <div className="App">
      {pageDict[page]}
    </div>
  );
}

export default App;
