import React, {useEffect, useState} from "react";
import "./index.scss"
import logo from "../../img/polenAnalystLogo.svg";
import Spinner from "../../Spinner";
import getUserLocale from 'get-user-locale';

function PredictPage(props) {

  const [imageTiles, setImageTiles] = useState([])
  const [faqExtended, setFaqExtended] = useState(false)
  const [chosenImage, setChosenImage] = useState(null)
  const [chosenImages, setChosenImages] = useState(null)
  const [downloadedReport, setDownloadedReport] = useState(null)
  const [correctionCsv, setCorrectionCsv] = useState(null)
  const [chosenImageHidden, setChosenImageHidden] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [didFormReport, setDidFormReport] = useState(false);
  const [reportPDF, setReportPDF] = useState('');
  const [reportCSV, setReportCSV] = useState('');
  const [didDownloadCsv, setDidDownloadCsv] = useState(false);


  function handleChange(selectorFiles) {
    setDidFormReport(false)
    let newImageTiles = []
    let filterSelectedFiles = Object.values(selectorFiles).filter(file => file.name.includes("jpg") || file.name.includes("png") || file.name.includes("jpeg") || file.name.includes("http"))
    setChosenImages(filterSelectedFiles.map(file => URL.createObjectURL(file)))
    for (let i = 0; i < filterSelectedFiles.length; i++) {
      newImageTiles.push(
        <div
          className={"image-tile"}
          key={filterSelectedFiles[i].name}
          onClick={() => {
            setChosenImage(i)
            setChosenImageHidden(false)
          }}
        >
          <img src={URL.createObjectURL(filterSelectedFiles[i])}/>
        </div>
      )
    }

    setImageTiles(newImageTiles)
  }

  const userLocale = getUserLocale();
  const documentLocale = userLocale.includes('ru') ? 'ru' : 'en'

  function predict() {
    setDidDownloadCsv(false)
    if (!chosenImages || !chosenImages.length) {
      return
    }
    setIsLoading(true)
    const API_ENDPOINT = `https://pollen-server.ngrok.io/predict?locale=${documentLocale}`;
    const downloadUrl = `https://pollen-server.ngrok.io/download?locale=${documentLocale}&path=`
    const request = new XMLHttpRequest();
    const formData = new FormData();


    request.open("POST", API_ENDPOINT, true);
    request.onreadystatechange = () => {
      setIsLoading(false)
      if (request.readyState === 4 && request.status === 200) {
        let responseJson = JSON.parse(request.responseText)
        let newImageTiles = []
        setChosenImages(responseJson.images_with_bboxes.map(url => downloadUrl+url))
        responseJson.images_with_bboxes.forEach((imageUrl, index) => {
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
        setDidFormReport(true)
        setReportPDF(downloadUrl + responseJson.report)
        setReportCSV(downloadUrl + responseJson.csv)
      }
    };

    for (let i = 0; i < chosenImages.length; i++) {
      formData.append(`file${i}.png`, chosenImages[i]);
    }
    request.send(formData);
  }

  const downloadPDF = () => {
    window.open(reportPDF, '_blank')
  }

  const downloadCSV = () => {
    window.open(reportCSV, '_blank')
    setDidDownloadCsv(true)
  }

  const aproveCsv = () => {
    const API_ENDPOINT = `https://pollen-server.ngrok.io/accept?report=${reportCSV.split('/')[reportCSV.split('/').length-1]}`;
    const request = new XMLHttpRequest();

    request.open("POST", API_ENDPOINT, true);
    request.onreadystatechange = () => {}

    request.send();
  }

  const correctCsv = (correctionCsv) => {
    if(!correctionCsv.length){
      return
    }
    const API_ENDPOINT = `https://pollen-server.ngrok.io/upload?report=${correctionCsv[0].name}`;
    const request = new XMLHttpRequest();
    const formData = new FormData();

    request.open("POST", API_ENDPOINT, true);
    request.onreadystatechange = () => {
      setIsLoading(false)
      if (request.readyState === 4 && request.status === 200) {
        console.log('corrected')
      }
    };
    console.log(correctionCsv[0])
    formData.append('file', correctionCsv[0]);

    request.send(formData);
    // request.send();
  }


  useEffect(() => {

    const onKeydown = (event) => {
      if(event.key === 'ArrowRight' && chosenImages !== null) {
        if(chosenImages.length > chosenImage+1) {
          setChosenImage(chosenImage+1)
        }
      }
      if(event.key === 'ArrowLeft' && chosenImages !== null) {
        if(chosenImage-1 >= 0) {
          setChosenImage(chosenImage-1)
        }
      }
    }


    window.document.removeEventListener('keydown', onKeydown)
    window.document.addEventListener('keydown', onKeydown)
    return () => {
      window.document.removeEventListener('keydown', onKeydown)
    };
  }, [chosenImages, chosenImage]);


  return (
    <div className={"predict-page"}>

      {chosenImageHidden ? null :
        <button
          className={"hide"}
          onClick={() => {
            setChosenImageHidden(true)
          }}
        />
      }
      <img
        key={chosenImage}
        src={chosenImage !== null ? chosenImages[chosenImage] : ""}
        className={"chosen-image" + (chosenImageHidden ? " hidden" : "")}
      />

      <img className={"logo"} height={"80px"} src={logo}/>
      <div
        className={"faq" + (faqExtended ? " extended" : "")}
        onClick={() => setFaqExtended(!faqExtended)}
      >
        <div className={"overlay" + (faqExtended ? " extended" : "")}>
          ?
        </div>
        <div className={"body"}>
          Привет! Это сервис автоматического распознавания пыльцевых зерен на изображениях Pollen Analyst. Пожалуйста,
          ознакомьтесь с краткой инструкцией перед началом пользования сервисом.
        </div>
        <div className={"title"}>
          Выбор изображений
        </div>
        <div className={"body"}>
          В сервисе есть возможность загрузить до 100 изображений общим объемом не более 200 Мб по кнопке «Выбрать
          фото». Доступные форматы изображений: “png”, “jpg”, “jpeg”. На данный момент сервис умеет обрабатывать
          изображения пыльцы с оптического микроскопа, окрашенной фуксином.
        </div>
        <div className={"title"}>
          Распознавание
        </div>
        <div className={"body"}>
          Нажмите на кнопку «Сгенерировать отчет». После этого выбранные фотографии загрузятся на сервер, где будет
          произведено их распознавание с помощью нейронных сетей. Далее будет сформирован отчет по обнаруженной пыльце.
          Отчет будет доступен вместе с результатами распознавания спустя несколько секунд после загрузки изображений.
          Он автоматически откроется в соседней вкладке браузера, а результаты распознавания будут отображены на
          изображениях.
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
          onChange={(e) => handleChange(e.target.files)}
        />
        <div className={"buttons"}>
          <button
            className={"action-button" + (imageTiles.length === 0 ? " active" : "")}
            onClick={() => document.getElementById('selectedFile').click()}
          >
            <div className={"inner-text"}>
              {!didFormReport ?
                <>выбрать фото</>
                :
                <>выбрать новые фото</>
              }
            </div>
          </button>
          {didFormReport ?
            <>
              <button
                className={"action-button"}
                onClick={downloadPDF}
              >
                📥 PDF
              </button>
              <button
                className={"action-button"}
                onClick={downloadCSV}
              >
                📥 CSV
              </button>
            </>
            :
            <button
              className={"action-button" + ((imageTiles.length > 0 && !didFormReport) ? " active" : " passive")}
              style={!isLoading ? {width: '260px', height: '40.5px'}: {width: '30px', height: '30px'}}
              onClick={predict}
            >
              {isLoading ?
                <Spinner width={20}/>
                :
                <>сгенерировать отчет</>
              }
            </button>
          }
        </div>
      </div>
      <div className={"images"}>
        {imageTiles}
      </div>
      <div className={"buttons"}>

        {didDownloadCsv &&
          <>
            <button
              className={"action-button secondary"}
              onClick={aproveCsv}
            >
              отчет верный
            </button>
            <input
              type="file"
              id="selectedCSV"
              style={{display: "none"}}
              onChange={(e) => correctCsv(e.target.files)}
            />
            <button
              className={"action-button secondary"}
              onClick={() => document.getElementById('selectedCSV').click()}
            >
              скоректировать CSV
            </button>
          </>
        }
      </div>

    </div>
  )
}

export default PredictPage;
