import React, {Component} from "react";
import classnames from "classnames";
import "./RadioButton.scss";

class RadioButton extends Component {
    toggleSelection = (event) => {
        event.stopPropagation();
        this.props.onRadioToggle(this.props.itemKey);
    }

    render() {
        const {text, checked} = this.props;
        console.log(text, checked);

        return (
            <div className="radio-button" onClick={this.toggleSelection}>
                <div className={classnames('radio', checked && 'selected')} />
                <p className="text">{text}</p>
            </div>
        );
    }
}

export default RadioButton;