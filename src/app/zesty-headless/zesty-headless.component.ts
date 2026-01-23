import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { environment } from '../../environments/environment';

interface HeadlessEntry {
  about?: string;
  map?: string;
  documentation?: string;
}

interface HeadlessResponse {
  headless?: Record<string, HeadlessEntry>;
}

interface HeadlessCard {
  key: string;
  about?: string;
  map?: string;
  documentation?: string;
  mapUrl?: string;
  docUrl?: string;
}

@Component({
  selector: 'app-zesty-headless',
  standalone: true,
  imports: [AsyncPipe, NgIf, NgFor],
  templateUrl: './zesty-headless.component.html'
})
export class ZestyHeadlessComponent {
  readonly endpoint = `${environment.zesty_stage_cms}/-/headless/?zpw=${environment.zesty_stage_pw}`;
  readonly headless$ = this.http.get<HeadlessResponse>(this.endpoint).pipe(
    map((response) => {
      const entries = response?.headless ?? {};
      const hiddenKeys = new Set([
        'mode',
        'authorization',
        'headless_authorization'
      ]);
      return Object.entries(entries)
        .filter(([key]) => !hiddenKeys.has(key))
        .map(([key, value]) => {
        const mapUrl = value?.map
          ? this.appendPassword(value.map)
          : undefined;
        const docUrl = value?.documentation;
        return {
          key,
          about: value?.about,
          map: value?.map,
          documentation: value?.documentation,
          mapUrl,
          docUrl
        };
      });
    }),
    catchError(() => {
      this.errorMessage =
        'Unable to load headless resources right now. Please try again later.';
      return of([]);
    })
  );
  errorMessage: string | null = null;

  constructor(private readonly http: HttpClient) {}

  private appendPassword(url: string): string {
    const joiner = url.includes('?') ? '&' : '?';
    return `${url}${joiner}zpw=${environment.zesty_stage_pw}`;
  }
}
