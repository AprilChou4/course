// 图片放大/缩小/旋转
import React, { Component } from 'react';
import { Icon, message } from 'antd';

class Carousel extends Component {
  currentIndex = 0;

  imgs = [];

  angle = 0;

  constructor(props) {
    super(props);
    this.state = {
      curScale: 100, // 图片缩放比
    };
  }

  componentWillReceiveProps(nextProps) {
    const { imageUrl } = this.props;
    if (nextProps.imageUrl !== imageUrl) {
      this.imgs = [];
      this.currentIndex = 0;
      this.angle = 0;
    }
  }

  wheel = (e) => {
    const code = e.deltaY;
    // 下滚
    if (code > 0) {
      this.zoom();
    } else if (code < 0) {
      this.zoom(true);
    }
  };

  zoom = (flag) => {
    const img = this.imgs[this.currentIndex];
    if (!img) {
      return false;
    }
    let { curScale } = this.state;
    const defaultWidth = img.offsetWidth;
    const defaultHeight = img.offsetHeight;
    const marginTop = parseFloat(img.style.marginTop);
    const marginLeft = parseFloat(img.style.marginLeft);
    let width = defaultWidth;
    let height = defaultHeight;

    // 放大
    if (flag) {
      width += width * 0.2;
      height += height * 0.2;
      if (curScale < 500) {
        curScale += 25;
      } else {
        return false;
      }
    } else {
      width *= 0.8;
      height *= 0.8;
      if (curScale > 25) {
        curScale -= 25;
      } else {
        return false;
      }
    }
    const widthDiff = (width - defaultWidth) / 2;
    const heightDiff = (height - defaultHeight) / 2;

    img.style.marginTop = `${marginTop - heightDiff}px`;
    img.style.marginLeft = `${marginLeft - widthDiff}px`;
    img.style.width = img.style.maxWidth = `${width}px`;
    img.style.height = img.style.maxHeight = `${height}px`;
    this.setState({
      curScale,
    });
  };

  rotate = (flag) => {
    const img = this.imgs[this.currentIndex];
    // 左旋转
    if (flag) {
      if (--this.angle < 0) {
        this.angle = 3;
      }
    } else if (++this.angle > 3) {
      this.angle = 0;
    }

    const deg = this.angle * 90;

    ['webkit', 'moz', 'ms', 'o'].forEach((v) => {
      img.style[`-${v}-transform`] = `rotate(${deg}deg)`;
      img.style[`${v}Transform`] = `rotate(${deg}deg)`;
      img.style['transform-origin'] = '50% 50%';
    });
    // this.reset();
  };

  reset = () => {
    const img = this.imgs[this.currentIndex];
    img.style.width = img.style.height = 'auto';
    img.style.maxWidth = img.style.maxHeight = '100%';
    img.style.marginTop = img.marginTop;
    img.style.marginLeft = img.marginLeft;
  };

  load = (e) => {
    const { target } = e;
    target.style.width = target.style.height = 'auto';
    target.style.maxWidth = target.style.maxHeight = '100%';
    const marginTop = -target.offsetHeight / 2;
    const marginLeft = -target.offsetWidth / 2;
    target.marginTop = target.style.marginTop = `${marginTop}px`;
    target.marginLeft = target.style.marginLeft = `${marginLeft}px`;
    target.style.opacity = 1;
  };

  mouseDown = (e) => {
    this.allowMove = true;
    this.axis = {
      x: e.pageX,
      y: e.pageY,
    };
    e.preventDefault();
  };

  mouseUp = () => {
    this.allowMove = false;
  };

  mouseMove = (e) => {
    if (this.allowMove && this.imgs[this.currentIndex]) {
      const { x, y } = this.axis;
      const img = this.imgs[this.currentIndex];
      const marginTop = parseFloat(img.style.marginTop);
      const marginLeft = parseFloat(img.style.marginLeft);
      img.style.marginTop = `${marginTop + (e.pageY - y)}px`;
      img.style.marginLeft = `${marginLeft + (e.pageX - x)}px`;
      this.axis = {
        x: e.pageX,
        y: e.pageY,
      };
    }
    e.preventDefault();
  };

  // shouldComponentUpdate(nextProps){
  // return nextProps._data !== this.props._data
  // }

  render() {
    const { imageUrl, getContent } = this.props;
    const { curScale } = this.state;
    return (
      <React.Fragment>
        <div
          onMouseMove={this.mouseMove}
          onMouseUp={this.mouseUp}
          className="ui-carousel f-no-select"
        >
          <img
            onMouseDown={(e) => this.mouseDown(e)}
            // onDoubleClick={e=>window.open(v.bigpath)}
            ref={(ele) => ele && this.imgs.push(ele)}
            onWheel={this.wheel}
            onLoad={this.load}
            src={imageUrl}
            alt="图片"
          />
        </div>
        {getContent({
          zoom: this.zoom,
          rotate: this.rotate,
          curScale,
        })}
      </React.Fragment>
    );
  }
}
Carousel.defaultProps = {
  // 图片url
  imageUrl: '',
  // 获取自定义内容
  getContent() {},
};
export default Carousel;
