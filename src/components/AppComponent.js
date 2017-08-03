require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import data from '../data/imageDatas';
import ControllerUnit from './ControllerUnit';
import ImgFigure from './ImgFigure';

var imgdatas = data.map(function (v) {
    // v.src=('./images/'+v.fileName)
    v.src = ('../images/' + v.fileName)
    return v
})

var AppComponent = React.createClass({
    Constant: {
        centerPos: {
            left: 0,
            right: 0
        },
        hPosRange: {//左右两侧区域
            leftSecX: [0, 0],
            rightSecX: [0, 0],
            y: [0, 0]
        },
        vPosRange: {//导航栏上方区域(主图片顶上的距离)
            topY: [0, 0],
            x: [0, 0]
        }
    },
    inverse: function (index) {
        return function () {
            var imgsArrangeArr = this.state.imgsArrangeArr;
            imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
            this.setState({
                imgsArrangeArr: imgsArrangeArr
            })
        }.bind(this);
    }
    ,
    /*
     *利用 rearrange函数居中哟
     *@param参数 index,需要居中的的图片的index
     *@return 一个方法
     */
    center: function (index) {
        return function () {
            this.rarrange(index)
        }.bind(this);
    }
    ,
//从新布局图片指定需要居中的的index
    rarrange: function (centerIndex) {
        function getRangeRandom(low, high) {
            return Math.ceil(Math.random() * (high - low) + low)
        }

        function get30DegRandom() {
            return (Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30)
        }

        var imgsArrangeArr = this.state.imgsArrangeArr,
            Constant = this.Constant,
            centerPos = Constant.centerPos,
        //  hPosRange = Constant.hPosRange,
        //  vPosRange = Constant.vPosRange,
            hPosRangeLeftSecX = Constant.hPosRange.leftSecX,
            hPosRangeRightSecX = Constant.hPosRange.rightSecX,
            hPosRangeY = Constant.hPosRange.y,
            vPosRangeTopY = Constant.vPosRange.topY,
            vPosRangeX = Constant.vPosRange.x,

            imgsArrangeTopArr = [],
            topImgNum = Math.floor(Math.random() * 2),//上边取一个或者不取
            topImgSpliceIndex = 0,//上索引值的起始
            imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
        //设置中部的坐标
        imgsArrangeCenterArr[0].pos = centerPos;
        imgsArrangeCenterArr[0].rot = 0;
        imgsArrangeCenterArr[0].isCenter = true;
        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);
        imgsArrangeTopArr.forEach(function (v) {
            v.pos = {
                top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
            };
            v.rot = get30DegRandom()
            v.isCenter = false;
        });
        for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
            var hPosRangeLORX = null;
            if (i < k) {
                hPosRangeLORX = hPosRangeLeftSecX;
            } else {
                hPosRangeLORX = hPosRangeRightSecX;
            }
            imgsArrangeArr[i].pos = {
                top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
            }
            imgsArrangeArr[i].rot = get30DegRandom();
            imgsArrangeArr[i].isCenter = false;
        }
        //回复原数组
        if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
            imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
        }
        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0])
        this.setState({
            imgsArrangeArr: imgsArrangeArr
        });
    }
    ,
    getInitialState: function () {
        return {
            imgsArrangeArr: [
                /*{
                 pos:{
                 left:'0',
                 top:'0'
                 },
                 rotate:0,
                 isInverse:false,
                 isCenter:false
                 }
                 */
            ]
        }
    },

    componentDidMount: function () {
        // 组件加载后为,为每张图片计算他的位置范围
        // var stageDOM = React.findDOMNode(this.refs.stage);
        var stageDOM = this.refs.stage,
            stageW = stageDOM.scrollWidth,
            stageH = stageDOM.scrollHeight,
            halfStageW = Math.ceil(stageW / 2),
            halfStageH = Math.ceil(stageH / 2);
        // var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),//这种方法需要应用reactdom
        var imgFigureDOM = this.refs.imgFigure0.refs.img,
            imgW = imgFigureDOM.scrollWidth,
            imgH = imgFigureDOM.scrollHeight,
            halfImgW = Math.ceil(imgW / 2),
            halfImgH = Math.ceil(imgH / 2);

        //计算中心图片的位置点
        this.Constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
        }
        //两侧赋值
        this.Constant.hPosRange.leftSecX[0] = -halfImgW;
        this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
        this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
        this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
        this.Constant.hPosRange.y[0] = -halfImgH;
        this.Constant.hPosRange.y[1] = stageH - halfImgH;

        //上侧赋值
        this.Constant.vPosRange.topY[0] = -halfImgW
        this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3
        this.Constant.vPosRange.x[0] = halfStageW - imgW
        this.Constant.vPosRange.x[1] = halfStageW;
        this.rarrange(1)
    },

    render: function () {
        var contrllerUnits = [];
        return (
            < section
                className="stage"
                ref="stage">
                < section
                    className="img-sec">
                    {imgdatas.map(function (v, i) {
                            if (!this.state.imgsArrangeArr[i]) {
                                this.state.imgsArrangeArr[i] = {
                                    pos: {
                                        left: 0,
                                        top: 0
                                    },
                                    rot: 0,
                                    isInverse: false,
                                    isCenter: false,
                                    index: i
                                }
                            }
                            contrllerUnits.push(< ControllerUnit
                                key={i}
                                arrange={this.state.imgsArrangeArr[i]
    }
                                inverse={this.inverse(i)
}
                                center={this.center(i)
}/>)
                            return ( < ImgFigure
                                data={v}
                                key={i}
                                ref={'imgFigure'+i}
                                arrange={this.state.imgsArrangeArr[i]
}
                                inverse={this.inverse(i)
}
                                center={this.center(i)
}/>)
                        }.
                            bind(this)
                    )}
                </section >
                < nav className='controller-nav'>{contrllerUnits}< / nav >
                        </section >
                            )
                            }
                            })

                            export default AppComponent;