import React, {Component} from "react";
import {connect} from "react-redux";
import {changeUserSetting} from "../../Actions/Parameters.js";
import RadioButton from "../Components/RadioButton.jsx";
import "../Card.scss";

class Symmetry extends Component {
    constructor(props) {
        super(props);

        const {textSymmetry, rotationalSymmetry, dihedralSymmetry} = props;
        this.state = {
            textSymmetry,
            rotationalSymmetry,
            dihedralSymmetry
        };
    }

    toggleSymmetry = (type) => {
        this.setState(prevState => {
            return {
                [type]: !prevState[type]
            }
        }, this.setSymmetries);
    }

    updateTextSymmetry = ({target}) => {
        this.setState({
            textSymmetry: target.value
        }, this.setSymmetries);
    }

    setSymmetries = () => {
        this.props.updateUserChoice(this.state);
    }

    render() {
        const {textSymmetry, rotationalSymmetry, dihedralSymmetry} = this.props;

        return (
            <div className="card">
                <div className="header">
                    <p>Symmetry</p>
                </div>

                <div className="content">
                    <RadioButton text="Rotational Symmetry"
                                 itemKey="rotationalSymmetry"
                                 checked={rotationalSymmetry}
                                 onRadioToggle={this.toggleSymmetry} />

                    <input className="input" 
                           type="number"
                           placeholder="No of points of symmetry"
                           onChange={this.updateTextSymmetry} />
                    
                    <RadioButton text="Dihedral Symmetry"
                                 itemKey="dihedralSymmetry"
                                 checked={dihedralSymmetry}
                                 onRadioToggle={this.toggleSymmetry} />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const userParams = state.getIn(['ParameterState', 'user']);
    const {rotationalSymmetry, dihedralSymmetry, textSymmetry} = userParams;

    return {
        rotationalSymmetry,
        dihedralSymmetry,
        textSymmetry
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateUserChoice: (param, value) => dispatch(changeUserSetting(param, value))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Symmetry);