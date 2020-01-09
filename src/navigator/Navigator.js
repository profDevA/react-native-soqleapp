import React from 'react'
import {createStackNavigator} from 'react-navigation'


import LoginContainer from '../containers/LoginContainer'
import ProfileContainer from '../containers/ProfileContainer'
import CompanyProfileContainer from '../containers/CompanyContainer'
import StoryContainer from '../containers/StoryContainer'
import AgendaContainer from '../containers/AgendaContainer'
import UserTaskGroupContainer from '../containers/UserTaskGroupContainer'
import ChatContainer from '../containers/ChatContainer'
import DashboardContainer from '../containers/DashboardContainer'
import TaskContainer from '../containers/TaskContainer'
import UserListContainer from '../containers/UserListContainer'
import CommentsView from '../containers/CommentsAndLikeContainer'

import UserDetailView from '../views/UserDetailView'
import RewardsContainer from '../containers/RewardsContainer'
import SplashScreenView from '../views/SplashScreenView'
import BraindumpView from '../views/BraindumpView'
import CameraView from '../views/CameraView'
import MessageContainer from "../containers/MessageContainer";
import DecodeContainer from '../containers/DecodeContainer';
import SnapShotView from '../views/SnapShotView';
import FeedView from '../containers/FeedViewContainer';
import InfoView from '../containers/InfoViewContainer'
import IlluminateContainer from '../containers/IlluminateContainer';
import BraindumpContainer from '../containers/BraindumpContainer';
import CameraContainer from '../containers/CameraContainer';
import ShareDetailPage from '../containers/ShareDetailPage';
import ExportView from '../containers/ExporViewContainer';
import UserNotificationView from '../containers/UserNotificationContainer';
import VoiceView from "../views/VoiceView";

const AppNavigator = createStackNavigator({
        Splash: {screen: SplashScreenView},
        Login: {screen: LoginContainer},
        UserTaskGroup: {screen: UserTaskGroupContainer},
        Profile: {screen: ProfileContainer},
        Story: {screen: StoryContainer},
        Task: {screen: TaskContainer},
        CompanyProfile: {screen: CompanyProfileContainer},
        Chat: {screen: ChatContainer},
        Agenda: {screen: AgendaContainer},
        Dashboard: {screen: DashboardContainer},
        UsersList: {screen: UserListContainer},
        UserDetailView: {screen: UserDetailView},
        Rewards: {screen: RewardsContainer},
        CommentsView: {screen: CommentsView},
        BraindumpView: {screen: BraindumpView},
        Braindump: {screen: BraindumpContainer},

        CameraView: {screen: CameraView},
        Camera: {screen: CameraContainer},


        DecodeView: {screen: DecodeContainer},
        MessageContainer: {screen: MessageContainer},
        Illuminate: {screen: IlluminateContainer},
        SnapShotView: {screen: SnapShotView},
        FeedView: {screen: FeedView},
        InfoView: {screen: InfoView},
        ShareDetailPage: {screen: ShareDetailPage},
        ExportView: {screen: ExportView},
        UserNotificationView: {screen: UserNotificationView},
        VoiceView: {screen: VoiceView},
    },
    {
        headerMode: 'none',
        navigationOptions: {
            gesturesEnabled: false,
        }
    }
)

export default AppNavigator
