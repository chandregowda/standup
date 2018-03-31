const updateObject = (oldObject, updatedProperties) => {
	return {
		...oldObject,
		...updatedProperties
	};
};

const validateFormFields = (value, rules) => {
	let isValid = true;
	if (!rules) {
		return isValid;
	}
	value = value.trim();
	if (rules.required) {
		isValid = value !== '';
	}
	if (isValid && rules.minimumLength) {
		isValid = value.length >= rules.minimumLength;
	}
	if (isValid && rules.maximumLength) {
		isValid = value.length <= rules.maximumLength;
	}
	// console.log(`isValid : ${isValid}`);
	return isValid;
};

const inputChangeHandler = ({ state, value, identifier }) => {
	const formFields = { ...state.formFields };
	const updatedFormElement = { ...formFields[identifier] };
	updatedFormElement.value = value;
	updatedFormElement.isValid = validateFormFields(updatedFormElement.value, updatedFormElement.validation);
	updatedFormElement.touched = true;
	formFields[identifier] = updatedFormElement;
	// console.log(updatedFormElement);
	let formIsValid = true;
	for (let inputIdentifer in formFields) {
		formIsValid = formFields[inputIdentifer].isValid && formIsValid;
	}
	return { formFields, formIsValid };
};

export { validateFormFields, inputChangeHandler };

export default updateObject;
