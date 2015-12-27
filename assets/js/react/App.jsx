// import { AppBar, LeftNav, RaisedButton, Dialog } from 'material-ui';
// const ThemeManager = require('material-ui/lib/styles/theme-manager');

import CalcActions from './actions/CalcActions';
import CalcStore from './stores/CalcStore';

function getState() {
    let {aNumber} = CalcStore.getState();
    return {
        aNumber: aNumber,
    };
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({

        }, getState());

        this._onStoreUpdateBound = this._onStoreUpdate.bind(this);
    }

    _onStoreUpdate() {
        this.setState(getState());
    }

    componentDidMount() {
        CalcStore.addChangeListener(this._onStoreUpdateBound);
    }

    componentWillUnmount() {
        CalcStore.removeChangeListener(this._onStoreUpdateBound);
    }

    incr() {
        CalcActions.add();
    }

    decr() {
        CalcActions.remove();
    }

    render() {
        return (
            <div>
                <span>{this.state.aNumber}</span>
                <button className="btn btn-default" onClick={this.incr}>Incr</button>
                <button className="btn btn-default" onClick={this.decr}>Decr</button>
            </div>
        );
    }
};

export default App;
