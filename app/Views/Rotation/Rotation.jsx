import React, {Component} from "react";
import {connect} from "react-redux";
import {changeUserSetting} from "../../Actions/Parameters.js";
import RadioButton from "../Components/RadioButton.jsx";
import "../Card.scss";

class Rotation extends Component {
    selectRotationType = (type) => {
        const {updateUserChoice} = this.props;
        let newProperties = {
            lessRotation: false,
            freeRotation: false
        };
        
        switch(type) {
            case 'lessRotation': {
                newProperties.lessRotation = true;
                break;
            }
            case 'freeRotation': {
                newProperties.freeRotation = true;
                break;
            }
            default: {
                break;
            }
        }
        updateUserChoice(newProperties);
    }

    render() {
        const {noRotation, lessRotation, freeRotation} = this.props;

        return (
            <div className="card">
                <div className="header">
                    <p>Rotation</p>
                </div>

                <div className="content">
                    <RadioButton text="No Rotation"
                                 itemKey="noRotation"
                                 checked={noRotation}
                                 onRadioToggle={this.selectRotationType} />

                    <RadioButton text="Less Rotation"
                                 itemKey="lessRotation"
                                 checked={lessRotation}
                                 onRadioToggle={this.selectRotationType} />
                    
                    <RadioButton text="Free Rotation"
                                 itemKey="freeRotation"
                                 checked={freeRotation}
                                 onRadioToggle={this.selectRotationType} />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const userParams = state.getIn(['ParameterState', 'user']);
    const {lessRotation, freeRotation} = userParams;

    return {
        noRotation: (!lessRotation && !freeRotation) ? true : false,
        lessRotation,
        freeRotation
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateUserChoice: (propertyObject) => dispatch(changeUserSetting(propertyObject))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Rotation);