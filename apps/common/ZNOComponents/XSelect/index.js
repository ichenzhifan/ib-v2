import React, {Component} from 'react';
import Select from 'react-select';
import './index.css';

class XSelect extends Component {
	render() {
		const {onChanged, optionComponent, options, searchable, placeholder, arrowRenderer, value, valueComponent } = this.props;
		return (
			<Select arrowRenderer={arrowRenderer}
							onChange={onChanged}
							optionComponent={optionComponent}
							options={options}
							placeholder={placeholder}
							value={value}
							searchable={searchable}
							valueComponent={valueComponent} />
		);
	}
}

export default XSelect;
