import React, {useState} from "react";
import "./index.scss"

function PredictPage(props){

  const [imageTiles, setImageTiles] = useState([])
  const [faqExtended, setFaqExtended] = useState(false)

  function handleChange(selectorFiles){
    let newImageTiles = []
    console.log(selectorFiles)
    for(let i = 0; i < selectorFiles.length; i++){
      newImageTiles.push(
          <div className={"image-tile"} key={selectorFiles[i].name}>
            <img src={URL.createObjectURL(selectorFiles[i])}/>
          </div>
        )
    }

    setImageTiles(newImageTiles)
  }

  return(
    <div className={"predict-page"}>
      <div className={"faq" + (faqExtended ? " extended": "")} onClick={() => setFaqExtended(!faqExtended)}>
        <div className={"overlay" + (faqExtended ? " extended": "")}>
          ?
        </div>
        <div className={"title"}>
          Lorem ipsum
        </div>
        <div className={"body"}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare neque ac gravida varius. Proin semper metus quis risus bibendum, non feugiat mauris dignissim. Curabitur volutpat, ante eu semper finibus, nisl sapien tempor dui, id tempor mauris arcu in ante. Mauris vulputate quis arcu sit amet dictum. Donec auctor iaculis congue. Praesent a tristique velit. In hac habitasse platea dictumst.
        </div>
        <div className={"title"}>
          Lorem ipsum
        </div>
        <div className={"body"}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare neque ac gravida varius. Proin semper metus quis risus bibendum, non feugiat mauris dignissim. Curabitur volutpat, ante eu semper finibus, nisl sapien tempor dui, id tempor mauris arcu in ante. Mauris vulputate quis arcu sit amet dictum. Donec auctor iaculis congue. Praesent a tristique velit. In hac habitasse platea dictumst.
        </div>
      </div>
      <div className={"controls"}>
        <div className={"description"}>
          Можно добавлять от 1 до 500 фото, чтоб добавить больше фото положите их в папку и добавьте папку.
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
            // onClick={}
          >
            <div className={"inner-text"}>
              предсказать
            </div>
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
