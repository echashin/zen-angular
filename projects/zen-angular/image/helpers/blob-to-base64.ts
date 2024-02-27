import {from, Observable} from "rxjs";

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result));
    reader.readAsDataURL(blob);
  });
}

export function blobToBase64Observer(blob: Blob): Observable<string> {
  return from(blobToBase64(blob));
}