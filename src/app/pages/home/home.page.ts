import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonInput, IonList, IonLabel, IonButton, IonNote, IonSpinner
} from '@ionic/angular/standalone';
import type { InputCustomEvent, InputOtpInputEventDetail } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, shareReplay, startWith, tap } from 'rxjs/operators';

import { SocialService, Post } from '../../core/services/social.service';
import { KpiService } from '../../core/metrics/kpi.service';

type PostVM = Post & { titlePretty: string };

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonInput, IonList, IonLabel, IonButton, IonNote, IonSpinner
  ],
  templateUrl: './home.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage implements OnInit {

  readonly queryCtrl = new FormControl<string>('', { nonNullable: true });

  loading = true;
  error = '';

  readonly posts$: Observable<PostVM[]>;
  readonly filtered$: Observable<PostVM[]>;

  private _inputT0 = 0;

  constructor(
    private api: SocialService,
    private router: Router,
    public kpi: KpiService
  ) {
    const t0 = performance.now();

    this.posts$ = this.api.getPostsCached().pipe(
      tap({
        next: (data) => {
          this.kpi.setHomeDataMs(Math.round(performance.now() - t0));
          this.loading = false;
          this.error = '';
          this.kpi.setRenderItems(data.length);
        },
        error: () => {
          this.loading = false;
          this.error = 'Error cargando posts';
        }
      }),
      map(posts => posts.map(p => ({
        ...p,
        titlePretty: `[${p.id}] ${p.title.toUpperCase()}`
      } satisfies PostVM))),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    const query$ = this.queryCtrl.valueChanges.pipe(
      startWith(this.queryCtrl.value),
      tap(() => (this._inputT0 = performance.now())),
      debounceTime(150),
      distinctUntilChanged(),
      tap(() => this.kpi.addInputSample(performance.now() - this._inputT0)),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    this.filtered$ = combineLatest([this.posts$, query$]).pipe(
      map(([posts, q]) => {
        const value = (q ?? '').trim().toLowerCase();
        if (!value) return posts;

        return posts.filter(p =>
          (p.title + ' ' + p.body).toLowerCase().includes(value)
        );
      }),
      tap(list => this.kpi.setRenderItems(list.length)),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  ngOnInit() {
    const navStart =
      (performance.getEntriesByType('navigation')[0] as any)?.startTime ?? 0;
    this.kpi.setStartupMs(Math.round(performance.now() - navStart));
  }

  onQueryInput(ev: Event) {
    const raw =
      (ev as InputCustomEvent<InputOtpInputEventDetail>).detail?.value ?? '';
    this.queryCtrl.setValue(String(raw));
  }

  trackById(_: number, p: PostVM) {
    return p.id;
  }

  openPost(p: PostVM) {
    this.router.navigate(['/detail', p.id]);
  }

  goSettings() {
    this.router.navigate(['/settings']);
  }
}
