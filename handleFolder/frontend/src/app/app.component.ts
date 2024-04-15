import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient, HttpClientModule, withFetch } from '@angular/common/http';
import { ToastService,AngularToastifyModule } from 'angular-toastify';

import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, NavbarComponent,AngularToastifyModule],
  providers:[ToastService,
    {
      provide:HttpClient,
      useFactory:withFetch
    }
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'fileFolderUpload';
}
