import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { SearchFormComponent } from './search-form/search-form.component';
import { HistoryComponent } from './history/history.component';

@NgModule({
    declarations: [
        AppComponent,
        SearchFormComponent,
        HistoryComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
