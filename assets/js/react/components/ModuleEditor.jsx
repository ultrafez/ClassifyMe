import CalcActions from '../actions/CalcActions';
import InputPatternRestrictor from './InputPatternRestrictor.jsx';
import classNames from 'classnames';

class ModuleEditor extends React.Component {
    updateName(e) {
        CalcActions.setModuleName(this.props.year, this.props.moduleIndex, e.target.value);
    }

    updateCredits(e) {
        CalcActions.setModuleCredits(this.props.year, this.props.moduleIndex, parseInt(e.target.value, 10));
    }

    updateMark(e) {
        CalcActions.setModuleMark(this.props.year, this.props.moduleIndex, e.target.value);
    }

    deleteModule() {
        CalcActions.deleteModule(this.props.year, this.props.moduleIndex);
    }

    getModuleMark() {
        // TODO: return module mark
        return 3.14;
    }

    render() {
        let controlsStyles = classNames({
            'controls-row': true,
            'single-row': this.props.isSingleRow,
        });

        let markStyles = classNames({
            'input-append': true,
            'module-mark': true,
            'failed-module': this.props.assessments[0].mark < 40
        });

        return (
            <div className="module well well-small">
                <div className={controlsStyles}>
                    <input
                        type="text"
                        className="module-name"
                        value={this.props.name}
                        onChange={this.updateName.bind(this)}
                        placeholder="Module name/code (optional)"
                        />
                    <div className="input-append" title="Credits must be multiples of 5">
                        <InputPatternRestrictor onChange={this.updateCredits.bind(this)} value={this.props.credits}>
                            <input
                                type="number"
                                min="0"
                                max="120"
                                step="5"
                                required
                                pattern="^[0-9]*[05]$"
                                className="input-supermini"
                                />
                        </InputPatternRestrictor>
                        <span className="add-on">credits</span>
                    </div>
                    {this.props.isSingleRow ?
                        <span className={markStyles} data-title="Failed module" data-trigger="manual" data-placement="top" data-content="Failing a module means it's down to the examiners to decide whether you should graduate with or without honours.">
                            <InputPatternRestrictor onChange={this.updateMark.bind(this)} value={this.props.assessments[0].mark}>
                                <input
                                    type="number"
                                    className="input-supermini"
                                    min="0"
                                    max="100"
                                    step="1"
                                    required
                                    pattern="^\d+$"
                                    />
                            </InputPatternRestrictor>
                            <span className="add-on">% mark</span>
                        </span>
                        :
                        <span className={markStyles} data-title="Failed module" data-trigger="manual" data-placement="top" data-content="Failing a module means it's down to the examiners to decide whether you should graduate with or without honours.">
                            <input
                                type="text"
                                className="input-supermini"
                                disabled
                                value={this.getModuleMark()}
                                title="The mark for this module is calculated from the assessments that you enter below. Changing the marks for those assessments will update this overall percentage."
                                />
                            <span className="add-on">% mark</span>
                        </span>
                    }
                    <span className="pull-right">
                        <button ng-click="convertToMultiple(module)" className="btn btn-info btn-small" ng-show="module.isSingleRow">Add Assessments...</button>
                        <button onClick={this.deleteModule.bind(this)} className="btn btn-danger btn-small"><i className="icon-trash icon-white"></i> Remove module</button>
                    </span>
                </div>
            </div>
        );
    }
}

ModuleEditor.propTypes = {
    name: React.PropTypes.string.isRequired,
    credits: React.PropTypes.number.isRequired,
    isSingleRow: React.PropTypes.bool.isRequired,
    assessments: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    year: React.PropTypes.number.isRequired,
    moduleIndex: React.PropTypes.number.isRequired,
};

export default ModuleEditor;
