import {createReducer} from "redux-immutablejs";
import {Map} from "immutable";
import {Limits} from "../Constants/constants";

const initialState = Map({
    // All the user parameters reside here
    user: {
        bubble: false,
        swirl: true,
        grayscale: false,
        gamma: 0.45,
        pastels: true,
        fixColors: false,
        brighter: true,
        fixMaps: false,
        textSymmetry: 5,
        rotationalSymmetry: true,
        dihedralSymmetry: false,
        fewerMaps: false,
        noReflection: false,
        lessRotation: false,
        freeRotation: true,
        lessSkew: true,
        freeSkew: false,
        fixAspectRatio: true,
        greaterTranslation: false,
        numberOfPoints: Limits.Crazy
    },

    // All the internal parameters reside here
    internal: {
        buffer: [],
        numberOfBaseMaps: 0,
        maps: [],
        baseMaps: [],
        conjugates: [],
        colors: [],
        usedRotationalSymmetry: false,
        usedDihedralSymmetry: false,
        windowCoordinates: {
            min: {
                X: Number.POSITIVE_INFINITY,
                Y: Number.POSITIVE_INFINITY
            },
            max: {
                X: Number.NEGATIVE_INFINITY,
                Y: Number.NEGATIVE_INFINITY
            }
        }
    }
});


export default createReducer(initialState, {

    /*
     * Update a user parameter
     */
    UPDATE_USER_PARAMETER: (state, {payload}) => {
        const {newPropertyObject} = payload;
        const userParams = state.get('user');
        return state.set('user', Object.assign({}, userParams, newPropertyObject));
    },


    /*
     * Update internal parameters
     */

    // Update buffer
    UPDATE_BUFFER: (state, {payload}) => {
        const internalParams = state.get('internal');
        return state.set('internal', Object.assign({}, internalParams, {buffer: payload.buffer}));
    },

    // Update colors
    UPDATE_COLORS: (state) => {
        let userParams = state.get('user'),
            internalParams = state.get('internal');
        
        let numberOfColorsToAdd = 0, r, g, b,
            {pastels, brighter, fixColors} = userParams,
            {numberOfBaseMaps, colors, maps} = internalParams,
            Color = {
                Min: 48,
                Max: 255
            };
        
        pastels && (Color.Min = 128);
        fixColors && (colors = []);

        numberOfColorsToAdd = (numberOfBaseMaps < colors.length) ? 0 : numberOfBaseMaps - colors.length;

        const colorDifference = Color.Max - Color.Min;
        for(let i = 0; i < numberOfColorsToAdd; i++) {
            r = Color.Min + (colorDifference * Math.random());
            g = Color.Min + (colorDifference * Math.random());
            b = Color.Min + (colorDifference * Math.random());

            let maxComponent = Math.max(r, g, b);

            if(brighter) {
                r = Math.round(r * (255 / maxComponent));
                g = Math.round(g * (255 / maxComponent));
                b = Math.round(b * (255 / maxComponent));
            } else {
                r = Math.round(r);
                g = Math.round(g);
                b = Math.round(b);
            }

            colors.push({
                r: Math.round(r * (255 / maxComponent)),
                g: Math.round(g * (255 / maxComponent)),
                b: Math.round(b * (255 / maxComponent))
            });
        }

        // Assign colors to maps
        for(let i = 0; i < maps.length; i++) {
            maps[i].color = colors[i % numberOfBaseMaps];
        }

        return state.set('internal', Object.assign({}, internalParams, {maps}, {numberOfBaseMaps}, {colors}));
    },

    // Update coefficients
    UPDATE_COEFFICIENTS: (state) => {
        const userParams = state.get('user');
        const internalParams = state.get('internal');

        const {fixMaps, fewerMaps, lessRotation, freeRotation, lessSkew, freeSkew, noReflection, fixAspectRatio,
             greaterTranslation, rotationalSymmetry, dihedralSymmetry, textSymmetry} = userParams;
        let {maps, baseMaps, numberOfBaseMaps, usedDihedralSymmetry, usedRotationalSymmetry, conjugates} = internalParams;

        let maxRotationAngle = 0, maxSkewAngle = 0,
            x0, y0, x1, y1, transX, transY,
            Scale = {
                Min: 0.4,
                Max: 1.0
            };
        const scaleRange = Scale.Max - Scale.Min;

        if(!fixMaps) {
            // reset base maps
            baseMaps = [];

            // calculate new map count
            numberOfBaseMaps = 2 + Math.floor(Math.random() * (fewerMaps ? 2 : 5));

            // calculate rotation angle
            if(lessRotation) {
                maxRotationAngle = Math.PI / 12;
            } else if(freeRotation) {
                maxRotationAngle = 2 * Math.PI;
            }

            // calculate skew angle
            if(freeSkew) {
                maxSkewAngle = Math.random() * Math.PI / 4;
            } else if(lessSkew) {
                maxSkewAngle = Math.random() * Math.PI / 12;
            }


            for(let i = 0; i < numberOfBaseMaps; i++) {
                let rotationAngle = maxRotationAngle * (1 - (2 * Math.random())),
                    skewAngle = maxSkewAngle * (1 - (2 * Math.pow(Math.random(), 3)));
                
                let angle1 = rotationAngle + skewAngle,
                    angle2 = rotationAngle - skewAngle,
                    rad1, rad2;
                
                if(noReflection) {
                    rad1 = Scale.Min + (scaleRange * Math.random());
                    rad2 = fixAspectRatio ? rad1 : Scale.Min + (scaleRange * Math.random());
                } else {
                    rad1 = (Math.random() < 0.5 ? -1 : 1) * (Scale.Min + (scaleRange * Math.random()));
                    rad2 = fixAspectRatio ? rad1 : (Math.random() < 0.5 ? -1 : 1) * (Scale.Min + (scaleRange * Math.random()));
                }

                x0 = rad1 * Math.cos(angle1);
                y0 = rad1 * Math.sin(angle1);

                x1 = -1 * rad2 * Math.sin(angle2);
                y1 = rad2 * Math.cos(angle2);


                if(Math.abs(x0) + Math.abs(x1) > 1) {
                    let totalX = Math.abs(x0) + Math.abs(x1);

                    x0 /= totalX;
                    y0 /= totalX;
                    x1 /= totalX;
                    y1 /= totalX;
                }

                if(Math.abs(y0) + Math.abs(y1) > 1) {
                    let totalY = Math.abs(y0) + Math.abs(y1);

                    x0 /= totalY;
                    y0 /= totalY;
                    x1 /= totalY;
                    y1 /= totalY;
                }

                if(greaterTranslation) {
                    transX = (Math.random() < 0.5 ? -1 : 1) * Math.sqrt(0.75 + (0.25 * Math.random())) * (1 - Math.abs(x0) - Math.abs(x1));
                    transY = (Math.random() < 0.5 ? -1 : 1) * Math.sqrt(0.75 + (0.25 * Math.random())) * (1 - Math.abs(y0) - Math.abs(y1));
                } else {
                    transX = (Math.random() < 0.5 ? -1 : 1) * Math.sqrt(Math.random()) * (1 - Math.abs(x0) - Math.abs(x1));
                    transY = (Math.random() < 0.5 ? -1 : 1) * Math.sqrt(Math.random()) * (1 - Math.abs(y0) - Math.abs(y1));
                }

                baseMaps.push({
                    a: x0,
                    b: x1,
                    c: y0,
                    d: y1,
                    tx: transX,
                    ty: transY
                });
            }
        }

        conjugates = [];
        if(rotationalSymmetry) {
            if((!!textSymmetry) && textSymmetry > 1) {
                usedRotationalSymmetry = true;

                let angle = 2 * Math.PI / textSymmetry;
                for(let i = 0; i < textSymmetry; i++) {
                    let cosine = Math.cos(angle * i),
                        sine = Math.sin(angle * i);
                    
                    // calculate all conjugates for this rotation
                    for(let j = 0; j < baseMaps.length; j++) {
                        let map = baseMaps[j];
                        let {a, b, c, d, tx, ty} = map;

                        conjugates.push({
                            a: (cosine * ((a * cosine) - (b * sine))) - (sine * ((c * cosine) - (d * sine))),
                            b: (cosine * ((a * sine) + (b * cosine))) - (sine * ((c * sine) + (d * cosine))),
                            c: (sine * ((a * cosine) - (b * sine))) + (cosine * ((c * cosine) - (d * sine))),
                            d: (sine * ((a * sine) + (b * cosine))) + (cosine * ((c * sine) + (d * cosine))),
                            tx: (cosine * tx) - (sine * ty),
                            ty: (sine * tx) + (cosine * ty)
                        });
                    }
                }
            }
        }

        if(dihedralSymmetry) {
            usedDihedralSymmetry = true;

            let numberOfConjugates = conjugates.length;
            for(let i = 0; i < baseMaps.length; i++) {
                let map = baseMaps[i];
                let {a, b, c, d, tx, ty} = map;

                conjugates.push({
                    a,
                    b: -b,
                    c: -c,
                    d,
                    tx: -tx,
                    ty
                });
            }

            for(let i = 0; i < numberOfConjugates; i++) {
                let map = conjugates[i];
                let {a, b, c, d, tx, ty} = map;

                conjugates.push({
                    a,
                    b: -b,
                    c: -c,
                    d,
                    tx: -tx,
                    ty
                });
            }
        }

        maps = baseMaps.slice(0);
        if(rotationalSymmetry || dihedralSymmetry) {
            maps = maps.concat(conjugates);
        }

        
        // Update the state
        return state.set('internal', Object.assign({}, internalParams, {maps}, {baseMaps}, {numberOfBaseMaps}, {usedDihedralSymmetry}, {usedRotationalSymmetry}, {conjugates}));
    },

    // Update window coordinates
    UPDATE_WINDOW_COORDINATES: (state) => {
        const userParams = state.get('user'),
              internalParams = state.get('internal');
        
        const {swirl} = userParams;
        let {windowCoordinates, maps} = internalParams;
        let {min, max} = windowCoordinates;
        
        if(swirl) {
            min.X = -1.46;
            min.Y = -1.46;

            max.X = 1.46;
            max.Y = 1.46;

            windowCoordinates.min = min;
            windowCoordinates.max = max;
            return state.set('internal', Object.assign({}, internalParams, {windowCoordinates}));
        }


        // Calculate the composition of all possible map pairs
        for(let i = 0; i < maps.length; i++) {
            for(let j = 0; j < maps.length; j++) {
                const {a:A1, b:B1, c:C1, d:D1, tx:TX1, ty:TY1} = maps[i], // m
                      {a:A2, b:B2, c:C2, d:D2, tx:TX2, ty:TY2} = maps[j]; // n
                
                let a, b, c, d, tx, ty;
                
                a = (A1 * A2) + (B1 * C2);
				b =  (A1 * B2) + (B1 * D2);
				c =  (C1 * A1) + (D1 * C2);
				d =  (C1 * B2) + (D1 * D2);
				tx = (A1 * TX2) + (B1 * TY2) + TX1;
				ty = (C1 * TX2) + (D1 * TY2) + TY1;

                const mapCoordinates = {
                    Min: {
                        X: -Math.abs(a) - Math.abs(b) + tx,
                        Y: -Math.abs(c) - Math.abs(d) + ty
                    },
                    Max: {
                        X:  Math.abs(a) + Math.abs(b) + tx,
                        Y:  Math.abs(c) + Math.abs(d) + ty
                    }
                };

                min.X = Math.min(mapCoordinates.Min.X, min.X);
                min.Y = Math.min(mapCoordinates.Min.Y, min.Y);

                max.X = Math.max(mapCoordinates.Max.X, max.X);
                max.Y = Math.max(mapCoordinates.Max.Y, max.Y);
            }
        }

        // determine the window
        let dx = max.X - min.X,
            dy = max.Y - min.Y;
        
        // maintain aspect ratio
        if(dx < dy) {
            max.X += (0.5 * (dy - dx));
            min.X -= (0.5 * (dy - dx));
            dx = dy;
        } else if(dy < dx) {
            max.Y += (0.5 * (dx - dy));
            min.Y -= (0.5 * (dx - dy));
            dy = dx;
        }

        // margin
        const margin = dx * 0.03;
        min.X -= margin;
        min.Y -= margin;
        max.X += margin;
        max.Y += margin;

        if(max.X === min.X) {
            max.X = 1;
            min.X = -1;
        }

        if(max.Y === min.Y) {
            max.Y = 1;
            min.Y = -1;
        }

        windowCoordinates.min = min;
        windowCoordinates.max = max;
        return state.set('internal', Object.assign({}, internalParams, {windowCoordinates}));
    }
});

