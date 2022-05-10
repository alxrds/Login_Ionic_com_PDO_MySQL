import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostProvider } from '../../providers/post-provider';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  nome: string = "";
  email: string = "";
  password: string = "";
  confirm_password: string = "";

  constructor(
    private router: Router,
    private postPvdr: PostProvider,
    public toastCtrl: ToastController
  ) { }

  ngOnInit() {
  }

  formLogin() {
    this.router.navigate(['/login']);
  }

  async register() {

    if(this.nome == ""){
      const toast = await this.toastCtrl.create({
        message: 'O nome é obrigatório',
        duration: 2000
      });
      toast.present();
    }
    else if(this.email == ""){
      const toast = await this.toastCtrl.create({
        message: 'O e-mail é obrigatório',
        duration: 2000
      });
      toast.present();
    }
    else if(this.password == ""){
      const toast = await this.toastCtrl.create({
        message: 'A senha é obrigatória',
        duration: 2000
      });
      toast.present();
    }
    else if(this.password != this.confirm_password){
      const toast = await this.toastCtrl.create({
        message: 'As senhas não são iguais',
        duration: 2000
      });
      toast.present();
    }
    else{
      let body = {
        nome: this.nome,
        email: this.email,
        password: this.password,
        acao: 'register'
      };
      this.postPvdr.postData(body, 'api.php').subscribe(async data => {
        var alertmsg = data.msg;
        if(data.success) {
          this.router.navigate(['/login']);
          const toast = await this.toastCtrl.create({
            message: 'Cadastro efetuado!',
            duration: 2000
          });
          toast.present();
        }
        else {
          const toast = await this.toastCtrl.create({
            message: alertmsg,
            duration: 2000
          });
          toast.present();
        }
      });
    }
  }

}
