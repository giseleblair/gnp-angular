import { Component } from '@angular/core';
import { ZestyHeadlessComponent } from '../../zesty-headless/zesty-headless.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [ZestyHeadlessComponent],
  templateUrl: './footer.component.html'
})
export class FooterComponent {}
