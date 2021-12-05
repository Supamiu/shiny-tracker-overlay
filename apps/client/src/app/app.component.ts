import { Component } from '@angular/core';
import { filter, map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Database, ref } from '@angular/fire/database';
import { objectVal } from 'rxfire/database';
import { from, Observable } from 'rxjs';
import { getDownloadURL, ref as storageRef, Storage } from '@angular/fire/storage';

@Component({
  selector: 'shiny-hunting-overlay-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
}
