import CalcActions from '../actions/CalcActions';

class LengthSelector extends React.Component {
    onChange(years) {
        CalcActions.changeLength(years);
    }

    render() {
        return (
            <section>
                <h2>1. How long is your degree?</h2>
                <label htmlFor="numYears3" className="radio">
                    <input
                        type="radio"
                        id="numYears3"
                        checked={this.props.years===3}
                        onChange={this.onChange.bind(this, 3)}
                        />3 years
                </label>
                <label htmlFor="numYears4" className="radio">
                    <input
                        type="radio"
                        id="numYears4"
                        checked={this.props.years===4}
                        onChange={this.onChange.bind(this, 4)}
                        />4 years (integrated Master's)
                </label>
            </section>
        );
    }
}

LengthSelector.propTypes = {
    years: React.PropTypes.oneOf([3, 4]).isRequired,
};

export default LengthSelector;
