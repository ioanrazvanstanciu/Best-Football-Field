import { Component } from '@angular/core';
import { NavigationEnd, Event, Router } from '@angular/router';

interface ITab {
  name: string;
  link: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'proiect-isi';

  tabs: ITab[] = [{
    name: 'Map',
    link: '/map'
  }];

  // See app.component.html
  mapLoadedEvent(status: boolean) {
    console.log('The map loaded: ' + status);
  }
}
