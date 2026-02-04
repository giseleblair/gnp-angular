import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { catchError, filter, map, of, startWith, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { FreestyleExampleComponent } from '../freestyle_example/freestyle-example.component';
import { PageData, PagesComponent } from '../pages/pages.component';

type DynamicPageResponse = PageData & {
  meta?: {
    model_name?: string;
  };
};

@Component({
  selector: 'app-dynamicpage',
  standalone: true,
  imports: [AsyncPipe, JsonPipe, NgIf, PagesComponent, FreestyleExampleComponent],
  templateUrl: './dynamicpage.component.html'
})
export class DynamicPageComponent {
  readonly path$ = this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    map(() => this.router.url.replace(/^\/+/, '')),
    startWith(this.router.url.replace(/^\/+/, ''))
  );
  readonly data$ = this.path$.pipe(
    switchMap((path) => {
      if (path === 'freestyle-example') {
        return of({
          meta: { model_name: 'freestyle_example' }
        } as DynamicPageResponse);
      }

      const endpoint = `${environment.zesty_stage_cms}/${encodeURI(
        path
      )}?toJSON&zpw=${environment.zesty_stage_pw}`;
      return this.http.get<DynamicPageResponse>(endpoint).pipe(
        catchError(() => {
          this.errorMessage =
            'A dynamic toJSON route on your Zesty.io instance does not exist. Please check the url path and if there is a pair on Zesty.io, or make a model and new content item to match the path.';
          return of(null);
        })
      );
    })
  );
  errorMessage: string | null = null;

  constructor(
    private readonly router: Router,
    private readonly http: HttpClient
  ) {}
}
