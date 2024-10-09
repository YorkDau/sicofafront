import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanLoad, CanActivate {

    constructor(private router: Router) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        if (sessionStorage.getItem(environment.JWT_TOKEN)) {
            return true;
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }

    canLoad() {

        if (sessionStorage.getItem(environment.JWT_TOKEN)) {
            return true;
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }
}
