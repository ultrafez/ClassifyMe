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
    },

    setModuleMark(year, moduleIndex, mark) {
        AppDispatcher.dispatch({
            type: CalcConstants.SET_ASSESSMENT_MARK,
            payload: {
                year,
                moduleIndex,
                assessmentIndex: 0,
                mark,
            },
        })
    },

    deleteModule(year, moduleIndex) {
        AppDispatcher.dispatch({
            type: CalcConstants.DELETE_MODULE,
            payload: {
                year,
                moduleIndex,
            },
        });
    },

    expandModuleAssessments(year, moduleIndex) {
        AppDispatcher.dispatch({
            type: CalcConstants.EXPAND_MODULE_ASSESSMENTS,
            payload: {
                year,
                moduleIndex,
            },
        });        
    },
}

export default CalcActions;
