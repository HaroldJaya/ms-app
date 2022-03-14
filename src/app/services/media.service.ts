import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
const GET_URL = "https://firebasestorage.googleapis.com/v0/b/testmainstreaming.appspot.com/o/library.json?alt=media&token=6fe008b7-5bab-4acd-bee1-a306649dc74f";
@Injectable({
  providedIn: 'root'
})
export class MediaService {
  constructor(private httpClient: HttpClient) { }
  /**
   * Retrieves data from GET_URL
   * @returns an Observable which emits the retrieved data if there wasn't any error and 'contents' is present, null otherwise.
   */
  public retrieveData(): Observable<any | undefined> {
    return this.httpClient.get(GET_URL).pipe(
      map((data: any) => !!data?.data?.contents ? data.data.contents: null),
      catchError<any, any | null>((error) => of(null)));
  }

  public retrieveDataTest(): Observable<any | undefined> {
    return this.httpClient.get("/assets/msGet.json").pipe(
      map((data: any) => !!data?.data?.contents? shuffleArray(data.data.contents): null),
      catchError<any, any | null>((error) => of(null)));
  }

}
function shuffleArray(array: any[]): any[] {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
