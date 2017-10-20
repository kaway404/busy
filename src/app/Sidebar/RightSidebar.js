import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import people from '../../helpers/people';
import {
  getIsAuthenticated,
  getAuthenticatedUser,
  getIsAuthFetching,
  getFollowingList,
} from '../../reducers';
import InterestingPeople from '../../components/Sidebar/InterestingPeople';
import InterestingPeopleWithAPI from '../../components/Sidebar/InterestingPeopleWithAPI';
import PostRecommendation from '../../components/Sidebar/PostRecommendation';
import StartNow from '../../components/Sidebar/StartNow';
import SignUp from '../../components/Sidebar/SignUp';

@connect(state => ({
  authenticated: getIsAuthenticated(state),
  authenticatedUser: getAuthenticatedUser(state),
  authFetching: getIsAuthFetching(state),
  followingList: getFollowingList(state),
}))
export default class RightSidebar extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    authenticatedUser: PropTypes.shape().isRequired,
    authFetching: PropTypes.bool.isRequired,
    followingList: PropTypes.arrayOf(PropTypes.string).isRequired,
    showPostRecommendation: PropTypes.bool,
  };

  static defaultProps = {
    showPostRecommendation: false,
  };
  constructor(props) {
    super(props);
    this.state = {
      randomPeople: this.getRandomPeople(),
    };
  }

  getRandomPeople = () =>
    people
      .reduce((res, item) => {
        if (!this.props.followingList.includes(item)) {
          res.push({ name: item });
        }
        return res;
      }, [])
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);

  handleRefreshInterestingPeople = () =>
    this.setState({
      randomPeople: this.getRandomPeople(),
    });

  render() {
    const { authenticated, authenticatedUser, authFetching, showPostRecommendation } = this.props;
    return (
      <div>
        {!authenticated && <SignUp />}
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <div>
                {authenticatedUser.last_root_post === '1970-01-01T00:00:00' && <StartNow />}
                <InterestingPeople
                  users={this.state.randomPeople}
                  onRefresh={this.handleRefreshInterestingPeople}
                />
              </div>
            )}
          />
          <Route
            path="/@:name"
            component={() => (
              <InterestingPeopleWithAPI
                authenticatedUser={authenticatedUser}
                authFetching={authFetching}
              />
            )}
          />
        </Switch>
        {showPostRecommendation && <PostRecommendation isAuthFetching={authFetching} />}
      </div>
    );
  }
}
