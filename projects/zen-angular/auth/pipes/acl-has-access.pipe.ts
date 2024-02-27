import {Pipe, PipeTransform} from "@angular/core";
import {AclService} from "../services";

@Pipe({
  name: 'aclHasAccess',
  pure: false,
})
export class AclHasAccessPipe implements PipeTransform {
  constructor(
    private readonly aclService: AclService
  ) {
  }

  transform(resourcePath?: string | undefined): boolean {
    if(!resourcePath){
      return true;
    }
    return this.aclService.isAvailable(resourcePath);
  }
}
