import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

interface PageCategory {
  name?: string;
  parent_category?: {
    data?: Array<{
      name?: string;
    }>;
  };
}

interface PageImage {
  url?: string;
}

interface PageData {
  title?: string;
  content?: string;
  category?: {
    data?: PageCategory[];
  };
  main_image?: {
    data?: PageImage[];
  };
}

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pages.component.html'
})
export class PagesComponent {
  @Input({ required: true }) page: PageData | null = null;
}
