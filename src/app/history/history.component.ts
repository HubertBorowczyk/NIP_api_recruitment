import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
    selector   : 'app-history',
    templateUrl: './history.component.html',
    styleUrls  : ['./history.component.css']
})
export class HistoryComponent implements OnInit {
    queryValue: string;
    historicalQueries = [];
    expDate: number;

    constructor(private ds: DataService) {
    }

    ngOnInit() {
        // localStorage.clear();
        this.ds.getItems(this.historicalQueries);

        this.ds.watchStorage().subscribe((data) => {
            this.ds.getItems(this.historicalQueries);
            console.table(this.historicalQueries);
        });

        this.ds.queryValueSubmitted
            .subscribe(
                (value: string) => {
                    this.queryValue = value;
                    const isInArray = this.historicalQueries.map(function(obj) {
                        return obj.queryValue;
                    });

                    if (isInArray.includes(this.queryValue)) {
                        this.ds.isQueryInHistory.emit(true);
                        this.getQueryFromHistory(this.queryValue);
                    } else {
                        this.ds.isQueryInHistory.emit(false);
                        this.addQueryToHistory(this.queryValue);
                    }
                }
            );
    }

    addQueryToHistory(value) {
        this.ds.companyToSave
            .subscribe(
                (company) => {
                    const historyObject = {
                        'company'   : company,
                        'queryValue': value,
                        'timestamp' : new Date().getTime()
                    };
                    this.ds.setItem(this.queryValue, historyObject);
                }
            );
    }

    getQueryFromHistory(query) {
        for (const obj of this.historicalQueries) {
            if (obj.queryValue === query) {
                console.table(obj);
                this.ds.queryFromHistory.emit(obj);
            }
        }
    }

    onSelectHistoryItem(value) {
        this.ds.companySelected.emit(value);
    }

    setExpirationDate(value) {
        this.expDate = value * 86400;
    }
}

