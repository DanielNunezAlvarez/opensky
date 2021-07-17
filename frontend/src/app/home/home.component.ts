import { Component, OnInit, ViewChild } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { SortService } from '@syncfusion/ej2-angular-grids';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { addClass, removeClass } from '@syncfusion/ej2-base';
import { MapsTheme, Maps, Legend, Marker, MapsTooltip, ILoadEventArgs, Zoom, NavigationLine, MarkerSettingsModel, MarkerSettings, MarkerType } from '@syncfusion/ej2-angular-maps';
import worldMap from './world-map.json';
import worldAirports from './worldAirports.json'
import airportsDatabase from './airportsDatabase.json'
Maps.Inject(Legend, Marker, MapsTooltip, Zoom, NavigationLine);
declare var require: any;

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [SortService]
})
export class HomeComponent {

  constructor(private httpclient: HttpClient) {}
  
  // Define the initial variables
  public arrivals: Object[];
  public airport: string = 'EDDM';
  public begin: string = '1517227200';
  public end: string = '1517230800';
  public arrivalLocation: Array<any> = [];
  public departureLocation: Array<any> = [];
  public loadingTable = false;
  public pageSettings: Object;
  public today: Date = new Date();

//   New time picker
  public maxBeginDate: Date = new Date();
  public minEndDate: Date = new Date();
  public maxEndDate: Date = new Date();
  public format: string = 'dd/MM/yyyy HH:mm:ss';
  
//   New triple check flag
  public airportFlag: boolean = false;
  public beginFlag: boolean = false;
  public endFlag: boolean = false;
  
  public flag: boolean = false;

  //Execute on init
  public ngOnInit(): void {
    this.pageSettings = { pageCount: 5 }
  }

  // --- Airport selection ---
  @ViewChild('sample')
  public listObj: DropDownListComponent;
 
  //Define the airport data
  public airportsData: Object[] = worldAirports['airports']
  
  //Maps the appropriate column to fields property
  public fields: Object = { text: 'name', value: 'code' };

  //Set the height of the popup element
  public height: string = '220px';
  
  //Set the placeholder to DropDownList input element
  public waterMark: string = 'Select an airport';

  //Set the value to select an item based on mapped value at initial rendering
  public value: string = 'EDDM';

  //Function to execute when an airport is selected
  public onChange(args: any): void {
      let value: Element = document.getElementById('value');
      let text: Element = document.getElementById('text');
      
      value.innerHTML = this.listObj.value.toString();
      text.innerHTML = this.listObj.text;

      this.airport = this.listObj.value.toString();
        
        this.arrivalLocation[0] = airportsDatabase[this.airport];
        this.maps.layers[0].markerSettings = [
        { 
        visible: true, 
        dataSource: this.arrivalLocation, 
        shape: 'Image', 
        imageUrl: './assets/images/arrivalPosition.jpg', 
        height: 20, width: 20,
        tooltipSettings: { visible: true, valuePath: 'name' }, 
        animationDuration: 0 
        },
        { 
          visible: true, 
          dataSource: [], 
          shape: 'Image', 
          imageUrl: './assets/images/departurePosition.png', 
          height: 20, width: 20,
          tooltipSettings: { visible: true, valuePath: 'name' }, 
          animationDuration: 0 
        }
        ];

        this.maps.refresh();

    this.airportFlag = true;

    if (this.airportFlag == true && this.beginFlag == true && this.endFlag == true){
      this.getOpenskyStatistics(this.airport, this.begin, this.end)
    }
    
  }

  // --- API Request ---
  // Function to get the API response
  getOpenskyStatistics(airport, begin, end): void{
    this.loadingTable = true;
    
    this.getOpenskyStats(airport, begin, end).subscribe((data)=>{
      this.arrivals = data['arrivals'];
      this.departureAirportsLocation(this.arrivals)
      this.loadingTable = false;
    });
    
  }

      // Function to get departure airports location
      departureAirportsLocation(arrivalsArray): void{
      
        let j = 0
        for (let i = 0; i < arrivalsArray.length; i++) {
          if (arrivalsArray[i]['departureAirport']!=null){
            try {
              this.departureLocation[j] = airportsDatabase[arrivalsArray[i]['departureAirport']]
              j = j+1
            }
            catch {
            }

          }
        }
  
        this.maps.layers[0].markerSettings = [
          { 
          visible: true, 
          dataSource: this.arrivalLocation, 
          shape: 'Image', 
          imageUrl: './assets/images/arrivalPosition.jpg', 
          height: 20, width: 20,
          tooltipSettings: { visible: true, valuePath: 'name' }, 
          animationDuration: 0 
          },
          { 
            visible: true, 
            dataSource: this.departureLocation, 
            shape: 'Image', 
            imageUrl: './assets/images/departurePosition.png', 
            height: 20, width: 20,
            tooltipSettings: { visible: true, valuePath: 'name' }, 
            animationDuration: 0 
          }
          ];
  
        this.maps.refresh();
  
        }

  // Function to make the API request
  public getOpenskyStats(airport, begin, end) {
    return this.httpclient.get("/api/v1/opensky/stats/"+airport+"/"+begin+"/"+end);
  }

  // --- Date Picker ---

  //Function to execute when a begin date is selected
  public onValueChangeBegin(args: any):void {
    
    let inputBegin: Element = document.getElementById('selectedBegin');
    inputBegin.innerHTML = 'Selected Value: ' + args.value.toLocaleDateString();
    
    this.minEndDate = new Date(args.value)
    
    let maxEndDateAux = new Date(args.value)
   
    maxEndDateAux.setDate(maxEndDateAux.getDate()+7);
    
    if (maxEndDateAux>this.today) {
      this.maxEndDate = this.today
    }
    else {
      this.maxEndDate = maxEndDateAux
    }
  
    let dayBegin = (args.value.getDate().toString())
    let monthBegin = (args.value.getMonth()+1).toString()
    let yearBegin = args.value.getFullYear().toString()
    let hourBegin = args.value.getHours().toString()
    let minuteBegin = args.value.getMinutes().toString()
    let secondBegin = args.value.getSeconds().toString()
    
    let dateBegin = yearBegin+" "+monthBegin+" "+dayBegin+" "+hourBegin+":"+minuteBegin+":"+secondBegin
    
    let datumBegin = Date.parse(dateBegin.toString())/1000
    
    this.begin = datumBegin.toString();

    this.beginFlag = true;

    if (this.airportFlag == true && this.beginFlag == true && this.endFlag == true){
      this.getOpenskyStatistics(this.airport, this.begin, this.end)
    }
    
  }

  //Function to execute when a begin date is selected
  public onValueChangeEnd(args: any):void {   
    
    let inputEnd: Element = document.getElementById('selectedEnd');
    inputEnd.innerHTML = 'Selected Value: ' + args.value.toLocaleDateString();
  
    let dayEnd = (args.value.getDate().toString())
    let monthEnd = (args.value.getMonth()+1).toString()
    let yearEnd = args.value.getFullYear().toString()
    let hourEnd = args.value.getHours().toString()
    let minuteEnd = args.value.getMinutes().toString()
    let secondEnd = args.value.getSeconds().toString()
    
    let dateEnd = yearEnd+" "+monthEnd+" "+dayEnd+" "+hourEnd+":"+minuteEnd+":"+secondEnd
    
    let datumEnd = Date.parse(dateEnd.toString())/1000
    
    this.end = datumEnd.toString();

    this.endFlag = true;

    if (this.airportFlag == true && this.beginFlag == true && this.endFlag == true){
      this.getOpenskyStatistics(this.airport, this.begin, this.end)
    }
    
    
  }
  
  //--- Results table ---

  @ViewChild('grid')
  public grid: GridComponent;

  //Function to hide or show columns
  public onClicked(e: MouseEvent): void {
    if (!this.flag) { return; }

    let element: HTMLElement = <HTMLInputElement>e.target;

    if (!element.classList.contains('e-tbar-btn-text') && !element.classList.contains('e-tbar-btn')) {
        return;
    }

    element = <HTMLElement>(element.tagName === 'BUTTON' ? element.firstElementChild : element);
    this.flag = false;
    let hidden: boolean = element.classList.contains('e-ghidden');
    let classFn: Function = hidden ? removeClass : addClass;
    classFn([element], 'e-ghidden');

    if (hidden) {
        this.grid.showColumns(element.innerHTML);
    } else {
        this.grid.hideColumns(element.innerHTML);
    }
    this.flag = true;
  }

  //Function to define the data bound
  public dataBound(): void {
    this.flag = true;
  }


  // --- Maps ----

    @ViewChild('maps')
    public maps: Maps;

    public load = (args: ILoadEventArgs) => {
        let theme: string = location.hash.split('/')[1];
        theme = theme ? theme : 'Material'; 
        args.maps.theme = <MapsTheme>(theme.charAt(0).toUpperCase() + theme.slice(1));
    }

    public zoomSettings: object = {
        enable: true
    };

    public layers: object[] = [{
        layerType: 'OSM',

        markerClusterSettings: {
          allowClustering: true,
          shape: 'Image',
          height: 30,
          width: 30,
          labelStyle: {color: 'black'},
          imageUrl: './assets/images/departurePosition.png'
        }
    }];
    
    public title: string = 'Airports location';

    public titleSettings: object = {
      text: this.title,
      titleStyle: {size: '16px'}
    };
  

}
