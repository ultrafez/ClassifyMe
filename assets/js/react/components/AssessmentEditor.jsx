class AssessmentEditor extends React.Component {
    render() {
        return (
            <tr>
                <td className="span5">
                    <input type="text" className="input-block-level" placeholder="e.g. Exam" value={this.props.name} />
                </td>
                <td className="span2">
                    <div className="input-append input-block-level">
                        <input type="number" min="0" max="100" step="any" required className="input-block-level" value={this.props.weight} />
                        <span className="add-on">%</span>
                    </div>
                </td>
                <td className="span2">
                    <div className="input-append input-block-level">
                        <input type="number" min="0" max="100" step="any" required className="input-block-level" value={this.props.mark} />
                        <span className="add-on">%</span>
                    </div>
                </td>
                <td className="span3 form-inline">
                    <div className="pull-right">
                        <label
                            className="checkbox pending-checkbox"
                            title="Highlights the assessment so you can find it easily later, when you know the final mark for it. This doesn't affect classification calculation."
                            >
                            <input type="checkbox" /> Pending Grade
                        </label>
                        <button className="btn btn-small" title="Duplicate this assessment">
                            <i className="icon-copy"></i>
                        </button>
                        <button className="btn btn-danger btn-small" title="Delete this assessment">
                            <i className="icon-trash icon-white"></i>
                        </button>
                    </div>
                </td>
            </tr>
        );
    }
}

AssessmentEditor.propTypes = {
    year: React.PropTypes.number.isRequired,
    moduleIndex: React.PropTypes.number.isRequired,
    assessmentIndex: React.PropTypes.number.isRequired,
    name: React.PropTypes.string.isRequired,
    weight: React.PropTypes.number.isRequired,
    mark: React.PropTypes.number.isRequired,
    pending: React.PropTypes.bool.isRequired,
};

export default AssessmentEditor;
