import React, {useState}       from 'react';
import './index.scss';
import PredictPage from "./moduels/predictionPage";
import LoginPage from "./moduels/loginPage";
import LocaleContext from "./LocaleContext";


function App() {

  const [page, setPage] = useState("login")
  const [locale, setLocale] = useState('ru')

  let pageDict = {
    "login": <LoginPage setPage={(page) => setPage(page)}/>,
    "predict": <PredictPage setPage={(page) => setPage(page)}/>
  }

  return (
    <LocaleContext.Provider value={{setLocale: setLocale, locale: locale}}>
    <div className="App">
      {pageDict[page]}
    </div>
    </LocaleContext.Provider>
  );
}

export default App;
