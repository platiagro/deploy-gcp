import React from 'react';
import { connect } from 'react-redux';
import { Select } from 'antd';
import { fetchGCEZones } from '../../redux/actions';

const { Option } = Select;

class GCEZones extends React.Component {

  async componentDidMount() {
    this.props.fetchGCEZones();
  }

  render() {
    const { zones } = this.props;
    return (
      <Select>
        {zones.map(zone =>
          <Option value={zone.name}>{zone.name}</Option>
        )}
      </Select>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    zones: state.gce.zones
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchGCEZones: () => dispatch(fetchGCEZones())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GCEZones);