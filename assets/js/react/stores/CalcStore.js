import Store from './Store';
import AppDispatcher from '../dispatcher/AppDispatcher';
import CalcConstants from '../constants/CalcConstants';
import EventEmitter from 'events';

let state = {
    aNumber: 0,
};

class CalcStore extends Store {
    constructor() {
        super();
    }

    getState() {
        return state;
    }
}


let calcStoreInstance = new CalcStore();

calcStoreInstance.dispatchToken = AppDispatcher.register(payload => {
    let action = payload.action;

    switch (action.actionType) {
        case CalcConstants.ADD_LOG:
            state.aNumber++;
            break;

        case CalcConstants.REMOVE_LOG:
            state.aNumber--;
            break;
    }

    calcStoreInstance.emitChange();

    return true;
});

export default calcStoreInstance;
