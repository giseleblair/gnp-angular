import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { catchError, of, Subscription } from 'rxjs';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-freestyle-example',
  standalone: true,
  imports: [NgIf],
  templateUrl: './freestyle-example.component.html'
})
export class FreestyleExampleComponent implements OnInit, OnDestroy {
  readonly url = `${environment.zesty_stage_cms.replace(
    /\/$/,
    ''
  )}/freestyle-example?zpw=gnpmx`;
  html: SafeHtml | string | null = null;
  errorMessage: string | null = null;

  private loadSub?: Subscription;

  constructor(
    private readonly http: HttpClient,
    private readonly sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadSub = this.http
      .get(this.url, { responseType: 'text' })
      .pipe(
        catchError(() => {
          this.errorMessage =
            'Unable to load the freestyle example markup right now.';
          return of('');
        })
      )
      .subscribe((markup) => {
        if (!markup) {
          this.html = null;
          return;
        }
        this.html = this.sanitizer.bypassSecurityTrustHtml(markup);
      });
  }

  ngOnDestroy(): void {
    this.loadSub?.unsubscribe();
  }
}
