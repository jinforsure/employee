import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Location } from '@angular/common';
import { NotifService, AppNotification } from '../../services/notif.service';
import { AuthService } from '../../services/auth.service'; // Import AuthService

export const userItems = [
  {
    icon: 'fal fa-user',
    label: 'Profile',
    route: '/profile'
  },
  {
    icon: 'fal fa-cog',
    label: 'Settings',
    route: '/settings'
  },
  {
    icon: 'fal fa-power-off',
    label: 'Log out',
    action: 'logout'
  },
];

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() collapsed = false;
  @Input() screenWidth = 0;

  canShowSearchAsOverlay = false;
  notifications: AppNotification[] = [];
  hasNewNotification = false;
  userItems = userItems;
  isMenuOpen = false;
  breadcrumbs: any[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private notifService: NotifService,
    private authService: AuthService // Inject AuthService
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      let route = this.activatedRoute.firstChild;
      this.breadcrumbs = [];
      while (route) {
        const routePath = route.snapshot.url.map(segment => segment.path);
        this.breadcrumbs.push({
          label: route.snapshot.data['breadcrumb'] || route.snapshot.url.map(segment => segment.path).join('/'),
          url: '/' + routePath.join('/')
        });
        route = route.firstChild;
      }
    });
  }

  ngOnInit(): void {
    this.checkCanShowSearchOverlay(window.innerWidth);
    this.loadNotifications();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkCanShowSearchOverlay(window.innerWidth);
  }

  getHeadClass(): string {
    let styleClass = '';
    if (this.collapsed && this.screenWidth > 768) {
      styleClass = 'head-trimmed';
    } else {
      styleClass = 'head-md-screen';
    }
    return styleClass;
  }

  checkCanShowSearchOverlay(innerWidth: number): void {
    this.canShowSearchAsOverlay = innerWidth < 845;
  }

  private loadNotifications(): void {
    // Get the username from local storage
    const username = localStorage.getItem('username');
    if (!username) {
      console.error('Username not found in local storage');
      return;
    }

    this.notifService.getNotifications().subscribe(
      (data: AppNotification[]) => {
        // Filter notifications based on the username extracted from the message
        const usernameRegex = new RegExp(`Dear\\s+${username}\\b`, 'i');
        console.log("username : ",usernameRegex)
        this.notifications = data.filter(notification => usernameRegex.test(notification.message)).reverse();
        this.hasNewNotification = this.notifications.length > 0;
        console.log("Filtered notifications:", this.notifications);
      },
      (error) => {
        console.error('Error loading notifications', error);
      }
    );
  }

  navigateBack(): void {
    this.location.back();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirect to login page after logout
  }

  onUserItemClicked(item: any): void {
    if (item.action === 'logout') {
      this.logout();
    } else {
      this.router.navigate([item.route]);
    }
  }
  

  markAllAsRead(): void {
    // Implement the logic to mark all notifications as read
    this.hasNewNotification = false;
}

getNotificationIcon(message: string): { iconClass: string, color: string } {
  if (message.includes('successfully')) {
      return { iconClass: 'fas fa-bell', color: 'green' };
  } else if (message.includes('edited') || message.includes('updated')) {
      return { iconClass: 'fas fa-info-circle', color: 'blue' };
  } else if (message.includes('error') || message.includes('failed')) {
      return { iconClass: 'fas fa-exclamation-circle', color: 'red' };
  } else if (message.includes('cancelled') || message.includes('deleted')) {
      return { iconClass: 'fas fa-times-circle', color: 'gray' };
  } else {
      return { iconClass: 'fas fa-bell', color: 'yellow' };
  }
}




}
