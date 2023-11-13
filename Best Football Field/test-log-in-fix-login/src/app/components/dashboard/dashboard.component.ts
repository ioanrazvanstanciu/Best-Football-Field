import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AuthService } from "../../shared/services/auth.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  //router: any;
  constructor(
    public authService: AuthService,
    public router: Router,
    public appRoutingModule: AppRoutingModule
  ) { }
  ngOnInit() {  }

  goToMap() {
    this.router.navigate(['/map']);
  }
}