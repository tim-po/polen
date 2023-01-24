import React, {useContext} from "react";
import './index.scss'
import Spinners from "../img/spinners";

// CONSTANTS

// DEFAULT FUNCTIONS

const Spinner = (props) => {
    const {width, spinnerStyle} = props;

    return (
      <div
        className="spinner-container"
        style={{
          width: width,
          height: width
        }}
      >
        <div className="spinner" style={{...spinnerStyle}}><Spinners width={+width}/></div>
      </div>
    )
};

export default Spinner
