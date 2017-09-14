import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataService } from '../data.service';

@Component({
    selector   : 'app-search-form',
    templateUrl: './search-form.component.html',
    styleUrls  : ['./search-form.component.css']
})
export class SearchFormComponent implements OnInit {

    queryParam: string                                                                                       = '';
    queryValue: string                                                                                       = '';
    company: any                                                                                             = {};
    objKeys                                                                                                  = Object.keys;
    keysPL: [string, string, string, string, string, string, string, string, string, string, string, string] =
        ['REGON', 'Nazwa', 'Województwo', 'Powiat', 'Gmina', 'Miasto', 'Kod pocztowy', 'Ulica', 'Nr budynku', 'Nr mieszkania', 'Data założenia', 'Typ działalności'];
    isInHistory: boolean;
    showLoader: boolean                                                                                      = false;

    constructor(public ds: DataService) {

    }

    ngOnInit() {
        this.ds.companySelected
            .subscribe(
                (value) => {
                    this.receiveData(value);
                }
            );
    }

    checkQuery(value, param) {
        if (param === 'nip') {
            value = value.replace(/[PL|pl]|\-|\s+$/g, '');
        }
        let length, controls;
        if (param === 'nip' || param === 'krs') {
            length   = 10;
            controls = '657234567';
        } else {
            length   = 9;
            controls = '89234567';
        }

        if (value.length === length) {

            /*
            * The numbers given in the specifications
            * aren't real and don't pass the validation
            * */


            // if (param === 'nip' || param === 'regon') {
            //     let sum = 0;
            //     for (let i = 0; i < length - 1; i++) {
            //         if (isNaN(value[i])) {
            //             return false;
            //         } else {
            //             sum += value[i] * parseInt(controls[i], 10);
            //         }
            //     }
            //     return sum % 11 === value[length - 1];
            // }
            return true;
        }
    }

    translateKeys(obj, translationKeys) {
        let i = 0;
        for (const key in obj) {
            obj[translationKeys[i]] = obj[key];
            delete obj[key];
            i++;
        }
    }

    receiveData(query) {
        this.showLoader = true;
        this.ds.queryValueSubmitted.emit(query);

        this.ds.isQueryInHistory
            .subscribe((bool: boolean) => {
                this.isInHistory = bool;
            });

        if (!this.isInHistory) {
            console.log(this.isInHistory);
            this.ds.getCompanyData(query)
                .subscribe(
                    (data) => {
                        if (data.Success) {
                            this.showLoader                    = false;
                            this.company                       = data.CompanyInformation;
                            this.company.BusinessActivityStart = new Date(this.company.BusinessActivityStart).toLocaleDateString();
                            this.translateKeys(this.company, this.keysPL);
                            this.ds.companyToSave.emit(this.company);
                        }
                    }
                );
        } else {
            console.log(this.isInHistory);
            this.showLoader = false;
            this.ds.queryFromHistory
                .subscribe(
                    (data) => {
                        console.log(data);
                        this.company = data.company;
                    }
                );
        }

    }

    onSubmit(f: NgForm) {
        // if (this.checkQuery(f.value.queryValue, f.value.queryParam)) {
        this.receiveData(this.queryValue);

    }
}


