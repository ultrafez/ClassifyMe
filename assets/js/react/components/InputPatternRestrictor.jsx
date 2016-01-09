// Allows restricting of field input to the regex in its "pattern" attribute.
// The "onChange" prop callback will only be called when the field is updated to a valid value.
// The value will be reset to the last good value when focus leaves the field.
class InputPatternRestrictor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.value
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.value,
        });
    }

    onChildChange(e) {
        this.setState({
            value: e.target.value,
        });

        // If the new value of the text field doesn't match the regex pattern, don't inform the parent the field was updated
        let regex = new RegExp(this.props.children.props.pattern);
        if (regex.test(e.target.value)) {
            this.props.onChange(e);
        }
    }

    resetValue() {
        this.setState({
            value: this.props.value,
        });
    }

    render() {
        let newProps = {
            onChange: this.onChildChange.bind(this),
            value: this.state.value,
            onBlur: this.resetValue.bind(this),
        }
        let newElem = React.cloneElement(this.props.children, newProps);

        return newElem;
    }
}

InputPatternRestrictor.propTypes = {
    children: React.PropTypes.element.isRequired,
    onChange: React.PropTypes.func.isRequired,
    value: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
    ]).isRequired,
}

export default InputPatternRestrictor;
