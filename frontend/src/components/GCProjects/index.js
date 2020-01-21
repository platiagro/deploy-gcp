import React from 'react';
import { connect } from 'react-redux';
import { Select } from 'antd';
import { fetchGCProjects } from '../../redux/actions';

const { Option } = Select;

class GCProjects extends React.Component {

  async componentDidMount() {
    this.props.fetchGCProjects();
  }

  render() {
    const { projects } = this.props;
    return (
      <Select>
        {projects.map(project =>
          <Option value={project.name}>{project.name}</Option>
        )}
      </Select>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    projects: state.gce.projects
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchGCProjects: () => dispatch(fetchGCProjects())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GCProjects);