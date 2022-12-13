const testInt = (number: string) => {
    const reInt = /^\d+$/;
    let testInt = false;
    const test = reInt.test(number);
    if (test) {
        testInt = true;
    } else {
        testInt = false;
    }
    return testInt;
};

export default testInt;
