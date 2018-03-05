import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams,} from 'ionic-angular';
import {HomePage} from '../home/home';
import {MediaProvider} from '../../providers/media/media';

/**
 * Generated class for the LogoutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html',
})
export class LogoutPage {


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public mediaProvider: MediaProvider,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogoutPage');
    localStorage.removeItem('token');
    this.mediaProvider.isLoggedIn = false;
    this.navCtrl.setRoot(HomePage);
  }
}
