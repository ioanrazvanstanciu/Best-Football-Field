import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../shared/services/auth.service";
import { Router } from '@angular/router';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  constructor(
    public authService: AuthService,
    public router: Router
  ) { }
  // create function to navigate to sign in page with redirect
  goToSignIn() {
    this.router.navigate(['/sign-in']);
  }
  ngOnInit() { }
}