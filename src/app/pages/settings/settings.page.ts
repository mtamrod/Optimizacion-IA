import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonButton, IonList, IonNote,
  IonAccordionGroup, IonAccordion
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';

import { KpiService } from '../../core/metrics/kpi.service';
import { METRICS_CATALOG, CategoryDef, KpiDef } from '../../core/metrics/metrics.catalog';
import { SocialService } from '../../core/services/social.service';

@Component({
  standalone: true,
  selector: 'app-settings',
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonLabel, IonButton, IonList, IonNote,
    IonAccordionGroup, IonAccordion
  ],
  templateUrl: './settings.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPage {
  catalog: CategoryDef[] = METRICS_CATALOG;

  constructor(
    private router: Router,
    public kpi: KpiService,
    private social: SocialService
  ) {
    // Valores manuales (ajústalos si tu profe os pide otra cosa)
    this.kpi.setManual('lazyRoutesCount', 3);
    this.kpi.setManual('sharedReusableComponents', 0); // en esta versión no se han creado shared components extra
    this.kpi.setManual('httpOutsideServices', 0);
    this.kpi.setManual('ionicUiRatio', 95);

    // Listas / eventos
    this.kpi.setManual('pageSize', 100);
    this.kpi.setManual('debounceMs', 150);
    this.kpi.setManual('devicesTested', 1);

    // Cache / API
    this.kpi.setManual('cacheTtlSeconds', 60);
    this.kpi.setManual('offlineFallback', false);
    this.kpi.setManual('manualRefresh', true);
  }

  reset() {
    this.kpi.reset();
  }

  refreshGood() {
    // Refresh controlado: limpiamos cache y recargamos 1 sola vez.
    this.social.clearCache();
    this.social.getPostsCached(true).subscribe({ next: () => {}, error: () => {} });
  }

  back() {
    this.router.navigate(['/home']);
  }

  displayValue(def: KpiDef): string {
    const v = this.kpi.getValueById(def.id);
    if (v === undefined || v === null || v === '') return 'N/A';
    if (typeof v === 'number') {
      if (def.unit === 'ms') return `${v.toFixed(2)} ms`;
      if (def.unit === '%') return `${v} %`;
      if (def.unit) return `${v} ${def.unit}`;
      return `${v}`;
    }
    if (typeof v === 'boolean') return v ? 'Sí' : 'No';
    return String(v);
  }

  sourceLabel(s: string): string {
    if (s === 'AUTO') return 'AUTO';
    if (s === 'DEVTOOLS') return 'DEVTOOLS';
    return 'MANUAL';
  }
}
