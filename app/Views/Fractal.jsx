import React, {Component} from "react";
import {connect} from "react-redux";
import "./Fractal.scss";

class Fractal extends Component {
    //TODO an animation to show fractal is being generated

    generateFractal = () => {
        const {windowCoordinates, maps, stylingProperties, iterationCount, buffer} = this.props;
        const {max, min} = windowCoordinates;
        const fractalCanvas = this.refs.fractalCanvas;
        const width = fractalCanvas.width,
              height = fractalCanvas.height;

        let x = 1 - (2 * Math.random()),
            y = 1 - (2 * Math.random()),
            red = 0, green = 0, blue = 0,
            Slope = {
                X: width / (max.X - min.X),
                Y: height / (max.Y - min.Y)
            },
            tempX, matrix, maxCount = 0,
            context = fractalCanvas.getContext('2d');

        // FILL BACKGROUND
        // context.fillStyle = "#000000";
        // context.fillRect(0, 0, width, height);
        
        // GET IMAGE DATA
        let imageData = context.getImageData(0, 0, width, height);
        const pixelData = imageData.data;
        let newPixelData = pixelData;


        // STABILISING ITERATIONS
        for(let i = 0; i < 20; ++i) {
            // pick a random map and apply it
            matrix = maps[~~(Math.random() * (maps.length - 1))];
            const {a, b, c, d, tx, ty, color} = matrix;
            
            tempX = (a * x) + (b * y) + tx;
            y = (c * x) + (d * y) + ty;
            x = tempX;
            let squaredSum = (x * x) + (y * y);

            if(stylingProperties.bubble) {
                let bubbleFactor = (2 + Math.sqrt(squaredSum)) / 3
                x /= bubbleFactor;
                y /= bubbleFactor;

                squaredSum = (x * x) + (y * y);
            }

            if(stylingProperties.swirl) {
                let cosine = Math.cos(squaredSum),
                    sine = Math.sin(squaredSum);

                tempX = (x * sine) - (y * cosine);
                y = (x * cosine) + (y * sine);
                x = tempX;
            }

            if(!stylingProperties.grayscale) {
                red = (red + color.r) / 2;
                green = (green + color.g) / 2;
                blue = (blue + color.b) / 2;
            }
        }

        // DISPLAY ITERATIONS
        for(let i = 0; i < iterationCount; i++) {
            matrix = maps[~~(Math.random() * (maps.length - 1))];
            const {a, b, c, d, tx, ty, color} = matrix;
            
            tempX = (a * x) + (b * y) + tx;
            y = (c * x) + (d * y) + ty;
            x = tempX;
            let squaredSum = (x * x) + (y * y);

            if(stylingProperties.bubble) {
                let bubbleFactor = (2 + Math.sqrt(squaredSum)) / 3
                x /= bubbleFactor;
                y /= bubbleFactor;
            }

            if(stylingProperties.swirl) {
                squaredSum = (x * x) + (y * y);

                let cosine = Math.cos(squaredSum),
                    sine = Math.sin(squaredSum);

                tempX = (x * sine) - (y * cosine);
                y = (x * cosine) + (y * sine);
                x = tempX;
            }

            if(!stylingProperties.grayscale) {
                red = (red + color.r) / 2;
                green = (green + color.g) / 2;
                blue = (blue + color.b) / 2;
            }

            // Calculate pixel data
            let pixel = {
                X: ~~(0.5 + (Slope.X * (x - min.X))),
                Y: ~~(0.5 + (Slope.Y * (y - min.Y)))
            };

            if((pixel.X < width) && (pixel.Y < height) && (pixel.X >= 0) && (pixel.Y >= 0)) {
                // Write to buffer and image data
                let index = ~~(pixel.X + (width * pixel.Y));
                let index4 = 4 * index;
                let bufferAmount = ++buffer[index];
                
                bufferAmount > maxCount && (maxCount = bufferAmount);
                
                if(stylingProperties.grayscale) {
                    if(pixelData[index4] !== 255) {
                        newPixelData[index4] = 255;
                        newPixelData[index4 + 1] = 255;
                        newPixelData[index4 + 2] = 255;
                    }
                } else {
                    newPixelData[index4] = (red + (bufferAmount * pixelData[index4])) / (bufferAmount + 1);
                    newPixelData[index4 + 1] = (green + (bufferAmount * pixelData[index4 + 1])) / (bufferAmount + 1);
                    newPixelData[index4 + 2] = (blue + (bufferAmount * pixelData[index4 + 2])) / (bufferAmount + 1);
                }
            }
        }
        // console.log('pixels', newPixelData);

        // RENDER
        for(let i = 0; i < (width * height); i++) {
            // optimise by avoiding log for zero count
            if(buffer[i] !== 0) {
                let multiplyingFactor = Math.pow(Math.log(1 + (buffer[i] / maxCount)) / Math.LN2, stylingProperties.gamma);
                // console.log('multiplyingFactor', multiplyingFactor);
                newPixelData[(i * 4) + 3] = ~~(255 * multiplyingFactor);
            }
        }
        // console.log('newPixels', newPixelData);

        //TODO: FREE MEMORY => Dispatch an action to set buffer = []

        // Draw the generated data
        let newImageData = context.createImageData(imageData.width, imageData.height);
        for(let i = 0; i < newPixelData.length; i++) {
            newImageData.data[i] = newPixelData[i];
        }
        context.putImageData(newImageData, 0, 0);

        // Finish up
        //context.globalCompositionOperation = "destination-over";
        
        //context.globalCompositionOperation = "source-over";
    }

    componentDidMount() {
        this.generateFractal();
    }

    render() {
        return (
            <canvas ref="fractalCanvas" style={this.props.dimensions} />
        );
    }
}

const mapStateToProps = (state) => {
    const userParams = state.getIn(['ParameterState', 'user']);
    const internalParams = state.getIn(['ParameterState', 'internal']);

    return {
        buffer: internalParams.buffer,
        windowCoordinates: internalParams.windowCoordinates,
        maps: internalParams.maps,
        stylingProperties: userParams,
        iterationCount: userParams.numberOfPoints
    };
}

export default connect(mapStateToProps, null)(Fractal);