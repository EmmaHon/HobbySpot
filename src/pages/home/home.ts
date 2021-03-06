import { Component } from '@angular/core';
import {LoadingController, NavController} from 'ionic-angular';
import {ChannelsPage} from "../channels/channels";
import {MediaProvider} from "../../providers/media/media";
import {ForwardedTaginformation} from "../../models/ForwardedTaginformation";
import {Mediafile} from "../../models/Mediafile";
import {TagInfo} from "../../models/TagInfo";
import {RegisterPage} from '../register/register';
import {UploadPage} from '../upload/upload';
import {LoginPage} from "../login/login";
import {TabsPage} from '../tabs/tabs';
import {LogoutPage} from '../logout/logout';
import {getResponseURL} from '@angular/http/src/http_utils';
import {ProfilePage} from "../profile/profile";
import {SearchPage} from "../search/search";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  mainTag = 'HobbySpot';
  mediafiles: Mediafile[] = [];
  tagInfo: TagInfo[] = [];
  channeltags:string[] = [];
  channelInfos: ForwardedTaginformation[] = [];
  items: string[];
  channels: string[] = [];
  paramsForChannel: any;
  myInput: string;
  paramsForUpload: any;
  paramsForSearch: any;
  paramsForProfile:any;

  /*
    Tagsystem: everything is searched with maintag first, maintag is used only for that,
    form of channeltag is: ch:tagName,
    categorytag: ca:tagName,
    additional tag: at:tagName

    Here tags of all files with tag HobbySpot are collected to variable channelInfos,
    it is list of ForwardedTagInformation objects, all of witch contains list of TagInfo-objects,
    which has name and id of tag stored and also id of file that tag is attached to.

   */

  constructor(public navCtrl: NavController,
              public mediaProvider: MediaProvider,
              public loadingCtrl: LoadingController){

  }

  ionViewDidLoad() {
    if(localStorage.getItem('token') !== null){

      this.mediaProvider.isLoggedIn = true;
    }
    this.mediaProvider.getAllMediaWithTag(this.mainTag).subscribe((res: Mediafile[]) => {
      this.mediafiles=res;
      for(let i = 0; i < this.mediafiles.length;++i){
        this.mediaProvider.showTagsByFile(this.mediafiles[i].file_id).subscribe((res2: TagInfo[]) => {
          this.tagInfo = res2;
          if(this.tagInfo.length>1){
            this.channelInfos.push({
              taginfo: this.tagInfo
            });
            let channeltag = this.mediaProvider.getTagMarkedWith(this.tagInfo,'ch');
            if(channeltag.length>0) {
              console.log('channeltag ' + i + ' is ' + channeltag);
              let channeltagindex = this.channeltags.indexOf(channeltag);
              if(channeltagindex<0){
                this.channeltags.push(channeltag);
              }
            }

          }
        });
      }
    });
  }

  login() {
    if (localStorage.getItem('token') !== null) {
      console.log('You are already logged in');
    } else {
      this.navCtrl.push(LoginPage);
    }
  }

  register() {
    this.navCtrl.push(RegisterPage);
  }

  profile(){
    if (localStorage.getItem('token') !== null){
      console.log('Profile page');
    }

    this.paramsForProfile = {
      files: this.mediafiles
    };

    this.navCtrl.push(ProfilePage,this.paramsForProfile);
  }

  upload() {
    if (localStorage.getItem('token') !== null) {
      console.log('Upload page');
      let loader = this.loadingCtrl.create({
        content: "Please wait...",
        duration: 1000
      });
      loader.present();

      this.paramsForUpload = {
        forwarded_tags: this.channelInfos
      };

      this.navCtrl.setRoot(UploadPage,this.paramsForUpload);
    }
  }

  logout() {
    if (localStorage.getItem('token') !== null) {
      localStorage.removeItem('token');
      console.log('logging out');
      let loader = this.loadingCtrl.create({
        content: "Logging out",
        duration: 1500
      });
      loader.present();
      this.navCtrl.setRoot(LogoutPage);
    }
  }



  goToChannel(channeltag: string) {
    this.paramsForChannel = {
      chtag: 'ch:'+channeltag,
      channel_infos: this.channelInfos
    };

    this.navCtrl.push(ChannelsPage, this.paramsForChannel);

  }
  // search bar functions-------------------------------------------------------
  setItems() {
    const tgs = this.mediaProvider.getTagslisted(this.channelInfos);
    this.items = tgs; // array of tags in here
    console.log(this.items);
  }

  goToSearchPage(item:string) {
    const parts = item.split(', ');
    let tagForSearchPage: string = '';
    if(parts[parts.length-1] === 'channel'){
      tagForSearchPage = 'ch:';
    }else if(parts[parts.length-1] === 'category'){
      tagForSearchPage = 'ca:';
    }else if(parts[parts.length-1] ==='additional tag'){
      tagForSearchPage = 'at:';
    }
    for( let i = 0; i<parts.length-1; ++i){
      tagForSearchPage = tagForSearchPage+parts[i];
    }
    this.paramsForSearch = {
      tag: tagForSearchPage
    };

    this.navCtrl.push(SearchPage,this.paramsForSearch);


  }



  onInput(ev) {
    console.log(ev);
    this.setItems();
    let setVal = ev.target.value;
    if (setVal && setVal.trim() != '') {
      console.log(ev.data);
      this.items = this.items.filter(function(item) {
        return item.toLowerCase().includes(setVal.toLowerCase());
      });
    }
  }


}

