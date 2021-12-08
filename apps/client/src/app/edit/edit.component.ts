import { Component } from '@angular/core';
import { objectVal } from 'rxfire/database';
import { Database, ref, runTransaction, set } from '@angular/fire/database';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'shiny-hunting-overlay-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less']
})
export class EditComponent {
  public hunting$ = objectVal<number>(ref(this.db, '/hunting'));

  public caught$ = objectVal<number>(ref(this.db, '/caught'));
  public done$ = objectVal<number>(ref(this.db, '/done'));
  public total$ = objectVal<number>(ref(this.db, '/total'));
  public resets$ = objectVal<number>(ref(this.db, '/resets'));

  constructor(private db: Database) {
    fromEvent(document, 'keydown').subscribe((event: any) => {
      if (event.key === '+') {
        this.incrementResets();
      }
    });
  }

  setHunting(hunting: number): void {
    set(ref(this.db, '/hunting'), hunting);
  }

  setCaught(caught: number): void {
    set(ref(this.db, '/caught'), caught);
  }

  setResets(resets: number): void {
    set(ref(this.db, '/resets'), resets);
  }

  incrementResets(): void {
    runTransaction(ref(this.db, '/resets'), value => value + 1);
  }

  setCount(done: number, total: number): void {
    set(ref(this.db, '/done'), done);
    set(ref(this.db, '/total'), total);
  }

}
