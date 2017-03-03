import rootReducer from "../Reducers/";
import {createStore, compose} from "redux";
import {Map} from "immutable";

const create = compose(
    window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)

export default create(rootReducer, Map());