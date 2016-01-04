import CalcActions from '../actions/CalcActions';
import YearEditor from '../components/YearEditor.jsx';

class ModulesStep extends React.Component {
    resetApp() {
        if (confirm('Are you sure you want to reset all of your entered information?')) {
            CalcActions.resetApp();
        }
    }

    render() {
        return (
            <section>
                <button className="btn btn-small pull-right" onClick={this.resetApp}>Reset</button>
                <h2>2. Enter module results</h2>
                <p>Your module results from previous academic years are available <a href="https://www.shef.ac.uk/exam-results/LDP/previous.html" target="_blank">on the University website</a>.</p>

                {this.props.years.map((year, idx) => (
                    <YearEditor
                        key={idx}
                        year={idx+2}
                        modules={year.modules}
                        isFinalYear={idx===this.props.years.length-1}
                        />
                ))}
            </section>
        );
    }
}

ModulesStep.propTypes = {
    years: React.PropTypes.arrayOf(React.PropTypes.object),
};

export default ModulesStep;
