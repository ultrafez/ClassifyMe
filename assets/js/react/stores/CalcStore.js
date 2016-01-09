import Store from './Store';
import AppDispatcher from '../dispatcher/AppDispatcher';
import CalcConstants from '../constants/CalcConstants';
import EventEmitter from 'events';
import { cloneDeep } from 'lodash';
import update from 'react-addons-update';

const emptyYear = {
    modules: [],
};

const emptyModule = {
    name: '',
    credits: 20,
    isSingleRow: true,
    assessments: [
        {
            name: 'Whole Module',
            weight: 100,
            mark: 70,
            pending: false,
        },
    ],
}

const cleanState = {
    years: [
        cloneDeep(emptyYear),
        cloneDeep(emptyYear),
    ],
};

class CalcStore extends Store {
    constructor() {
        super();
        this.state = cloneDeep(cleanState);
    }

    getYears() {
        return this.state.years;
    }
}


let csi = new CalcStore();

csi.dispatchToken = AppDispatcher.register(action => {
    switch (action.type) {
        case CalcConstants.RESET_APP:
            csi.state = cloneDeep(cleanState);
            break;

        case CalcConstants.SET_DEGREE_YEARS:
            // Switch between 3 and 4 years
            if (action.payload > csi.state.years.length+1) {
                csi.state = update(csi.state, {years: {$push: [cloneDeep(emptyYear)]}});
            } else if (action.payload < csi.state.years.length+1) {
                csi.state = update(csi.state, {years: {$splice: [[csi.state.years.length-1, 1]]}});
            }
            break;

        case CalcConstants.ADD_MODULE:
            csi.state = update(csi.state, {
                years: {
                    [action.payload-2]: {
                        modules: {
                            $push: [cloneDeep(emptyModule)],
                        },
                    },
                },
            });
            break;

        case CalcConstants.SET_MODULE_NAME:
            csi.state = update(csi.state, {
                years: {
                    [action.payload.year-2]: {
                        modules: {
                            [action.payload.moduleIndex]: {
                                name: {
                                    $set: action.payload.name,
                                },
                            },
                        },
                    },
                },
            });
            break;

        case CalcConstants.SET_MODULE_CREDITS:
            csi.state = update(csi.state, {
                years: {
                    [action.payload.year-2]: {
                        modules: {
                            [action.payload.moduleIndex]: {
                                credits: {
                                    $set: action.payload.credits,
                                },
                            },
                        },
                    },
                },
            });
            break;

        case CalcConstants.SET_ASSESSMENT_MARK:
            csi.state = update(csi.state, {
                years: {
                    [action.payload.year-2]: {
                        modules: {
                            [action.payload.moduleIndex]: {
                                assessments: {
                                    [action.payload.assessmentIndex]: {
                                        mark: {
                                            $set: action.payload.mark,
                                        },
                                    },
                                },
                            },
                        }
                    },
                },
            });
            break;

        case CalcConstants.DELETE_MODULE:
            csi.state = update(csi.state, {
                years: {
                    [action.payload.year-2]: {
                        modules: {
                            $splice: [[action.payload.moduleIndex, 1]]
                        },
                    },
                },
            });
            break;

        case CalcConstants.EXPAND_MODULE_ASSESSMENTS:
            csi.state = update(csi.state, {
                years: {
                    [action.payload.year-2]: {
                        modules: {
                            [action.payload.moduleIndex]: {
                                isSingleRow: {
                                    $set: false,
                                },
                            },
                        },
                    },
                },
            });
            break;

        default:
            console.log('u wot?', action.type);
    }

    csi.emitChange();

    return true;
});

window.store = csi;

export default csi;
