import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: "root"
})
export class RoleService {
  private activeRole: string = '';

  private roleChangedSubject: Subject<string> = new Subject<string>();
  roleChanged$: Observable<string> = this.roleChangedSubject.asObservable();

  constructor() {
    this.activeRole = window.localStorage.getItem('role') ?? '';
  }

  set role(role: string) {
    window.localStorage.setItem('role', role);
    this.activeRole = role;
    this.roleChangedSubject.next(role);
  }

  get role(): string {
    return this.activeRole;
  }
}