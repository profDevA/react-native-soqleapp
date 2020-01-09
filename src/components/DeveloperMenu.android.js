import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import * as snapshot from '../utils/snapshot';
import styles from './../stylesheets/DeveloperMenu.androidStyles';

/**
 * Simple developer menu, which allows e.g. to clear the app state.
 * It can be accessed through a tiny button in the bottom right corner of the screen.
 * ONLY FOR DEVELOPMENT MODE!
 */
class DeveloperMenu extends Component {
    static displayName = 'DeveloperMenu';

    constructor(props) {
        super(props);
        this.state = {visible: false};
    }

    showDeveloperMenu = () => {
        this.setState({isVisible: true});
    };

    clearState = async () => {
        await snapshot.clearSnapshot();
        console.warn('(╯°□°）╯︵ ┻━┻ \nState cleared, Cmd+R to reload the application now');
        this.closeMenu();
    };

    closeMenu = () => {
        this.setState({isVisible: false});
    };

    renderMenuItem(text, onPress) {
        return (
            <TouchableOpacity
                key={text}
                onPress={onPress}
                style={styles.menuItem}
            >
                <Text style={styles.menuItemText}>{text}</Text>
            </TouchableOpacity>
        );
    }

    render() {
        if (!__DEV__) {
            return null;
        }

        if (!this.state.isVisible) {
            return (
                <TouchableOpacity
                    style={styles.circle}
                    onPress={this.showDeveloperMenu}
                />
            );
        }

        const buttons = [
            this.renderMenuItem('Clear state', this.clearState),
            this.renderMenuItem('Cancel', this.closeMenu)
        ];

        return (
            <View style={styles.menu}>
                {buttons}
            </View>
        );
    }
}

export default DeveloperMenu;
