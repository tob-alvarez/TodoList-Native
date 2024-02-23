import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, TextInput, Switch } from 'react-native';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfileImage, updateNameUser, toggleDarkMode } from '../redux/profileSlice';

const Profile = () => {
    const dispatch = useDispatch();
    const profileImage = useSelector((state) => state.profile.profileImage);
    const nameUser = useSelector((state) => state.profile.nameUser);
    const darkMode = useSelector((state) => state.profile.darkMode);

    const handleToggleDarkMode = () => {
        dispatch(toggleDarkMode());
    };

    const handleEdit = async () => {
        const result = await launchImageLibraryAsync({
            mediaTypes: 'Images',
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            dispatch(updateProfileImage(result.uri));
        }
    };

    const handleNameChange = (newName) => {
        dispatch(updateNameUser(newName));
    };

    return (
        <View style={[styles.container, {backgroundColor: darkMode ? '#141414' : 'white',}]}>
            <View style={styles.picContainer}>
                <TouchableOpacity onPress={handleEdit}>
                    <Image source={{ uri: profileImage }} style={styles.pic} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleEdit}>
                    <Text style={{ color: '#6495ed' }}>Edit photo</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.userInfoContainer}>
                <Text style={[styles.dataUser, {color: darkMode? 'white' : 'black'}]}>Name:</Text>
                <TextInput
                    style={[styles.dataUserInput, {color: darkMode? 'white' : 'black'}]}
                    value={nameUser}
                    onChangeText={handleNameChange}
                />
            </View>
            <View style={styles.modeContainer}>
                <Text style={[styles.dataUser, {color: darkMode? 'white' : 'black'}]}>Theme</Text>
                <Switch
                    value={darkMode}
                    onValueChange={handleToggleDarkMode}
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={darkMode ? "#f5dd4b" : "#f4f3f4"}
                />
            </View>
        </View>
    );
};

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 15,
    },
    picContainer:{
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
    },
    pic: {
        width: 150,
        height: 150,
        borderRadius: 100,
        marginBottom: 30,
    },
    userInfoContainer:{
        margin: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC',
        flexDirection: 'row',
        alignItems: 'center'
    },
    modeContainer:{
        margin: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    dataUser:{
        padding: 10,
    }
})