import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { from } from 'rxjs/observable/from';
import { of } from 'rxjs/observable/of';
import { map, tap } from 'rxjs/operators';
import { Settings } from '../../models/settings/settings';

/**
 * Gets and sets the application settings.
 */
@Injectable()
export class SettingsProvider {

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
