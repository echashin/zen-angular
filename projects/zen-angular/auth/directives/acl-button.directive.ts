import {Directive, ElementRef, Injector, Input, OnInit} from '@angular/core';
import {NzButtonComponent} from "ng-zorro-antd/button";
import {filter} from "rxjs/operators";
import {AclService} from "../services";

@Directive({
  selector: '[acl-button]',
})
export class AclButtonDirective implements OnInit {
  @Input({required: true}) resourcePath: string = '';
  btn!: HTMLButtonElement | NzButtonComponent;
  initStatus: boolean = false;

  constructor(
    private readonly ref: ElementRef<HTMLButtonElement>,
    private readonly injector: Injector,
    private readonly aclService: AclService,
  ) {
    const ngButton: NzButtonComponent | null = this.injector.get(NzButtonComponent, null);
    this.btn = ngButton ?? this.ref.nativeElement;
  }

  ngOnInit(): void {
    this.initStatus = this.btn.disabled;
    this.aclService.permissions.pipe(filter(Boolean))
      .subscribe({
        next: () => {
          this.setDisabledStatus(this.aclService.isAvailable(this.resourcePath));
        }
      });
  }

  setDisabledStatus(status: boolean): void {
    if (status) {
      this.btn.disabled = this.initStatus;
    } else {
      this.btn.disabled = true;
    }
  }
}
