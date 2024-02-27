import {Directive, ElementRef, Input, OnInit} from "@angular/core";
import {filter} from "rxjs/operators";
import {AclService} from "../services";

@Directive({
  selector: '[acl-link]',
})
export class AclLinkDirective implements OnInit {
  @Input({required: true}) resourcePath: string = '';
  @Input({required: false}) noAccessText: string = 'You don\'t have access';

  initValue: string = '';
  initStatus: boolean = false;

  constructor(
    private readonly aclService: AclService,
    private readonly ref: ElementRef<HTMLLinkElement>,
  ) {
  }

  ngOnInit(): void {
    this.initValue = this.ref.nativeElement.href;
    this.initStatus = this.ref.nativeElement.disabled;
    this.aclService.permissions.pipe(filter(Boolean))
      .subscribe({
        next: () => this.setDisabledStatus(this.aclService.isAvailable(this.resourcePath)),
      })
  }

  setDisabledStatus(status: boolean): void {
    if (status) {
      this.ref.nativeElement.removeAttribute('disabled');
      this.ref.nativeElement.href = this.initValue;
      this.ref.nativeElement.removeAttribute('title')
    } else {
      this.ref.nativeElement.setAttribute('disabled', 'true');
      this.ref.nativeElement.setAttribute('title', this.noAccessText);
      this.ref.nativeElement.removeAttribute('href');
    }
  }
}
