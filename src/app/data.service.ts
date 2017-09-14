import { EventEmitter, Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DataService {
    queryValueSubmitted = new EventEmitter<string>();
    queryFromHistory    = new EventEmitter<object>();
    companyToSave       = new EventEmitter<object>();
    companySelected     = new EventEmitter<string>();
    isQueryInHistory    = new EventEmitter<boolean>();
    storageSub          = new Subject<boolean>();


    constructor(private http: Http) {
    }

    getCompanyData(query) {
        const params = new URLSearchParams();
        params.set('CompanyId', query);
        console.log('api');

        return this.http.get('http://ihaveanidea.aveneo.pl/nipapi/api/company', { search: params })
            .map((res: Response) => {
                return res.json();
            });
    }

    watchStorage(): Observable<any> {
        return this.storageSub.asObservable();
    }

    getItems(storageArray) {
            for (const obj in window.localStorage) {
                console.log(obj);
                storageArray.push(JSON.parse(localStorage.getItem(obj)));
            }
    }

    setItem(key: string, data: any) {
        localStorage.setItem('' + key, JSON.stringify(data));
        this.storageSub.next(true);
    }

    removeItem(key) {
        localStorage.removeItem(key);
        this.storageSub.next(true);
    }
}
