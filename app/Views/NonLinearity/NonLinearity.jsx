import React, {Component} from "react";
import {connect} from "react-redux";
import {changeUserSetting} from "../../Actions/Parameters.js";
import RadioButton from "../Components/RadioButton.jsx";
import "../Card.scss";

class NonLinearity extends Component {
    constructor(props) {
        super(props);

        const {bubble, swirl} = props;
        this.state = {
            bubble,
            swirl
        };
    }

    toggleNonLinearity = (type) => {
        this.setState(prevState => {
            return {
                [type]: !prevState[type]
            }
        }, this.setNonlinearity);
    }

    setNonlinearity = () => {
        this.props.updateUserChoice(this.state);
    }

    render() {
        const {bubble, swirl} = this.props;

        return (
            <div className="card">
                <div className="header">
                    <p>Non-Linearity</p>
                </div>

                <div className="content">
                    <RadioButton text="Bubble Variation"
                                 itemKey="bubble"
                                 checked={bubble}
                                 onRadioToggle={this.toggleNonLinearity} />

                    <RadioButton text="Swirl Variation"
                                 itemKey="swirl"
                                 checked={swirl}
                                 onRadioToggle={this.toggleNonLinearity} />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const userParams = state.getIn(['ParameterState', 'user']);
    const {bubble, swirl} = userParams;

    return {
        bubble,
        swirl
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateUserChoice: (param, value) => dispatch(changeUserSetting(param, value))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NonLinearity);