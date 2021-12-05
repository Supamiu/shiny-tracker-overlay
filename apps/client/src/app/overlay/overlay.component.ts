import { Component } from '@angular/core';
import { objectVal } from 'rxfire/database';
import { Database, ref } from '@angular/fire/database';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { getDownloadURL, ref as storageRef, Storage } from '@angular/fire/storage';
import { combineLatest, from, Observable, of } from 'rxjs';

@Component({
  selector: 'shiny-hunting-overlay-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.less']
})
export class OverlayComponent {

  public hunting$ = objectVal<number>(ref(this.db, '/hunting')).pipe(
    filter(id => !!id),
    switchMap(id => {
      return this.completeId(id);
    })
  );

  public caught$ = objectVal<number>(ref(this.db, '/caught')).pipe(
    filter(id => !!id),
    switchMap(id => {
      return this.completeId(id);
    })
  );

  public done$ = objectVal<number>(ref(this.db, '/done'));
  public total$ = objectVal<number>(ref(this.db, '/total'));
  public resets$ = objectVal<number>(ref(this.db, '/resets')).pipe(
    map(resets => ({value: resets}))
  );

  public progress$ = combineLatest([
    this.done$, this.total$
  ]).pipe(
    map(([done, total]) => ({done, total}))
  )

  constructor(private db: Database, private http: HttpClient,
              private storage: Storage) {
  }

  private completeId(id: number): Observable<{ id: number, name: string, gif: string } | null> {
    return this.http.get<any>(`https://pokeapi.co/api/v2/pokemon/${id}`).pipe(
      switchMap(pokemon => {
        const gifName = pokemon.forms[0].name
          .split('-')
          .map((name: string) => `${name.slice(0, 1).toUpperCase()}${name.slice(1)}`)
          .join('_');
        const ref = storageRef(this.storage, `${gifName}.gif`);
        return from(getDownloadURL(ref)).pipe(
          map(gif => {
            return {
              id: id,
              name: pokemon.name,
              gif
            };
          })
        );
      }),
      catchError(() => of(null))
    );
  }

}
