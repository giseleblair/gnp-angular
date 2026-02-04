import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

interface SitemapEntry {
  zuid?: string;
  title?: string;
  description?: string;
  uri?: string;
  path_part?: string;
  url?: string;
  locale?: string;
  hybrid_json_url?: string;
}

@Component({
  selector: 'app-sitemap',
  standalone: true,
  imports: [AsyncPipe, NgIf, NgFor],
  templateUrl: './sitemap.component.html'
})
export class SitemapComponent {
  readonly endpoint = `${environment.zesty_stage_cms}/-/headless/routing.json?zpw=${environment.zesty_stage_pw}`;
  readonly sitemap$ = this.http.get<SitemapEntry[]>(this.endpoint).pipe(
    catchError(() => {
      this.errorMessage =
        'Unable to load sitemap data right now. Please try again later.';
      return of([]);
    })
  );
  errorMessage: string | null = null;

  constructor(private readonly http: HttpClient) {}
}
