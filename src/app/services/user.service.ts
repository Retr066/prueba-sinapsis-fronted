import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { User } from "../models/user.model";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
     private readonly http: HttpClient
  ) { }

     getUser() : Observable<User[]> {
       return this.http.get<{data:User[]}>(environment.apiUrl + 'users')
       .pipe(
         map(response => response.data)
       );
     }
   
}
