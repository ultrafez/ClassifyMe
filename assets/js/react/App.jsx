// import { AppBar, LeftNav, RaisedButton, Dialog } from 'material-ui';
// const ThemeManager = require('material-ui/lib/styles/theme-manager');

import CalcActions from './actions/CalcActions';
import CalcStore from './stores/CalcStore';
import MainForm from './components/MainForm.jsx';

function getState() {
    return {
        years: CalcStore.getYears(),
    };
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = getState();
        this.showStore = false;

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

    toggleStore() {
        this.showStore = !this.showStore;
        this.forceUpdate();
    }

    render() {
        return (
            <div>
                <button onClick={CalcActions.resetApp}>Reset App</button>
                <MainForm years={this.state.years} />
                <hr style={{borderTopColor: 'red'}} />

                <div style={{position: 'fixed', top: 0, left: 0, bottom: 0, overflow: 'auto'}}>
                    <button onClick={this.toggleStore.bind(this)}>Toggle Store</button>
                    {this.showStore ?
                        <pre>
                            {JSON.stringify(this.state.years, null, 2)}
                        </pre>
                        : null
                    }
                </div>
            </div>
        );
    }
};

export default App;
