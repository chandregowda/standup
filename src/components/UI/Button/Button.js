import React from 'react';
import classes from './Button.comp.css';

const button = (props) => (
	<button
		disabled={props.disabled}
		className={[ classes.Button, classes[props.btnType] ].join(' ')}
		onClick={props.clicked}
	>
		{props.children}
	</button>
);
export default button;
