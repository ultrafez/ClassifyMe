import AppDispatcher from '../dispatcher/AppDispatcher';
import CalcConstants from '../constants/CalcConstants';

const CalcActions = {
    add() {
        AppDispatcher.dispatch({
            action: {
                actionType: CalcConstants.ADD_LOG,
            },
        });
    },

    remove() {
        AppDispatcher.dispatch({
            action: {
                actionType: CalcConstants.REMOVE_LOG,
            },
        });
    },
}

export default CalcActions;
