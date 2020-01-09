import React, {Component} from 'react';
import {Text, View, FlatList} from 'react-native';
import {Picker, Form} from 'native-base';

import {USER_SPARK_LIST_PATH_API} from '../endpoints';
import styles from '../stylesheets/sparkViewStyles';

let userId = null;
let profile = null;

const getDateFromTimestamp = timestamp => {
    if (!timestamp) return null;
    let dateObj = new Date(timestamp);
    return `${dateObj.getMonth() + 1}/${dateObj.getDate()}/${dateObj.getFullYear()}`;
};

const sortByKey = (array, key) => {
    return array.sort((a, b) => {
        const x = a[key];
        const y = b[key];
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
};

// TODO: Update this class to new Lifecycle methods
export default class SparkView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sparks: sortByKey(this.props.sparks.transactions || [], '_id'),
            refreshing: false,
            sorter: '_id',
        };
        userId = this.props.user._id || null;
        profile = this.props.user.profile || null;
    }

    componentWillMount() {
        if (!Object.keys(this.props.sparks).length) {
            let endpoint = USER_SPARK_LIST_PATH_API.replace('{}', this.props.user._id);
            this.props.sparkActions.getSparksRequest({initialLoad: true, endpoint});
        }
    }

    componentWillReceiveProps(nextProps) {
        if (Object.keys(nextProps.sparks).length
            && (!this.props.sparks.transactions ||
                nextProps.sparks.transactions.length != this.props.sparks.transactions.length)) {
            this.setState({sparks: sortByKey(nextProps.sparks.transactions, this.state.sorter)});
        }
    }

    _renderItem = ({item}) => {
        const {source} = item;
        const key = Object.keys(source)[0];
        return (
            <View style={styles.sparkTile}>
                <View style={{...styles.sparkTileRow, ...{'paddingBottom': 10}}}>
                    <Text style={styles.sparkTileTitle}>{source[key].name}</Text>
                    <Text style={styles.sparkTileToken}>{`+${item.numTokens} Sparks`}</Text>
                </View>
                <View style={styles.sparkTileRow}>
                    <Text style={styles.sparkTileDate}>{getDateFromTimestamp(item.timestamp)}</Text>
                    <Text
                        style={styles.sparkTileUser}>{profile ? `${profile.firstName} ${profile.lastName || ''}` : ''}</Text>
                </View>
            </View>
        );
    };

    handleRefresh() {
        let endpoint = USER_SPARK_LIST_PATH_API.replace('{}', this.props.user._id);
        this.props.sparkActions.getSparksRequest({endpoint});
    }

    handleSortChange(sorter) {
        let data = sortByKey(this.state.sparks, sorter);
        this.setState({sorter, sparks: data});
    }

    render() {
        return (
            <View style={styles.contentView}>
                <Form>
                    <Picker
                        note
                        mode="dropdown"
                        selectedValue={this.state.sorter}
                        style={styles.sortPicker}
                        onValueChange={itemValue => this.handleSortChange(itemValue)}
                    >
                        <Picker.Item label="Sort by" value=""/>
                        <Picker.Item label="Date" value="timestamp"/>
                        <Picker.Item label="House" value="_id"/>
                        <Picker.Item label="Sparks" value="numTokens"/>
                    </Picker>
                </Form>
                <View style={{flex: 1, paddingVertical: 10}}>
                    <FlatList
                        data={this.state.sparks}
                        keyExtractor={(item) => item._id}
                        renderItem={this._renderItem}
                        refreshing={this.state.refreshing}
                        onRefresh={() => this.handleRefresh()}
                    />
                </View>
            </View>
        );
    }
}
