import AppDispatcher from '../dispatcher/AppDispatcher';
import CalcConstants from '../constants/CalcConstants';

const CalcActions = {
    changeLength(years) {
        AppDispatcher.dispatch({
            type: CalcConstants.SET_DEGREE_YEARS,
            payload: years,
        });
    },

    resetApp() {
        AppDispatcher.dispatch({
            type: CalcConstants.RESET_APP,
        });
    },

    addModule(year) {
        AppDispatcher.dispatch({
            type: CalcConstants.ADD_MODULE,
            payload: year,
        });
    },

    setModuleName(year, moduleIndex, name) {
        AppDispatcher.dispatch({
            type: CalcConstants.SET_MODULE_NAME,
            payload: {
                year,
                moduleIndex,
                name,
            },
        })
    },

    setModuleCredits(year, moduleIndex, credits) {
        AppDispatcher.dispatch({
            type: CalcConstants.SET_MODULE_CREDITS,
            payload: {
                year,
                moduleIndex,
                credits,
            },
        })
    }
}

export default CalcActions;
