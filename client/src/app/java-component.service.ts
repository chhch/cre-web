import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {of} from 'rxjs/observable/of';
import {catchError, tap} from "rxjs/operators";
import {JavaComponent} from "./java-component";
import {Scope} from "./scope.enum";
import {AlertService} from "./alert.service";
import * as EventSource from 'eventsource';
import {JavaComponentLogMessage} from "./java-component-log-message";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class JavaComponentService {

  private baseUrl = 'api/components';

  constructor(private http: HttpClient, private alertService: AlertService) {
  }

  /** GET javaComponents from the server */
  getJavaComponents(): Observable<JavaComponent[]> {
    return this.http.get<JavaComponent[]>(this.baseUrl)
      .pipe(
        tap(_ => this.log(`fetched javaComponents`)),
        catchError(this.handleError('getJavaComponents', []))
      );
  }

  /** GET javaComponents log from the server */
  getJavaComponentsLog(): Observable<JavaComponentLogMessage> {
    return Observable.create(observer => {
      const eventSource = new EventSource(`${this.baseUrl}/log`);
      eventSource.onmessage = x => observer.next(JSON.parse(x.data) as JavaComponentLogMessage);
      eventSource.onerror = x => observer.error(x);

      return () => eventSource.close();
    }).pipe(
      tap(_ => this.log(`fetched log event`)),
      catchError(this.handleError('getJavaComponentsLog'))
    );
  }

  /** upload jar to the server */
  uploadJavaComponent(file: File): Observable<JavaComponent> {
    const formData = new FormData();  // https://stackoverflow.com/a/46957808
    formData.append('file', file, file.name);

    return this.http.post<JavaComponent>(this.baseUrl, formData)
      .pipe(
        tap(file => this.log(`upload file w/ name=${file.name}`)),
        catchError(this.handleError<JavaComponent>('uploadJavaComponent'))
      );
  }

  /** start javaComponent on the server */
  startJavaComponent(id: String): Observable<JavaComponent> {
    return this.http.put<JavaComponent>(`${this.baseUrl}/${id}/start`, null, httpOptions)
      .pipe(
        tap(javaComponent => this.log(`started javaComponent w/ id=${javaComponent.id}`)),
        catchError(this.handleError<JavaComponent>('startJavaComponent'))
      );
  }

  /** stop javaComponent on the server */
  stopJavaComponent(id: String): Observable<JavaComponent> {
    return this.http.put<JavaComponent>(`${this.baseUrl}/${id}/stop`, null, httpOptions)
      .pipe(
        tap(javaComponent => this.log(`stoped javaComponent w/ id=${javaComponent.id}`)),
        catchError(this.handleError<JavaComponent>('stopJavaComponent'))
      );
  }

  /** unload javaComponent on the server */
  unloadJavaComponent(id: String): Observable<JavaComponent> {
    return this.http.put<JavaComponent>(`${this.baseUrl}/${id}/unload`, null, httpOptions)
      .pipe(
        tap(javaComponent => this.log(`unload javaComponent w/ id=${javaComponent.id}`)),
        catchError(this.handleError<JavaComponent>('unloadJavaComponent'))
      );
  }

  /** set Scope of a javaComponent on the server */
  setScope(id: String, scope: Scope): Observable<JavaComponent> {
    return this.http.put<JavaComponent>(`${this.baseUrl}/${id}/scope/${scope}`, null, httpOptions)
      .pipe(
        tap(scope => this.log(`set scope ${scope.scope} javaComponent w/ id=${id}`)),
        catchError(this.handleError<JavaComponent>('setScope'))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      let errorMessage = `${operation} failed: `;
      if (error.type === 'error') {
        errorMessage += `Connection timeout. Reload page.`;
      } else if (error.headers) {
        errorMessage += `${error.headers.get("cre-cause")}`;
      } else if (error.messsage) {
        errorMessage += `${error.messsage}`;
      } else {
        errorMessage += `Unknown error.`
      }

      this.alertService.addAlert(errorMessage);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a JavaComponentService message with the MessageService */
  private log(message: string) {
    console.log(message);
    // this.alertService.addInfo(message)
  }

}
