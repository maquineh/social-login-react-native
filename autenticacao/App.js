/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import firebase from 'react-native-firebase';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { AsyncStorage } from 'react-native';
import {
  LoginButton,
  AccessToken
} from 'react-native-fbsdk';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from 'react-native-google-signin';
const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component {

  async componentDidMount() {
    GoogleSignin.configure({
      //Configurações mecessarias para chamar o signIn()
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      // Colocoar aqui o nosso clientId gerado no Firebase console
      webClientId:
        'AIzaSyA4nWO-drdkXYDQhWwngRNMsN-SkqcBMyM ',
    });

    this.checkPermission();
    this.createNotificationListeners(); 
  }

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        this.getToken();
    } else {
        this.requestPermission();
    }
  }

  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
        fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            // user has a device token
            await AsyncStorage.setItem('fcmToken', fcmToken);
        }
    }
  }
  
    //2
  async requestPermission() {
    try {
        await firebase.messaging().requestPermission();
        // User has authorised
        this.getToken();
    } catch (error) {
        // User has rejected permissions
        console.log('permission rejected');
    }
  }

///////////////////
 //Remove listeners allocated in createNotificationListeners()
 componentWillUnmount() {
  this.notificationListener();
  this.notificationOpenedListener();
}

async createNotificationListeners() {
  /*
  * Triggered when a particular notification has been received in foreground
  * */
  this.notificationListener = firebase.notifications().onNotification((notification) => {
      const { title, body } = notification;
      this.showAlert(title, body);
  });

  /*
  * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
  * */
  this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      const { title, body } = notificationOpen.notification;
      this.showAlert(title, body);
  });

  /*
  * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
  * */
  const notificationOpen = await firebase.notifications().getInitialNotification();
  if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
      this.showAlert(title, body);
  }
  /*
  * Triggered for data only payload in foreground
  * */
  this.messageListener = firebase.messaging().onMessage((message) => {
    //process data message
    console.log(JSON.stringify(message));
  });
}

showAlert(title, body) {
  Alert.alert(
    title, body,
    [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
    ],
    { cancelable: false },
  );
}


  _signIn = async () => {
    //gera um modal para o usuario logar na aplicacao.
    try {
      await GoogleSignin.hasPlayServices({
        //Checa se o dispositivo tem o  Google Play Services instalado.
        //Sempre seta pra true no iOS.
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
      console.log('Info Usuario --> ', userInfo);
      this.setState({ userInfo: userInfo });
    } catch (error) {
      console.log('Mensagem', error.message);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Processo de Login Cancelado');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Logado');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services não disponível ou desatualizado');
      } else {
        console.log('Ocorreu um erro');
      }
    }
  };

  _getCurrentUser = async () => {
    //May be called eg. in the componentDidMount of your main component.
    //O metodo retornar os dados do usuario logado
    //se ele já tiver logado senao retorna null.
    try {
      const userInfo = await GoogleSignin.signInSilently();
      this.setState({ userInfo });
    } catch (error) {
      console.error(error);
    }
  };
  _signOut = async () => {
    //Remove a sessao do usuario do dispositivo.
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      this.setState({ user: null }); // Remove o usuario do state do app também
    } catch (error) {
      console.error(error);
    }
  };
  _revokeAccess = async () => {
    //Remove a aplicacao da lista de aplicacoes autorizadas para o usuario.
    try {
      await GoogleSignin.revokeAccess();
      console.log('Deletado');
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    return (
      <View style={styles.container}>

        <LoginButton
          onLoginFinished={
            (error, result) => {
              if (error) {
                alert("Erro no login: " + result.error);
              } else if (result.isCancelled) {
                alert("Login cancelado pelo usuário.");
              } else {
                AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    alert('Usuário Logado')
                  }
                )
              }
            }
          }
          onLogoutFinished={() => alert('Usuário Deslogado')} />

        <GoogleSigninButton
          style={{ width: 312, height: 48 }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Light}
          onPress={this._signIn}
        />  


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
