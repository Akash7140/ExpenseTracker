import { useContext, useEffect, useState } from "react";
import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import ErrorOverlay from "../components/ExpensesOutput/UI/ErrorOverlay";
import LoadingOverlay from "../components/ExpensesOutput/UI/LoadingOverlay";
import { ExpensesContext } from "../store/expenses-context";
import { getDateMinusDays } from "../util/date";
import { getExpenses } from "../util/http";


function RecentExpenses() {
    const expensesCtx = useContext(ExpensesContext);

    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState();

    useEffect(() => {

        async function fetchExpenses() {

            setIsFetching(true);
            try {
                const expenses = await getExpenses();
                expensesCtx.setExpenses(expenses);
            } catch (error) {
                setError('could not fetch expenses!')
            }

            setIsFetching(false);


        }

        fetchExpenses();
    }, []);

    function errorHandler() {
        setError(null);
    }

    if (error && !isFetching) {
        return <ErrorOverlay message={error} onConfirm={errorHandler} />
    }

    if (isFetching) {
        return <LoadingOverlay />
    }



    const RecentExpenses = expensesCtx.expenses.filter((expense) => {
        const today = new Date();
        const date7DaysAgo = getDateMinusDays(today, 7);
        return expense.date > date7DaysAgo
    })



    return (
        <ExpensesOutput expenses={RecentExpenses}
            expensesPeriod="last 7 days"
            fallbackText="No Recent expenses"
        />
    )
}

export default RecentExpenses;