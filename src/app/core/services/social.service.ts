import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, shareReplay, tap } from 'rxjs/operators';
import { KpiService } from '../metrics/kpi.service';

export type Post = { userId: number; id: number; title: string; body: string };
export type Comment = { postId: number; id: number; name: string; email: string; body: string };

const API_BASE = 'https://jsonplaceholder.typicode.com';

@Injectable({ providedIn: 'root' })
export class SocialService {
  private posts$?: Observable<Post[]>;
  private commentsCache = new Map<number, Observable<Comment[]>>();

  constructor(private http: HttpClient, private kpi: KpiService) {}

  /**
   * Posts con cache in-memory.
   * - cacheMiss: primera carga
   * - cacheHit: reutilizaciones posteriores
   */
  getPostsCached(forceRefresh = false): Observable<Post[]> {
    if (!this.posts$ || forceRefresh) {
      this.kpi.incCacheMiss();
      this.posts$ = this.http.get<Post[]>(`${API_BASE}/posts`).pipe(
        // Comparte el último valor y evita repetir HTTP por cada suscripción
        shareReplay({ bufferSize: 1, refCount: true }),
        catchError(err => {
          // Si falla, no dejamos cache “envenenada”
          this.posts$ = undefined;
          throw err;
        })
      );
    } else {
      this.kpi.incCacheHit();
    }
    return this.posts$;
  }

  /**
   * Comentarios con cache por postId.
   */
  getCommentsCached(postId: number, forceRefresh = false): Observable<Comment[]> {
    const cached = this.commentsCache.get(postId);

    if (!cached || forceRefresh) {
      this.kpi.incCacheMiss();
      const req$ = this.http.get<Comment[]>(`${API_BASE}/posts/${postId}/comments`).pipe(
        shareReplay({ bufferSize: 1, refCount: true }),
        catchError(err => {
          this.commentsCache.delete(postId);
          throw err;
        })
      );
      this.commentsCache.set(postId, req$);
      return req$;
    }

    this.kpi.incCacheHit();
    return cached;
  }

  clearCache() {
    this.posts$ = undefined;
    this.commentsCache.clear();
  }
}
