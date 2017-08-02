require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

var ImgFigure = React.createClass({
  handleClick:function(e){
      if(this.props.arrange.isCenter){
        this.props.inverse();
      }else{
        this.props.center();
      }
      e.stopPropagation();
      e.preventDefault();
  },
  render:function(){
    var styleObj ={}
    if(this.props.arrange.pos){
      styleObj =  this.props.arrange.pos;
    }

    if(this.props.arrange.rot){
          (['MozTransform','MsTransform','WebkitTransform','transform']).forEach(function(v){
                styleObj[v]='rotate('+this.props.arrange.rot +'deg)' ;
          }.bind(this))
    }
    var imgFigureClassName = 'img-figure';
        imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';
    if(this.props.arrange.isCenter){
      styleObj.zIndex =20
    }
    return (
      <figure className = {imgFigureClassName} ref="img" style={styleObj} onClick = {this.handleClick}>
        <img src ={this.props.data.src} alt = {this.props.data.title}  />
        <figcation>
          <h2 className = 'img-title'>{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcation>
      </figure>
    )
  }
});

export default ImgFigure;