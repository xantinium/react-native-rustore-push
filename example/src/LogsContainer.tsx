import React from 'react';
import { FlatList, Text, View } from 'react-native';

export interface ItemPropsTypes {
    date: number;
    text: string;
}

interface LogsContainerPropsTypes {
    logs: ItemPropsTypes[];
}

const Item: React.FC<ItemPropsTypes> = ({date, text}) => {
    return <View
        style={{flexDirection: 'row', paddingVertical: 6, paddingHorizontal: 12}}
    >
        <Text style={{color: '#000000', fontSize: 11}}>{new Date(date).toLocaleTimeString()}</Text>
        <Text style={{color: '#000000', fontSize: 11, marginLeft: 12, flex: 1}} numberOfLines={1}>{text}</Text>
    </View>
};

const MemoItem = React.memo(Item);

const LogsContainer: React.FC<LogsContainerPropsTypes> = ({ logs }) => {
    return <FlatList
        data={logs}
        keyExtractor={(item, index) => `${item.date}_${index}`}
        renderItem={({item}) => <MemoItem {...item} />}
        contentContainerStyle={{paddingTop: 16}}
    />
};

export default LogsContainer;
