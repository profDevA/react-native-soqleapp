import React, {Component} from 'react';
import {
    ActivityIndicator,
    Text, View, SafeAreaView, ScrollView
} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import Icon from 'react-native-vector-icons/FontAwesome';

import Header from '../components/Header';
import {AGENDA_LIST_API} from '../endpoints';
import {PAGE_SIZE} from '../constants';
import styles from '../stylesheets/agendaViewStyles';

let pageNum = 0;
let totalCount = 0;
let pageSize = PAGE_SIZE;

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height;
};

// TODO: Update this class to new Lifecycle methods
export default class AgendaView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            agendaItems: [],
            initialLoading: true,
            loading: false,
            activeSections: [0],
            totalCount: null,
        };
    }

    componentWillMount() {
        this.getAgendaItems();
    }

    getAgendaItems(page = 1) {
        fetch(AGENDA_LIST_API.replace('{}', page))
            .then(response => response.json())
            .then(responseJson => {
                totalCount = responseJson.total;
                pageNum = page;
                this.mapAgendaItems(responseJson.listTaskgroup);

                // Calling this again because items are very less
                if (pageNum === 1 && totalCount > PAGE_SIZE) {
                    this.getAgendaItems(pageNum + 1);
                }
            })
            .catch(() => this.setState({
                initialLoading: false,
                loading: false
            }));
    }

    mapAgendaItems(data) {
        let agendaItems = this.state.agendaItems;

        data.map(item => {
            const index = agendaItems.findIndex(obj => {
                return obj.groupname.toLowerCase() === item.groupname.toLowerCase();
            });
            let taskItem = {
                description: item.description,
                sequence: item.sequence,
                id: item._id,
                unlock_time: item.unlocktime,
            };
            if (index > -1) {
                agendaItems[index]['tasks'].push(taskItem);
            } else {
                agendaItems.push({
                    groupname: item.groupname,
                    category: item.category,
                    name: item.name,
                    tasks: [taskItem]
                });
            }
        });
        this.setState({
            agendaItems,
            initialLoading: false,
            loading: false
        });
    }

    _renderHeader = (section, index) => {
        const isActive = this.state.activeSections.includes(index);
        return (
            <View
                style={!isActive ?
                    styles.accordionHeader :
                    {...styles.accordionHeader, ...{'backgroundColor': '#2C2649'}}
                }
            >
                <View>
                    <Text style={styles.itemName}>{section.groupname}</Text>
                    <Icon
                        name={`chevron-${isActive ? 'up' : 'down'}`}
                        style={styles.accordionIcon}/>
                </View>
                <View>
                    <Text style={styles.itemCount}>{`${section.tasks.length} items`}</Text>
                </View>
            </View>
        );
    };

    _renderContent = section => {
        return (
            <View style={styles.taskView}>
                {(section.tasks.sort((a, b) => a.sequence - b.sequence)).map((task, index) => {
                    const isLastItem = section.tasks.length - 1 === index;
                    return (
                        <View key={task.id}>
                            <Text style={styles.taskTime}>{task.unlock_time}</Text>
                            <Text style={styles.taskText}>
                                {task.description}
                            </Text>
                            {!isLastItem ?
                                <View style={styles.taskSeparator}/>
                                : null}
                        </View>
                    );
                })}
            </View>
        );
    };

    _updateSections = activeSections => {
        this.setState({activeSections});
    };

    handleBackAction() {
        this.props.navigation.pop();
    }

    fetchMoreAgendaOnScroll() {
        if (pageNum * pageSize < totalCount && !this.state.loading) {
            this.setState({loading: true});
            this.getAgendaItems(pageNum + 1);
        }
    }

    onScroll({nativeEvent}) {
        if (isCloseToBottom(nativeEvent)) {
            this.fetchMoreAgendaOnScroll();
        }
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Header
                    title='Group Tasks'
                    navigation={this.props.navigation}
                    headerStyle={{
                        backgroundColor: '#1FBEB8'
                    }}
                />
                {this.state.initialLoading ? (
                    <View style={styles.activityLoaderContainer}>
                        <ActivityIndicator size="large" color="#0000ff"/>
                    </View>
                ) : (
                    <ScrollView onScroll={this.onScroll.bind(this)} scrollEventThrottle={400}>
                        <Accordion
                            sections={this.state.agendaItems}
                            activeSections={this.state.activeSections}
                            renderHeader={this._renderHeader}
                            renderContent={this._renderContent}
                            onChange={this._updateSections}
                            expandMultiple={true}
                        />
                        {this.state.loading ? (
                            <View style={styles.listLoader}>
                                <ActivityIndicator size="large" color="#120B34"/>
                            </View>
                        ) : null}
                    </ScrollView>
                )}
            </SafeAreaView>
        );
    }
}
