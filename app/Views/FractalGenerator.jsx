import React, {Component} from "react";
import Fractal from "./Fractal.jsx";
import UserInput from "./UserInput.jsx";
import {DefaultProperties} from "../Constants/constants.js";

class FractalGenerator extends Component {
    render() {
        // const dimensions = {
        //     width: DefaultProperties.width + 'px',
        //     height: DefaultProperties.height + 'px'
        // };
        // <Fractal dimensions={dimensions}  />

        return (
            <UserInput />
        );
    }
}

export default FractalGenerator;