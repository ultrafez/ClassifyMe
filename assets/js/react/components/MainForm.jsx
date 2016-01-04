import LengthSelector from './LengthSelector.jsx';
import ModulesStep from './ModulesStep.jsx';

class MainForm extends React.Component {
    render() {
        return (
            <div className="">
                <LengthSelector years={this.props.years.length+1} />
                <hr />
                <ModulesStep years={this.props.years} />
            </div>
        );
    }
}

MainForm.propTypes = {
    years: React.PropTypes.arrayOf(React.PropTypes.shape(
        {
            modules: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
        }
    )).isRequired,
}

export default MainForm;
