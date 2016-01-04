import CalcActions from '../actions/CalcActions';
import ModuleEditor from './ModuleEditor.jsx';

class YearEditor extends React.Component {
    // TODO: put this in store
    getPendingAssessmentCount() {
        return this.props.modules.reduce((accumulator, mod) => {
            return accumulator + mod.assessments.reduce((acc, assessment) => {
                return acc + assessment.pending?1:0;
            }, 0);
        }, 0);
    }

    // TODO: put this in store
    getTotalCredits() {
        return this.props.modules.reduce((accumulator, mod) => {
            return accumulator + mod.credits;
        }, 0);
    }

    // TODO
    getCreditsNeeded() {
        return 0;
    }

    addModule() {
        CalcActions.addModule(this.props.year);
    }

    render() {
        let numPending = this.getPendingAssessmentCount();
        let credits = this.getTotalCredits();
        let creditsNeeded = Math.max(0, 120 - credits);
        let creditsOver = Math.max(0, credits - 120);

        return (
            <fieldset className="year">
                <legend>Year {this.props.year}
                    {numPending>0 ?
                        <small>{numPending} pending assessment{numPending>1 ? 's' : ''}</small>
                        : null
                    }
                    {credits===120 ?
                        <span className="pull-right">Overall TODO%</span>
                        : null
                    }
                </legend>
                {this.props.isFinalYear ?
                    <div className="alert alert-info">
                        <strong>Don't know all of your module results?</strong> You can click "Add Assessments" for a module to enter your individual assignment/exam marks that you already know, and estimate how well you think you'll do at the rest.
                    </div>
                    : null
                }
                {this.props.modules.map((mod, idx) => (
                    <ModuleEditor
                        name={mod.name}
                        credits={mod.credits}
                        isSingleRow={mod.isSingleRow}
                        assessments={mod.assessments}
                        year={this.props.year}
                        moduleIndex={idx}
                        key={idx}
                        />
                ))}
                {creditsNeeded > 0 ?
                    <div>
                        <button className="btn btn-primary" onClick={this.addModule.bind(this)}><i className="icon-plus"></i> Add module</button>&nbsp;
                        <span className="text-error">You need to add modules worth an extra {creditsNeeded} credits to this year to reach the full 120 credits.</span>
                    </div>
                    :
                    <div>
                        {creditsOver>0 ?
                            <p className="text-error">Your modules total {credits} credits for this year; remove {creditsOver} credits worth of modules to get to a total of 120 credits.</p>
                            : null
                        }
                        <button className="btn" onClick={this.addModule.bind(this)}><i className="icon-plus"></i> Add module</button>
                    </div>
                }
            </fieldset>
        );
    }
}

YearEditor.propTypes = {
    year: React.PropTypes.number.isRequired,
    modules: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    isFinalYear: React.PropTypes.bool.isRequired,
}

export default YearEditor;
