import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface ButtonPropsTypes {
    title: string;
    onPress: () => void;
    disabled?: boolean;
}

const Button: React.FC<ButtonPropsTypes> = (props) => {
    const {title, onPress, disabled = false} = props;

    return <View style={{borderRadius: 8, overflow: 'hidden'}}>
        <Pressable
            android_ripple={{color: '#888888'}}
            style={{backgroundColor: 'cyan', width: 200, paddingVertical: 12, borderRadius: 8, opacity: disabled ? 0.4 : 1}}
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={{fontWeight: 'bold', fontSize: 18, textAlign: 'center', color: '#000000'}}>{title}</Text>
        </Pressable>
    </View>;
};

export default React.memo(Button);
