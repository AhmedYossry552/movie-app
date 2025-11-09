import { Component, inject } from '@angular/core';
import { LoaderService } from '../../../core/services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  imports: [CommonModule],
  templateUrl: './loader.html',
  styleUrl: './loader.css',
})
export class Loader {
 private readonly loaderService = inject(LoaderService);
  
  readonly isLoading = this.loaderService.isLoading;
}
