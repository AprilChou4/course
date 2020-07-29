import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './style.less';

class ExportText extends Component {
  onClick = () => {
    const { url, data = {}, target, method } = this.props;
    if (url) {
      const divElement = document.getElementById('downloadDiv');
      ReactDOM.render(
        <form method={method} target={target} action={url}>
          {Object.keys(data).map((item, index) => (
            <input type="hidden" name={item} value={data[item]} key={index} />
          ))}
        </form>,
        divElement,
      );
      divElement.querySelector('form').submit();
      ReactDOM.unmountComponentAtNode(divElement);
    }
  };

  render() {
    const { url, data, target, children, className = '', ...rest } = this.props;
    return (
      <div onClick={this.onClick} {...rest} className={`ui-exprotText ${className}`}>
        <div id="downloadDiv" style={{ display: 'none' }}></div>
        {children}
      </div>
    );
  }
}

ExportText.defaultProps = {
  url: '',
  data: {},
  target: '_blank',
  method: 'post',
};
ExportText.propTypes = {
  url: PropTypes.string,
  data: PropTypes.object,
  target: PropTypes.string,
  method: PropTypes.string,
};
export default ExportText;
