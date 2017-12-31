import { Local } from './../../models/local';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { getLocaleDateTimeFormat } from '@angular/common/src/i18n/locale_data_api';


declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public locais: any;
  @ViewChild('map') mapContainer: ElementRef;
  map: any;

  constructor(public navCtrl: NavController,public geolocation: Geolocation,public alertCtrl: AlertController) {
    
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap(){
 
    this.geolocation.getCurrentPosition().then((position) => {
 
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
 
      this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);
 
    }, (err) => {
      console.log(err);
    });
 
  }
  addMarker(){
 
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });
   
    //let content = "<h4>Information!</h4>";         
   
    this.addInfoWindow(marker);
   
  }
  addInfoWindow(marker){
       
    google.maps.event.addListener(marker, 'click', () => {
      this.showPrompt(marker);
    });
  
  }

  showPrompt(marker) {
    let prompt = this.alertCtrl.create({
      title: 'Informações do Local',
      //message: "Enter a name for this new album you're so keen on adding",
      inputs: [
        {
          name: 'onde',
          placeholder: 'Nome do Local'
          
        },{
          name: 'atividade',
          placeholder: 'Atividade sendo realizada'
        
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Registar',
          handler: data => {
            this.showAlert();
            console.log(Date.now());
            this.locais.atividade = data.atividade;
            this.locais.nome = data.onde;
            this.locais.hora = Date.now();
            this.locais.latitude = marker.latitude;
            this.locais.longitude=marker.longitude;
            console.log(this.locais);
          }
        }
      ]
    });
    prompt.present();
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Local Registrado',
      subTitle: 'Localidade registrada com sucesso',
      buttons: ['OK']
    });
    alert.present();
  }

}
