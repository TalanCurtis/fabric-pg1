import React, { Component } from 'react';
import {fabric} from 'fabric';

class CanvasGrid extends Component {
  constructor(props){
    super(props);
    this.canvasId = `myCanvas`;
  }

  componentDidMount(){
    window.addEventListener('resize', this.updateDimensions);
    window.addEventListener('load', this.updateDimensions, false);
    // this.canvas = new fabric.Canvas("myCanvas", {backgroundColor:"green", height:"20px", width:"20px"})
    this.canvas = new fabric.Canvas(this.canvasId, {
      backgroundColor:"hotpink",
    });
    this.canvas.renderAll();
  }


  componentWillUnmount(){
    if(!this.props.isThumbnail){
      window.removeEventListener('resize', this.updateDimensions);
      window.removeEventListener('load', this.updateDimensions, false);
    }
  }

  updateDimensions = () => {
    // update canvas width and height
    let canvasSizer = document.getElementById(`canvasSizer-${this.canvasId}`);
    let width = canvasSizer.offsetWidth ;
    let height = canvasSizer.offsetHeight;
    let ratio = this.canvas.getWidth() / this.canvas.getHeight();
       if((width / height)>ratio){
         width = height*ratio;
       } else {
         height = width / ratio;
       }
    let scale = width / this.canvas.getWidth();
    let zoom = this.canvas.getZoom();
    zoom *= scale;
    this.canvas.setDimensions({ width: width, height: height });
    this.canvas.setViewportTransform([zoom , 0, 0, zoom , 0, 0])
  };

  render(){
    let CanvasGrid = { 
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%",
    }
    let canvasSizer = {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%",
    }
    
    return(
      <div className="CanvasGrid" style={CanvasGrid}>
        CanvasGrid
        <div id={`canvasSizer-${this.canvasId}`} className="canvas-sizer" style={canvasSizer}>
          <div className="innerCanvasContainer" id="innerCanvasContainer">
            <canvas id={this.canvasId}></canvas>
          </div>
        </div>
      </div>
    )
  }
}

export default CanvasGrid;