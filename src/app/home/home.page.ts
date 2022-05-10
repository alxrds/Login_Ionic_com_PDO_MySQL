import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostProvider } from '../../providers/post-provider';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  user: any;
  nome: string;
  id: number;

  constructor(
    private router: Router,
    private postPvdr: PostProvider,
    public toastCtrl: ToastController,
    private storage: Storage
  ) { }

  ionViewWillEnter(){
    this.storage.get('session_storage').then((res) => {
      this.user = res;
      this.id = this.user.id;
      this.nome = this.user.nome;
    });
  }

  async Logout() {
    this.storage.clear();
    this.router.navigate(['/login']);
    const toast = await this.toastCtrl.create({
      message: 'Deslogado com sucesso',
      duration: 2000
    });
    toast.present();
  }


}
