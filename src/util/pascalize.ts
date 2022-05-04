function clearAndUpper (text: string) {
	return text.replace(/-/, "").toUpperCase();
}

const pascalize = (text: string) => {
	return text.replace(/(^\w|-\w)/g, clearAndUpper);
};

export default pascalize;