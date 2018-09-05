import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable, from, of } from 'rxjs';
import { Settings } from '../models/settings/settings';
import { tap, map } from 'rxjs/operators';

/**
 * Gets and sets the application settings.
 */
@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly SETTINGS_KEY = 'settings';

  private _settings: Settings = null;

  constructor(private storage: Storage) {}

  /**
   * Saves the settings.
   * @param settings Settings.
   */
  saveSettings(): void {
    this.storage.set(this.SETTINGS_KEY, JSON.stringify(this._settings));
    this._settings = null;
  }

  /**
   * Retrieves the settings.
   */
  getSettings(): Observable<Settings> {
    let settings$: Observable<Settings>;

    if (this._settings) {
      settings$ = of(this._settings);
    } else {
      settings$ = from(this.storage.get(this.SETTINGS_KEY)).pipe(
        map(settings => (settings ? settings : Settings.getDefault())),
        tap(settings => (this._settings = settings))
      );
    }

    return settings$;
  }
}
