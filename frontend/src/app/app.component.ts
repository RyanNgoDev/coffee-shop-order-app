import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/models/user.model';
import { AuthService } from './core/auth/auth.service';
import { BlockUIService } from './core/services/block-ui.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  isLoggedIn$: Observable<boolean> | undefined;
  user: User | undefined;
  public isLoading = false;
  constructor(private authService: AuthService,
    private readonly blockUIService: BlockUIService) {}

  ngOnInit() {
    this.blockUIService.blockUIEvent.subscribe((event: boolean) => this.isLoading = event);
    this.isLoggedIn$ = this.authService.isLoggedIn;
    this.authService.currentUser.subscribe(user => this.user = user);
  }

  logout() {
    this.authService.logout();
  }
}
