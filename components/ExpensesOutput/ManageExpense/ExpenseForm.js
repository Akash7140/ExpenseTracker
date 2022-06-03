import { useState } from "react";
import { View, StyleSheet, Text, Alert } from "react-native";
import Input from "./Input";
import Button from "../UI/Button";
import { GlobalStyles } from "../../../constants/styles";

function ExpenseForm({ cancelHandler, confirmHandler, submitLabel, defaultValues }) {


    const [inputs, setInputs] = useState({
        amount: {
            value: defaultValues ? defaultValues.amount.toString() : '',
            isValid: true
        },
        date: {
            value: defaultValues ? defaultValues.date.toISOString().slice(0, 10) : '',
            isValid: true
        },
        description: {
            value: defaultValues ? defaultValues.description : '',
            isValid: true
        }
    });

    function inputChangeHandler(inputIdentifier, enteredValue) {
        setInputs((curInputs) => {
            return (
                {
                    ...curInputs,
                    [inputIdentifier]: { value: enteredValue, isValid: true }
                }
            )
        });

    }

    function submitHandler() {
        const expenseData = {
            amount: +inputs.amount.value,
            date: new Date(inputs.date.value),
            description: inputs.description.value
        }

        const amountIsValid = !isNaN(expenseData.amount) && expenseData.amount > 0;
        const dateIsValid = expenseData.date.toString() !== 'Invalid Date';
        const descriptionIsValid = expenseData.description.trim().length > 0;

        if (!amountIsValid || !dateIsValid || !descriptionIsValid) {

            setInputs((curInputs) => {
                return {
                    amount: { value: curInputs.amount.value, isValid: amountIsValid },
                    date: { value: curInputs.amount.date, isValid: dateIsValid },
                    description: { value: curInputs.amount.description, isValid: descriptionIsValid }

                }
            })

            return;
        }


        confirmHandler(expenseData);
    }

    const formIsInvalid = !inputs.amount.isValid || !inputs.date.isValid || !inputs.description.isValid;

    return (
        <View style={styles.form}>
            <Text style={styles.title}>Your Expense</Text>
            <View style={styles.container}>
                <Input style={styles.rowInput}
                    label="Amount"
                    invalid={!inputs.amount.isValid}
                    textInputConfig={{
                        keyboardType: 'decimal-pad',
                        onChangeText: inputChangeHandler.bind(this, 'amount'),
                        value: inputs.amount.value
                    }} />
                <Input style={styles.rowInput}
                    invalid={!inputs.date.isValid}
                    label="Date"
                    textInputConfig={{
                        placeholder: 'YYYY-MM-DD',
                        keyboardType: 'decimal-pad',
                        maxLength: 10,
                        onChangeText: inputChangeHandler.bind(this, 'date'),
                        value: inputs.date.value
                    }} />
            </View>
            <Input label="Description"
                invalid={!inputs.description.isValid}
                textInputConfig={{
                    multiline: true,
                    autoCorrect: false,
                    autoCapitalize: 'sentences',
                    onChangeText: inputChangeHandler.bind(this, 'description'),
                    value: inputs.description.value
                }} />
            {formIsInvalid && <Text style={styles.errorText}>Invalid input values - please check your entered data</Text>}
            <View style={styles.buttonContainer}>
                <Button mode="flat" onPress={cancelHandler} style={styles.button}>
                    Cancel
                </Button>
                <Button onPress={submitHandler} style={styles.button}>
                    {submitLabel}
                </Button>
            </View>
        </View>
    )
}


export default ExpenseForm;

const styles = StyleSheet.create({
    form: {
        marginTop: 0
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
        textAlign: 'center'
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between'

    },
    rowInput: {
        flex: 1
    },
    errorText: {
        color: GlobalStyles.colors.error500,
        textAlign: 'center',
        margin: 8
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        minWidth: 120,
        marginHorizontal: 8
    }
})