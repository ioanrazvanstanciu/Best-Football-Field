import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../shared/services/auth.service";
import { Router } from '@angular/router';
import { AppRoutingModule } from 'src/app/app-routing.module';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  constructor(
    public authService: AuthService,
    public router: Router,
    public appRoutingModule: AppRoutingModule
  ) { }
 
  ngOnInit() { }
  // create function to navigate to forgot password page
  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
  // create function to navigate to sign up page
  goToSignUp() {
    this.router.navigate(['/sign-up']);
  }
  btnClick=  () => {
    this.router.navigateByUrl('/user');
};
}