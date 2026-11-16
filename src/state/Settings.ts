import { CONFIG } from '../core/Config';
import { Observable } from './Observable';

// Shared, observable app settings 
export class Settings {
  readonly rate = new Observable<number>(CONFIG.rate.initial);
  readonly gravity = new Observable<number>(CONFIG.gravity.initial);
}
