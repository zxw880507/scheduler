import React from "react";

import "components/Button.scss";
const classNames = require('classnames');


export default function Button(props) {
    
    const buttonClassNames = classNames({'button': true, 'button--confirm': props.confirm, 'button--danger': props.danger});
    
  return <button 
  className={buttonClassNames} 
  onClick={props.onClick} 
  disabled={props.disabled}>{props.children}
  </button>;
}
