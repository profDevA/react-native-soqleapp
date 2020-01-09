import React from 'react';
import {Text} from 'react-native';

export default CustomText = props => {
    return (
        <Text style={props.styles}
            {...props.numberOfLines ? {numberOfLines: props.numberOfLines} : {}} >
            {props.children}
        </Text>
    );
};
