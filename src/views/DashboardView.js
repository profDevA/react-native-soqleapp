import React from 'react'
import { Text, View, SafeAreaView } from 'react-native'
import { Tab, Tabs, ScrollableTab } from 'native-base'

import Header from '../components/Header'
import AchievementView from './AchievementView'
import LevelView from './LevelView'
import SparkView from './SparkView'
import RewardsView from './RewardsView'
import styles from '../stylesheets/dashboardViewStyles'

const DashboardView = props => {
  const tabs = [
    {
      key: 'rewards',
      label: 'Rewards',
      component: (<RewardsView {...props} />)
    },
    {
      key: 'achievements',
      label: 'Achievements',
      component: (<AchievementView {...props} />)
    },
    {
      key: 'levels',
      label: 'Levels',
      component: (<LevelView {...props} />)
    },
    {
      key: 'sparks',
      label: 'Sparks',
      component: (<SparkView {...props} />)
    }
  ]
  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={props.navigation}
        headerStyle={{
          elevation: 0
        }} />
      <View style={styles.contentView}>
        <Tabs
          locked
          renderTabBar={() => <ScrollableTab style={{ borderWidth: 0 }} />}
          tabBarUnderlineStyle={{ backgroundColor: '#1FBEB8' }}>
          {tabs.map(tab => {
            return (
              <Tab heading={tab.label}
                tabStyle={{
                  backgroundColor: '#130C38'
                }}
                activeTabStyle={{
                  backgroundColor: '#130C38',
                  color: '#ffffff'
                }}
                key={tab.key}
              >
                {tab.component}
              </Tab>
            )
          })}
        </Tabs>
      </View>
    </SafeAreaView>
  )
}

export default DashboardView
