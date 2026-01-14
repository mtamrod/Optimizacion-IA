import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonButton, IonNote, IonSpinner
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, combineLatest, of } from 'rxjs';
import { catchError, map, shareReplay, switchMap, tap } from 'rxjs/operators';

import { SocialService, Comment, Post } from '../../core/services/social.service';
import { KpiService } from '../../core/metrics/kpi.service';

type CommentVM = Comment & { emailPretty: string };

@Component({
  standalone: true,
  selector: 'app-detail',
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonButton, IonNote, IonSpinner
  ],
  templateUrl: './detail.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailPage {
  loading = true;
  error = '';

  readonly postId$: Observable<number> = this.route.paramMap.pipe(
    map(pm => Number(pm.get('id') ?? 0)),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly title$: Observable<string> = this.postId$.pipe(
    switchMap(id => this.api.getPostsCached().pipe(
      map(posts => posts.find(p => p.id === id)?.title ?? `Post #${id}`),
      catchError(() => of('Detalle'))
    )),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly comments$: Observable<CommentVM[]>;

  constructor(
    private api: SocialService,
    private route: ActivatedRoute,
    private router: Router,
    public kpi: KpiService
  ) {
    const t0 = performance.now();

    this.comments$ = this.postId$.pipe(
      switchMap(id => this.api.getCommentsCached(id).pipe(
        map(list => list.map(c => ({ ...c, emailPretty: c.email.toLowerCase() } as CommentVM))),
        tap({
          next: (list) => {
            // KPI reutilizamos “forecastDataMs” como “detailDataMs”
            this.kpi.setForecastDataMs(Math.round(performance.now() - t0));
            this.kpi.setRenderItems(list.length);
            this.loading = false;
            this.error = '';
          },
          error: () => {
            this.loading = false;
            this.error = 'Error cargando comentarios';
          }
        }),
        catchError(() => of([]))
      )),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  trackById(_: number, c: CommentVM) {
    return c.id;
  }

  back() {
    this.router.navigate(['/home']);
  }

  goSettings() {
    this.router.navigate(['/settings']);
  }
}
