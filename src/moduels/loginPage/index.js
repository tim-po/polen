import React, {useState, useEffect} from "react";
import "./index.scss"
import textLogo from "../../img/polenAnalystTextLogo.svg"
import {withLocalStorage} from "../../localStorage";

function LoginPage(props){

  const passwords = {
    "user-1": "2VuFZxhvVcxrpsYZ",
    "user-2": "hZHm9UUhyU9BfHwp",
    "user-3": "J2vk4Px9XVZhuUe9",
    "user-4": "q3pnmHnRWauQ3RLD",
    "user-5": "6LZTHYtxX8tUa3BP",
    "user-6": "SFsXcKbN5KyjSNjZ",
    "user-7": "ZWuy6SnsyFEeMpWK",
    "user-8": "gBYKvKavG2tq2Ku2",
    "user-9": "wzZ7bSXK3fzmCMsS",
    "user-10": "ELjMygv6HY7SEZqj",
  }

  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [secondPassword, setSecondPassword] = useState("")
  const [name, setName] = useState("")
  const [organisation, setOrganization] = useState("")
  const [isRegister, setIsRegister] = useState(false)
  const [isDocumentWindow, setIsDocumentWindow] = useState(false)
  const [validated, setValidated] = useState(false)

  useEffect(() => {
    if(
      (
        isRegister &&
        secondPassword === password &&
        password.length >=5 &&
        organisation !== "" &&
        name !== "" &&
        (login.length >= 5)
      )
      ||
      (
        !isRegister &&
        (password.length >= 8) &&
        (login.length >= 5)
      )
    ){
      setValidated(true)
    }else{
      setValidated(false)
    }
  })

  useEffect(() => {
    const savedPassword = withLocalStorage({password: ""}, 'load').password
    const savedLogin = withLocalStorage({login: ""}, 'load').login
    console.log(savedPassword, savedLogin)
    if(passwords[savedLogin] && passwords[savedLogin] === savedPassword){
      props.setPage("predict")
    }
  }, [])

  function handleChange(selectorFiles){
    console.log(selectorFiles)
  }

  function singIn() {
    let body = {
      login: login,
      password: password,
      name: name,
      organisation: organisation
    }

    if(passwords[login] && passwords[login] === password){
      props.setPage("predict")
      withLocalStorage({password: password}, 'save')
      withLocalStorage({login: login}, 'save')
    }
  }

  return(
    <div className={"register-page"}>

      <img className={"logo" + (isRegister ? " small": "")} src={textLogo}/>
      <div className={"H1"}>
        {isRegister ? "РЕГИСТРАЦИЯ": "ВХОД"}
      </div>
      <div style={{marginTop: "20px"}}/>
      {/*<input*/}
      {/*  type={"text"}*/}
      {/*  placeholder={"ФИО"}*/}
      {/*  autoComplete={"name"}*/}
      {/*  className={"password-check" + (isRegister ? "": " hidden")}*/}
      {/*  onChange={(ev) => setName(ev.target.value)}*/}
      {/*/>*/}
      {/*<input*/}
      {/*  type={"text"}*/}
      {/*  placeholder={"место работы"}*/}
      {/*  autoComplete={"organization"}*/}
      {/*  className={"password-check" + (isRegister ? "": " hidden")}*/}
      {/*  onChange={(ev) => setOrganization(ev.target.value)}*/}
      {/*/>*/}
      <input
        type={"email"}
        placeholder={"email"}
        autoComplete={"username"}
        onChange={(ev) => setLogin(ev.target.value)}
      />
      <input
        type={"password"}
        placeholder={"пароль"}
        autoComplete={isRegister ? "new-password": "current-password"}
        onChange={(ev) => setPassword(ev.target.value)}
      />
      {/*<input*/}
      {/*  type={isRegister ? "password": "text"}*/}
      {/*  placeholder={"повтор пароля"}*/}
      {/*  autoComplete={isRegister ? "new-password": "current-password"}*/}
      {/*  className={"password-check" + (isRegister ? "": " hidden")}*/}
      {/*  onChange={(ev) => setSecondPassword(ev.target.value)}*/}
      {/*/>*/}

      <div className={"identity-document-window" + (isDocumentWindow ? "": " hidden")}>
        <button className={"close hideble"} onClick={() => setIsDocumentWindow(false)}>
          X
        </button>
        <div className={"description hideble"}>
          Для регистрации нужно предоставить документ подтверждающий личность
        </div>
        <input
          className={"hideble"}
          type="file"
          id="selectedFile"
          style={{display: "none"}}
          onChange={ (e) => singIn()}
        />
        <button
          className={"action-button" + (validated ? " active": "")}
          onClick={() => {
            if(isRegister){
              if(isDocumentWindow){
                document.getElementById('selectedFile').click()
              }else{
                setIsDocumentWindow(true)
              }
            }else{
              singIn()
            }
          }}
        >
          {isDocumentWindow ?
            "выбрать документ" :
            (!isRegister ? "войти" : "зарегистрироваться")}
        </button>
      </div>

      {/*<button*/}
      {/*  className={"secondary-button active"}*/}
      {/*  onClick={() => {*/}
      {/*    setIsRegister(!isRegister)*/}
      {/*    if(isRegister){*/}
      {/*      setIsDocumentWindow(false)*/}
      {/*    }*/}
      {/*  }}*/}
      {/*>*/}
      {/*  {!isRegister ? "зарегистрироваться" : "войти"}*/}
      {/*</button>*/}
    </div>
  )
}

export default LoginPage;
