import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AuthService } from "../../shared/services/auth.service";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  //router: any;
  constructor(
    public authService: AuthService,
    public router: Router,
    public appRoutingModule: AppRoutingModule
  ) { }
  ngOnInit() {  }

  // create function to navigate to sign up page
  goToSignIn() {
    this.router.navigate(['/sign-in']);
  }
}