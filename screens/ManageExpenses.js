import { useContext, useLayoutEffect, useState } from "react";
import { TextInput, View, StyleSheet } from "react-native";
import ExpenseForm from "../components/ExpensesOutput/ManageExpense/ExpenseForm";
import ErrorOverlay from "../components/ExpensesOutput/UI/ErrorOverlay";
//import { TextInput } from "react-native-gesture-handler";
import IconButton from "../components/ExpensesOutput/UI/IconButton";
import LoadingOverlay from "../components/ExpensesOutput/UI/LoadingOverlay";
import { GlobalStyles } from "../constants/styles";
import { ExpensesContext } from "../store/expenses-context";
import { deleteExpense, storeExpense, updateExpense } from "../util/http";

function ManageExpense({ route, navigation }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState();
    const expenseCtx = useContext(ExpensesContext);

    const editedExpenseId = route.params?.expenseId;
    const isEditing = !!editedExpenseId;

    const selectedExpense = expenseCtx.expenses.find(expense => expense.id === editedExpenseId)

    useLayoutEffect(() => {
        navigation.setOptions({
            title: isEditing ? 'Edit Expense' : 'Add Expense'
        })
    }, [navigation, isEditing]);

    async function deleteExpenseHandler() {
        setIsSubmitting(true);
        try {
            await deleteExpense(editedExpenseId);
            expenseCtx.deleteExpense(editedExpenseId);
            navigation.goBack();
        } catch (error) {
            setError('could not delete Expense');
            setIsSubmitting(false);
        }

    }
    function cancelHandler() {
        navigation.goBack();
    }
    async function confirmHandler(expenseData) {
        setIsSubmitting(true);
        try {
            if (isEditing) {
                expenseCtx.updateExpense(editedExpenseId, expenseData);
                await updateExpense(editedExpenseId, expenseData);
            } else {
                const id = await storeExpense(expenseData);
                expenseCtx.addExpense({ ...expenseData, id: id });
            }
            navigation.goBack();

        } catch (error) {
            setError(`could not ${isEditing ? "edit" : "add"} expense`);
            setIsSubmitting(false);
        }

    }

    function errorHandler() {
        setError(null);
    }


    if (error && !isSubmitting) {
        return <ErrorOverlay message={error} onConfirm={errorHandler} />
    }

    if (isSubmitting) {
        return <LoadingOverlay />;
    }


    return (
        <View style={styles.container}>
            <ExpenseForm
                cancelHandler={cancelHandler}
                confirmHandler={confirmHandler}
                submitLabel={isEditing ? 'Update' : 'Add'}
                onSubmit={confirmHandler}
                defaultValues={selectedExpense}
            />
            {isEditing &&
                <View style={styles.deleteContainer}>
                    <IconButton icon="trash"
                        color={GlobalStyles.colors.error500}
                        size={36}
                        onPress={deleteExpenseHandler} />
                </View>
            }
        </View>
    )
}

export default ManageExpense;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: GlobalStyles.colors.primary800
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        minWidth: 120,
        marginHorizontal: 8
    },
    deleteContainer: {
        marginTop: 16,
        paddingTop: 8,
        borderTopWidth: 2,
        borderTopColor: GlobalStyles.colors.primary200,
        alignItems: 'center'
    }
});