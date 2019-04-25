import { Component } from '@angular/core';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  constructor(
    private push: Push,
    private alertController: AlertController
  ) { 
    // to check if we have permission
    this.push.hasPermission()
      .then((res: any) => {
        if (res.isEnabled) {
          console.log('We have permission to send push notifications');
          this.initPush();
        } else {
          console.log('We do not have permission to send push notifications');
        }
    });
  }

  async presentAlert(notification:any) {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Subtitle',
      message: notification.message,
      buttons: ['OK']
    });

    await alert.present();
  }

  initPush(){
    let self = this;
    const options: PushOptions = {
      android: {},
      ios: {
          alert: 'true',
          badge: true,
          sound: 'false'
      },
      windows: {},
      browser: {
          pushServiceURL: 'http://push.api.phonegap.com/v1/push'
      }
   }

   const pushObject: PushObject = this.push.init(options);

   pushObject.on('notification').subscribe((notification: any) => {
     console.log('Received a notification', notification)
     self.presentAlert(notification);
    });
   pushObject.on('registration').subscribe((registration: any) => console.log('Device registered', registration));
   pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }
}
