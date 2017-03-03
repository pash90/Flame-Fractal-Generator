export const UPDATE_USER_PARAMETER = "UPDATE_USER_PARAMETER";

export const changeUserSetting = (newPropertyObject) => {
    return {
        type: UPDATE_USER_PARAMETER,
        payload: {
            newPropertyObject
        }
    }
}

export const setBuffer = buffer => {
    return {
        type: 'UPDATE_BUFFER',
        payload: {
            buffer: buffer
        }
    };
}

export const setCoefficients = () => {
    return {
        type: 'UPDATE_COEFFICIENTS'
    };
}

export const setWindow = () => {
    return {
        type: 'UPDATE_WINDOW_COORDINATES'
    }
}

export const setColors = () => {
    return {
        type: 'UPDATE_COLORS'
    }
}

