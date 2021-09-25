import React, {useState} from "react";
import "./index.scss"
import logo from "../../img/polenAnalystLogo.svg";

function PredictPage(props){

  const [imageTiles, setImageTiles] = useState([])
  const [faqExtended, setFaqExtended] = useState(false)
  const [chosenImage, setChosenImage] = useState(null)
  const [chosenImages, setChosenImages] = useState(null)
  const [chosenImageHidden, setChosenImageHidden] = useState(true)

  function handleChange(selectorFiles){
    let newImageTiles = []
    let filterSelectedFiles = Object.values(selectorFiles).filter(file => file.name.includes("jpg") || file.name.includes("png") || file.name.includes("jpeg") || file.name.includes("http"))
    setChosenImages(filterSelectedFiles)
    for(let i = 0; i < filterSelectedFiles.length; i++){
      newImageTiles.push(
          <div
            className={"image-tile"}
            key={filterSelectedFiles[i].name}
            onClick={() => {
              setChosenImage(URL.createObjectURL(filterSelectedFiles[i]))
              setChosenImageHidden(false)
            }}
          >
            <img src={URL.createObjectURL(filterSelectedFiles[i])}/>
          </div>
        )
    }

    setImageTiles(newImageTiles)
  }

  function predict() {

    const API_ENDPOINT = "https://pollen-server.ngrok.io/predict";
    const downloadUrl = "https://pollen-server.ngrok.io/download?path="
    const request = new XMLHttpRequest();
    const formData = new FormData();

    request.open("POST", API_ENDPOINT, true);
    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.status === 200) {
        let responseJson = JSON.parse(request.responseText)
        let newImageTiles = []
        responseJson.images_with_bboxes.forEach(imageUrl => {
          newImageTiles.push(
            <div
              className={"image-tile"}
              key={imageUrl}
              onClick={() => {
                setChosenImage(downloadUrl + imageUrl)
                setChosenImageHidden(false)
              }}
            >
              <img src={downloadUrl + imageUrl}/>
            </div>
          )
        })
        setImageTiles(newImageTiles)

        window.open(downloadUrl + responseJson.report, '_blank')
      }
    };

    for(let i = 0; i < chosenImages.length; i++) {
      formData.append(`file${i}.png`, chosenImages[i]);
    }
    request.send(formData);
  }

  return(
    <div className={"predict-page"}>

      {chosenImageHidden ? null:
        <button
          className={"hide"}
          onClick={() => {
                  setChosenImageHidden(true)
                }}
        />
      }
      <img
        src={chosenImage !== null ? chosenImage: ""}
        className={"chosen-image" + (chosenImageHidden ? " hidden": "")}
      />

      <img className={"logo"} height={"80px"} src={logo}/>
      <div
        className={"faq" + (faqExtended ? " extended": "")}
        onClick={() => setFaqExtended(!faqExtended)}
      >
        <div className={"overlay" + (faqExtended ? " extended": "")}>
          ?
        </div>
        <div className={"body"}>
          Привет! Это сервис автоматического распознавания пыльцевых зерен на изображениях Pollen Analyst. Пожалуйста, ознакомьтесь с краткой инструкцией перед началом пользования сервисом.
        </div>
        <div className={"title"}>
          Выбор изображений
        </div>
        <div className={"body"}>
          В сервисе есть возможность загрузить до 100 изображений общим объемом не более 200 Мб по кнопке «Выбрать фото». Доступные форматы изображений: “png”, “jpg”, “jpeg”. На данный момент сервис умеет обрабатывать изображения пыльцы с оптического микроскопа, окрашенной фуксином.
        </div>
        <div className={"title"}>
          Распознавание
        </div>
        <div className={"body"}>
          Нажмите на кнопку «Сгенерировать отчет». После этого выбранные фотографии загрузятся на сервер, где будет произведено их распознавание с помощью нейронных сетей. Далее будет сформирован отчет по обнаруженной пыльце. Отчет будет доступен вместе с результатами распознавания спустя несколько секунд после загрузки изображений. Он автоматически откроется в соседней вкладке браузера, а результаты распознавания будут отображены на изображениях.
        </div>
      </div>

      <div className={"controls"}>
        <div className={"description"}>
          Можно добавлять от 1 до 500 фото,
          чтоб добавить фото положите их в папку и загрузите папку.
        </div>
        <input
          directory=""
          webkitdirectory=""
          type="file"
          id="selectedFile"
          style={{display: "none"}}
          onChange={ (e) => handleChange(e.target.files) }
        />
        <div className={"buttons"}>
          <button
            className={"action-button" + (imageTiles.length === 0 ? " active": "")}
            onClick={() => document.getElementById('selectedFile').click()}
          >
            <div className={"inner-text"}>
              выбрать фото
            </div>
          </button>
          <button
            className={"action-button" + (imageTiles.length > 0 ? " active": " passive")}
            onClick={predict}
          >
            сгенерировать отчет
          </button>
        </div>
      </div>
      <div className={"images"}>
        {imageTiles}
      </div>
    </div>
  )
}

export default PredictPage;
