import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { Loader } from './shared/components/loader/loader';
import { BackToTop } from './shared/components/back-to-top/back-to-top';
import { Toast } from './shared/components/toast/toast';

/**
 * Root application component
 * Includes navbar, router outlet, global loader, back-to-top button, and toast notifications
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Loader, BackToTop, Toast],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
