
import { createContext, useReducer } from "react";

export const ExpensesContext = createContext({
    expenses: [],
    setExpenses: () => { },
    addExpense: ({ description, amount, date }) => { },
    deleteExpense: (id) => { },
    updateExpense: (id, { description, amount, date }) => { }
});

function expensesReducer(state, action) {
    switch (action.type) {
        case "ADD":

            return [action.payload, ...state];

        case "UPDATE":
            const updateableExpenseIndex = state.findIndex(
                (expense) => expense.id === action.payload.id
            );
            const updateableExpense = state[updateableExpenseIndex];
            const updateItem = { ...updateableExpense, ...action.payload.data };
            const updatedExpense = [...state]
            updatedExpense[updateableExpenseIndex] = updateItem;
            return updatedExpense;

        case "DELETE":
            return state.filter((expense) => expense.id !== action.payload);
        default:
            return state;

        case 'SET':
            const inverted = action.payload.reverse();
            return inverted;
    }
}

function ExpenseContextProvider({ children }) {
    const [expensesState, dispatch] = useReducer(expensesReducer, []);

    function addExpense(expenseData) {
        dispatch({ type: 'ADD', payload: expenseData })
    }

    function deleteExpense(id) {
        dispatch({ type: 'DELETE', payload: id })
    }

    function updateExpense(id, expenseData) {
        dispatch({ type: 'UPDATE', payload: { id: id, data: expenseData } })
    }

    function setExpenses(expenses) {
        dispatch({ type: 'SET', payload: expenses })
    }

    const value = {
        expenses: expensesState,
        addExpense: addExpense,
        deleteExpense: deleteExpense,
        updateExpense: updateExpense,
        setExpenses: setExpenses
    };

    return (
        <ExpensesContext.Provider value={value}>
            {children}
        </ExpensesContext.Provider>
    )
}

export default ExpenseContextProvider;