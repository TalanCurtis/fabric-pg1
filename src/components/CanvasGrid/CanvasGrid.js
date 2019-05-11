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
    this.grid = 25;
    this.canvas = new fabric.Canvas(this.canvasId, {
      backgroundColor:"hotpink",
    });
    this.makeGrid();
    this.canvas.on('object:moving', (options)=>{ 
      options.target.set({
        left: Math.round(options.target.left / this.grid) * this.grid,
        top: Math.round(options.target.top / this.grid) * this.grid
      });
    });

    this.canvas.on('object:rotation', options => {
      let target = options.target;
      console.log(target);
    })

    this.canvas.on('object:scaling', options => {
      let target = options.target,
         w = target.width * target.scaleX,
         h = target.height * target.scaleY,
         snap = { // Closest snapping points
            top: Math.round(target.top / this.grid) * this.grid,
            left: Math.round(target.left / this.grid) * this.grid,
            bottom: Math.round((target.top + h) / this.grid) * this.grid,
            right: Math.round((target.left + w) / this.grid) * this.grid
         },
         threshold = this.grid,
         dist = { // Distance from snapping points
            top: Math.abs(snap.top - target.top),
            left: Math.abs(snap.left - target.left),
            bottom: Math.abs(snap.bottom - target.top - h),
            right: Math.abs(snap.right - target.left - w)
         },
         attrs = {
            scaleX: target.scaleX,
            scaleY: target.scaleY,
            top: target.top,
            left: target.left
         };
      switch (target.__corner) {
          case 'tl':
             if (dist.left < dist.top && dist.left < threshold) {
                attrs.scaleX = (w - (snap.left - target.left)) / target.width;
                attrs.scaleY = (attrs.scaleX / target.scaleX) * target.scaleY;
                attrs.top = target.top + (h - target.height * attrs.scaleY);
                attrs.left = snap.left;
             } else if (dist.top < threshold) {
                attrs.scaleY = (h - (snap.top - target.top)) / target.height;
                attrs.scaleX = (attrs.scaleY / target.scaleY) * target.scaleX;
                attrs.left = attrs.left + (w - target.width * attrs.scaleX);
                attrs.top = snap.top;
             }
             break;
          case 'mt':
             if (dist.top < threshold) {
                attrs.scaleY = (h - (snap.top - target.top)) / target.height;
                attrs.top = snap.top;
             }
             break;
          case 'tr':
             if (dist.right < dist.top && dist.right < threshold) {
                attrs.scaleX = (snap.right - target.left) / target.width;
                attrs.scaleY = (attrs.scaleX / target.scaleX) * target.scaleY;
                attrs.top = target.top + (h - target.height * attrs.scaleY);
             } else if (dist.top < threshold) {
                attrs.scaleY = (h - (snap.top - target.top)) / target.height;
                attrs.scaleX = (attrs.scaleY / target.scaleY) * target.scaleX;
                attrs.top = snap.top;
             }
             break;
          case 'ml':
             if (dist.left < threshold) {
                attrs.scaleX = (w - (snap.left - target.left)) / target.width;
                attrs.left = snap.left;
             }
             break;
          case 'mr':
             if (dist.right < threshold) attrs.scaleX = (snap.right - target.left) / target.width;
             break;
          case 'bl':
             if (dist.left < dist.bottom && dist.left < threshold) {
                attrs.scaleX = (w - (snap.left - target.left)) / target.width;
                attrs.scaleY = (attrs.scaleX / target.scaleX) * target.scaleY;
                attrs.left = snap.left;
             } else if (dist.bottom < threshold) {
                attrs.scaleY = (snap.bottom - target.top) / target.height;
                attrs.scaleX = (attrs.scaleY / target.scaleY) * target.scaleX;
                attrs.left = attrs.left + (w - target.width * attrs.scaleX);
             }
             break;
          case 'mb':
             if (dist.bottom < threshold) attrs.scaleY = (snap.bottom - target.top) / target.height;
             break;
          case 'br':
             if (dist.right < dist.bottom && dist.right < threshold) {
                attrs.scaleX = (snap.right - target.left) / target.width;
                attrs.scaleY = (attrs.scaleX / target.scaleX) * target.scaleY;
             } else if (dist.bottom < threshold) {
                attrs.scaleY = (snap.bottom - target.top) / target.height;
                attrs.scaleX = (attrs.scaleY / target.scaleY) * target.scaleX;
             }
             break;
          default:
             break;
      }
      target.set(attrs);
   });

    this.canvas.add(new fabric.Rect({ 
      left: 100, 
      top: 100, 
      width: 50, 
      height: 50, 
      fill: '#faa', 
      originX: 'left', 
      originY: 'top',
      centeredRotation: true,
      lockUniScaling: true,

    }));

    this.canvas.renderAll();
  }



  componentWillUnmount(){
    if(!this.props.isThumbnail){
      window.removeEventListener('resize', this.updateDimensions);
      window.removeEventListener('load', this.updateDimensions, false);
    }
  }
  
  makeGrid(){
    for (let i = 0; i < (600 / this.grid); i++) {
      this.canvas.add(new fabric.Line([ i * this.grid, 0, i * this.grid, 600], { stroke: '#ccc', selectable: false }));
      this.canvas.add(new fabric.Line([ 0, i * this.grid, 600, i * this.grid], { stroke: '#ccc', selectable: false }))
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
        <button onClick={()=>console.log(this.canvas.getObjects())}>Log</button>
      </div>
    )
  }
}

export default CanvasGrid;