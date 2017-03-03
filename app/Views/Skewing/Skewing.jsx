import React, {Component} from "react";
import {connect} from "react-redux";
import {changeUserSetting} from "../../Actions/Parameters.js";
import RadioButton from "../Components/RadioButton.jsx";
import "../Card.scss";

class Skewing extends Component {
    selectSkewType = (type) => {
        const {updateUserChoice} = this.props;
        let newProperties = {
            lessSkewing: false,
            freeSkewing: false
        };
        
        switch(type) {
            case 'lessSkewing': {
                newProperties.lessSkewing = true;
                break;
            }
            case 'freeSkewing': {
                newProperties.freeSkewing = true;
                break;
            }
            default: {
                break;
            }
        }
        updateUserChoice(newProperties);
    }

    render() {
        const {noSkewing, lessSkewing, freeSkewing} = this.props;

        return (
            <div className="card">
                <div className="header">
                    <p>Skewing</p>
                </div>

                <div className="content">
                    <RadioButton text="No Skewing"
                                 itemKey="noSkewing"
                                 checked={noSkewing}
                                 onRadioToggle={this.selectSkewType} />

                    <RadioButton text="Less Skewing"
                                 itemKey="lessSkewing"
                                 checked={lessSkewing}
                                 onRadioToggle={this.selectSkewType} />
                    
                    <RadioButton text="Free Skewing"
                                 itemKey="freeSkewing"
                                 checked={freeSkewing}
                                 onRadioToggle={this.selectSkewType} />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const userParams = state.getIn(['ParameterState', 'user']);
    const {lessSkewing, freeSkewing} = userParams;

    return {
        noSkewing: (!lessSkewing && !freeSkewing) ? true : false,
        lessSkewing,
        freeSkewing
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateUserChoice: (propertyObject) => dispatch(changeUserSetting(propertyObject))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Skewing);