import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostProvider } from '../../providers/post-provider';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string;
  password: string;

  staySignedIn: boolean = true;

  constructor(
    private router: Router,
    private postPvdr: PostProvider,
    public toastCtrl: ToastController,
    private storage: Storage
  ) { }

  ngOnInit() {
  }

  formRegister() {
    this.router.navigate(['/register']);
  }

  changeStatus(value) {
    this.staySignedIn = value;
  }

  async login() {

    if (this.email != "" && this.password != "") {
      let body = {
        email: this.email,
        password: this.password,
        acao: 'login'
      };
      this.postPvdr.postData(body, 'api.php').subscribe(async data => {
        var alertmsg = data.msg;
        if (data.success) {
          this.storage.set('session_storage', data.result);
          this.router.navigate(['/home']);
          const toast = await this.toastCtrl.create({
            message: 'Login Efetuado',
            duration: 2000
          });
          toast.present();
          console.log(data);
        }
        else {
          const toast = await this.toastCtrl.create({
            message: alertmsg,
            duration: 2000
          });
          toast.present();
        }
      });

    } else {
      const toast = await this.toastCtrl.create({
        message: 'Usuário ou senha inválida',
        duration: 2000
      });
      toast.present();
    }
  }
}

