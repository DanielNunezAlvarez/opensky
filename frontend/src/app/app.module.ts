import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule, NbLayoutModule, NbIconModule, NbMenuModule, NbSidebarModule, NbCardModule, NbSpinnerModule, NbButtonModule, NbBadgeModule, NbAccordionModule, NbListModule, NbTabsetModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { ButtonModule, CheckBoxModule, RadioButtonModule, SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { MapsAllModule } from '@syncfusion/ej2-angular-maps';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NbIconModule,               // <---------
    NbSidebarModule.forRoot(),  // <---------
    NbMenuModule.forRoot(),     // <---------
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbCardModule, 
    NbEvaIconsModule,
    NbSpinnerModule,
    NbButtonModule,
    NbBadgeModule,
    HttpClientModule,
    ChartsModule,
    NbAccordionModule,
    NbListModule,
    NbTabsetModule,
    DropDownListModule,
    FormsModule,
    ReactiveFormsModule,
    GridAllModule,
    DateRangePickerModule,
    CalendarModule,
    ButtonModule, 
    CheckBoxModule, 
    RadioButtonModule, 
    SwitchModule,
    ToolbarModule,
    MapsAllModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
