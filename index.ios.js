/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
} from 'react-native';
import FBSDK,
{
	LoginManager,
	LoginButton,
	AccessToken,
	GraphRequest,
	GraphRequestManager,
} from 'react-native-fbsdk';

export default class facebookLogin extends Component {

	constructor(props, context) {
		super(props, context);
	}
	getProfileInfo(accessToken) {
		const infoRequest = new GraphRequest('/me',
			{
				accessToken: accessToken,
				parameters: {
					fields: {
						string: 'email,name,first_name,middle_name,last_name'
					}
				}
			},
			this._responseInfoCallback,
		);
		new GraphRequestManager().addRequest(infoRequest).start();
	}

	//Create response callback.
	_responseInfoCallback(error: ?Object, result: ?Object) {
		if (error) {
			console.log('Error fetching data: ', error);
		} else {
			console.log('Success fetching data: ', result);
		}
	}

	login() {
		// Attempt a login using the Facebook login dialog asking for default permissions.
		LoginManager.logInWithReadPermissions(['public_profile'])
			.then(function (result) {
				if (result.isCancelled) {
					console.log('Login cancelled');
				} else {
					console.log('Login success with permissions: ' + result.grantedPermissions.toString(), result);
				}
			})
			.catch(function (error) {
				console.log('Login fail with error: ' + error);
			})
	}



	render() {
		return (
			<View style={styles.container}>
				{/*Login Button + Access Token*/}
				<View>
					<LoginButton
						publishPermissions={["publish_actions"]}
						onLoginFinished={
							(error, result) => {
								if (error) {
									console.log("login has error: " + result.error);
								} else if (result.isCancelled) {
									console.log("login is cancelled.");
								} else {
									AccessToken.getCurrentAccessToken().then(
										(data) => {
											const { accessToken } = data
											console.log(accessToken.toString())
											this.getProfileInfo(accessToken)
										}
									)
								}
							}
						}
						onLogoutFinished={() => console.log("logout.")} />
				</View>
				{/*Requesting additional permissions with Login Manager*/}
				{/*<TouchableOpacity onPress={this.login}>
					<Text>LOGIN WITH FACEBOOK</Text>
				</TouchableOpacity>*/}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	},
	instructions: {
		textAlign: 'center',
		color: '#333333',
		marginBottom: 5,
	},
});

AppRegistry.registerComponent('facebookLogin', () => facebookLogin);
