import { Map, fromJS } from 'immutable';
import { loop, combineReducers } from 'redux-loop-symbol-ponyfill';

import NavigatorStateReducer from '../navigator/NavigatorState';
import UserReducer from '../reducers/UserReducer';
import CompanyReducer from '../reducers/CompanyReducer';
import AchievementReducer from '../reducers/AchievementReducer';
import SparkReducer from '../reducers/SparkReducer';
import AppReducer from '../reducers/AppReducer';
import SessionStateReducer, { RESET_STATE } from '../session/SessionState';
import TaskReducer from '../reducers/TaskReducer';
import StoryReducer from '../reducers/StoryReducer';
import RewardsReducer from '../reducers/RewardsReducer';

const reducers = {
    user: UserReducer,
    company: CompanyReducer,
    achievement: AchievementReducer,
    spark: SparkReducer,
    app: AppReducer,
    story: StoryReducer,
    task: TaskReducer,
    navigatorState: NavigatorStateReducer,
    session: SessionStateReducer,
    rewards: RewardsReducer
};
const immutableStateContainer = Map();
const getImmutable = (child, key) => child ? child.get(key) : void 0;
const setImmutable = (child, key, value) => child.set(key, value);

const namespacedReducer = combineReducers(
    reducers,
    immutableStateContainer,
    getImmutable,
    setImmutable
);

export default function mainReducer(state, action) {
    const [nextState, effects] = action.type === RESET_STATE
        ? namespacedReducer(action.payload, action)
        : namespacedReducer(state || void 0, action);
    return loop(fromJS(nextState), effects);
}
