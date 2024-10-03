import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Status } from './login/login.component';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  userData: any;

  constructor(private http: HttpClient ) {}

  apiURL: string = 'http://localhost/galleria/galleria-api/api/';
  showModal = false;
  private generateQueryString(params: any): string {
    if (!params) return ''; // If no parameters, return an empty string
    return '?' + Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&');
  }

  sendRequestWithMedia(endpoint: string, data: any): Observable<Status> {
    return this.http.post<Status>(this.apiURL + endpoint, data);
  }

  // sendRequestWitoutMedia(endpoint: string, data: any, headers: any = null): Observable<Status> {
  //   return this.http.post<Status>(this.apiURL + endpoint, JSON.stringify(data), {headers});
  // }
  sendRequestWithoutMedia(endpoint: string, data: any, ): Observable<Status> {
    return this.http.post<Status>(this.apiURL + endpoint, data);
  }

  getRequest(endpoint: string) {
    const result = this.http.get(this.apiURL + endpoint);
    return result;
  }

  getRequestWithParams(endpoint: string, params: any) {

    const url = this.apiURL + endpoint + this.generateQueryString(params);

    return this.http.get(url);
  }

  delete(imageID: number): Observable<any> {
    return this.http.delete<any>(`${this.apiURL}delete-image/${imageID}`);
  }
  deleteComment(commentID: number): Observable<any> {
    return this.http.delete<any>(`${this.apiURL}delete-comment/${commentID}`);
  }

  deleteRequest(endpoint: string, data: any): Observable<any> {
    // Construct query parameters from the data object
    let params = new HttpParams();

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        params = params.append(key, data[key]);
      }
    }
    

    return this.http.delete<any>(`${this.apiURL}${endpoint}`, {
      params: params
    });

  }

  updateImageFilter(imageID: number, filter: string): Observable<any> {
    const data = { imgID: imageID, filter: filter };
    return this.http.post<any>(`${this.apiURL}update-filter`, data);
  }


deleteProject(projectId: number): Observable<any> {
  return this.http.delete<any>(`${this.apiURL}delete-project/${projectId}`);
}

deleteAccomplishment(accomplishmentId: number): Observable<any> {
  return this.http.delete<any>(`${this.apiURL}delete-accomplishment/${accomplishmentId}`);
}

deleteSkill(skillId: number): Observable<any> {
  return this.http.delete<any>(`${this.apiURL}delete-skill/${skillId}`);
}
deleteContact(contId: number): Observable<any> {
  return this.http.delete<any>(`${this.apiURL}delete-contact/${contId}`);
}

deleteService(serviceId: number): Observable<any> {
  return this.http.delete<any>(`${this.apiURL}delete-service/${serviceId}`);
}
addViews(studentID: any): Observable<any> {
  return this.http.delete<any>(`${this.apiURL}add-views/${studentID}`);
}
Approved(studentID: any): Observable<any> {
  return this.http.delete<any>(`${this.apiURL}approved/${studentID}`);
}
DeleteFaculty(facID: any): Observable<any> {
  return this.http.delete<any>(`${this.apiURL}delete-faculty/${facID}`);
}

  sendRequest(endpoint: string, data: any): Observable<Status> {
    return this.http.post<Status>(this.apiURL + endpoint, JSON.stringify(data));
  }
  
}
