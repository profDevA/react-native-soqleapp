import React from 'react'
import {StyleSheet, Text, View, FlatList} from 'react-native'
//import ProgressCircle from 'react-native-progress-circle'

import styles from '../stylesheets/levelViewStyles'

let userLevels = []

const LevelView = props => {
  userLevels = props.user.profile && props.user.profile.progressionTreeLevels || []

  function _renderItem ({item}) {
    const percentage = item.currentLevelXP && Math.round((item.currentLevelXP / item.totalXP) * 100) || 0
    return (
      <View style={styles.levelTile}>
        <View>
          <View style={styles.levelCircle}>

          </View>
        </View>
        <View>
          <Text style={styles.levelTitle}>{item.name}</Text>
          <View style={styles.levelTags}>
            <Text style={styles.levelTag}>{`Level ${item.level}`}</Text>
            <Text style={styles.levelTag}>{`Total XP ${item.totalXP}`}</Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.contentView}>
      <View style={{flex: 1, padding: 10 }}>
        <FlatList
          data={userLevels}
          keyExtractor={(item) => item._id}
          renderItem={_renderItem}
                />
      </View>
    </View>
  )
}

export default LevelView
// <ProgressCircle
//   percent={percentage}
//   radius={25}
//   borderWidth={8}
//   color='#3399FF'
//   bgColor='#ffffff'
//   shadowColor='#130C38'
//             >
//   <Text style={styles.levelCircleText}>{`${percentage}%`}</Text>
// </ProgressCircle>
