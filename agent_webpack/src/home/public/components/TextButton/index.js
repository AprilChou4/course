import React, { PureComponent } from 'react';

class TextButton extends PureComponent {
  render() {
    let { disabled, className, children, onClick, ...rest } = this.props;
    const _className = [];
    if (disabled) {
      onClick = undefined;
      _className.push('s-dis');
    } else {
      _className.push('f-cblue');
    }
    if (className) {
      _className.push(className);
    }
    return (
      <a className={_className.join(' ')} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }
}

export default TextButton;
