import React, {Component} from "react";
import Rotation from "./Rotation/Rotation.jsx";
import Skewing from "./Skewing/Skewing.jsx";
import Symmetry from "./Symmetry/Symmetry.jsx";
import NonLinearity from "./NonLinearity/NonLinearity.jsx";
import "./UserInput.scss";

class UserInput extends Component {
    render() {
        return (
            <div className="container">
                <Rotation />
                <Skewing />
                <Symmetry />
                <NonLinearity />
            </div>
        );
    }
}

export default UserInput;