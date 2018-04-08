import React from 'react';
import classes from './Input.comp.css';

const input = (props) => {
	let inputElement = null;
	let inputClasses = [ classes.InputElement ];
	if (!props.isValid && props.shouldValidate && props.hasTouched) {
		inputClasses.push(classes.InvalidElement);
	}

	switch (props.elementType) {
		case 'input':
			inputElement = (
				<input
					onChange={props.changed}
					className={inputClasses.join(' ')}
					{...props.elementConfig}
					value={props.value}
				/>
			);
			break;
		case 'textarea':
			inputElement = (
				<textarea
					onChange={props.changed}
					className={inputClasses.join(' ')}
					{...props.elementConfig}
					value={props.value}
				/>
			);
			break;
		case 'select':
			let options = props.options || props.elementConfig.options;

			inputElement = (
				<select onChange={props.changed} className={inputClasses.join(' ')} value={props.value}>
					{options.map((opt) => {
						return (
							<option key={opt.value} value={opt.value}>
								{opt.displayName}
							</option>
						);
					})}
				</select>
			);
			break;
		default:
			inputElement = (
				<input
					onChange={props.changed}
					className={inputClasses.join(' ')}
					{...props.elementConfig}
					value={props.value}
				/>
			);
			break;
	}
	return (
		<div className={classes.Input}>
			{props.label && (
				<label className={classes.Label} style={{ color: props.label.color }}>
					{props.label.text}
				</label>
			)}
			{inputElement}
		</div>
	);
};

export default input;
