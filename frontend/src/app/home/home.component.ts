import { Component, OnInit, ViewChild } from '@angular/core';
// import { Query } from '@syncfusion/ej2-data';
// import { EmitType } from '@syncfusion/ej2-base';
// import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { ViewEncapsulation } from '@angular/core';
// import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';
import { HttpClient } from '@angular/common/http';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { SortService } from '@syncfusion/ej2-angular-grids';
// import { DateRangePickerComponent } from '@syncfusion/ej2-angular-calendars';
// import { ButtonComponent } from '@syncfusion/ej2-angular-buttons';
// import { ChangeEventArgs } from '@syncfusion/ej2-angular-calendars';
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
  public arrivalLocation: Array<any> = [{ latitude: 51.5326602, longitude: -0.1262422, name: 'London' }];
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
  
//   @ViewChild('maps')
//   public maps: Maps;

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
    
//       this.arrivalLocation = []
    
//     this.maps.layers[0].markerSettings= [{ 
//           visible: true, 
//           dataSource: [
//               { latitude: 37.6276571, longitude: -122.4276688, name: 'San Bruno' }, 
//               { latitude: 33.5302186, longitude: -117.7418381, name: 'Laguna Niguel' }, 
//               { latitude: 40.7424509, longitude: -74.0081468, name: 'New York' }, 
//               { latitude: -23.5268201, longitude: -46.6489927, name: 'Bom Retiro' }, 
//               { latitude: 43.6533855, longitude: -79.3729994, name: 'Toronto' }, 
//               { latitude: 48.8773406, longitude: 2.3299627, name: 'Paris' }, 
//               { latitude: 52.4643089, longitude: 13.4107368, name: 'Berlin' }, 
//               { latitude: 19.1555762, longitude: 72.8849595, name: 'Mumbai' }, 
//               { latitude: 35.6628744, longitude: 139.7345469, name: 'Minato' }, 
//               { latitude: 51.5326602, longitude: -0.1262422, name: 'London' }
//           ], 
//           shape: 'Image', 
//           imageUrl: './assets/images/departurePosition.png', 
//           height: 20, width: 20,
//           tooltipSettings: { visible: true, valuePath: 'name' }, 
//           animationDuration: 0 
//       }, 
//       { 
//         visible: true, 
//         dataSource: [
//               { latitude: 37.6276571, longitude: -122.4276688, name: 'San Bruno' }, 
//               { latitude: 33.5302186, longitude: -117.7418381, name: 'Laguna Niguel' }, 
//               { latitude: 40.7424509, longitude: -74.0081468, name: 'New York' }, 
//               { latitude: -23.5268201, longitude: -46.6489927, name: 'Bom Retiro' }, 
//               { latitude: 43.6533855, longitude: -79.3729994, name: 'Toronto' }, 
//               { latitude: 48.8773406, longitude: 2.3299627, name: 'Paris' }, 
//               { latitude: 52.4643089, longitude: 13.4107368, name: 'Berlin' }, 
//               { latitude: 19.1555762, longitude: 72.8849595, name: 'Mumbai' }, 
//               { latitude: 35.6628744, longitude: 139.7345469, name: 'Minato' }, 
//               { latitude: 51.5326602, longitude: -0.1262422, name: 'London' }
//           ], 
//         shape: 'Image', 
//         imageUrl: './assets/images/arrivalPosition.jpg', 
//         height: 20, width: 20,
//         tooltipSettings: { visible: true, valuePath: 'name' }, 
//         animationDuration: 0 
//       },
//       ],
      
//       this.layers[0] = {};
//       this.maps.refresh();
   
//       this.getOpenskyStatistics(this.airport, this.begin, this.end)
    
        this.maps.layers[0].markerSettings = [];
        this.maps.layers[0].navigationLineSettings = [];
        this.navigationLines = [];
        this.emptySavedLinePositions();
        this.maps.refresh();
        this.disableButton = true;


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
      this.loadingTable = false;
    });
  }

  // Function to make the API request
  public getOpenskyStats(airport, begin, end) {
    return this.httpclient.get("/api/v1/opensky/stats/"+airport+"/"+begin+"/"+end);
  }

  // --- Date Picker ---

  //Function to execute when a begin date is selected
  public onValueChangeBegin(args: any):void {
    
//     let inputBegin: Element = document.getElementById('selectedBegin');
//     inputBegin.innerHTML = 'Selected Value: ' + args.value.toLocaleDateString();

//     this.minDate = new Date(args.value)
//     let maxAux = new Date(args.value)
//     maxAux.setDate(maxAux.getDate()+7);
//     this.maxDate = maxAux
//     let dayBegin = (args.value.getDate().toString())
//     let monthBegin = (args.value.getMonth()+1).toString()
//     let yearBegin = args.value.getFullYear().toString()

//     let dateBegin = yearBegin+" "+monthBegin+" "+dayBegin+" 00:00:00"

//     let datumBegin = Date.parse(dateBegin.toString())/1000
    
//     this.begin = datumBegin.toString();

//     this.getOpenskyStatistics(this.airport, this.begin, this.end)

//     For date time picker
    
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
    
    
//     let inputEnd: Element = document.getElementById('selectedEnd');
//     inputEnd.innerHTML = 'Selected Value: ' + args.value.toLocaleDateString();

//     let dayEnd = (args.value.getDate().toString())
//     let monthEnd = (args.value.getMonth()+1).toString()
//     let yearEnd = args.value.getFullYear().toString()

//     let dateEnd = yearEnd+" "+monthEnd+" "+dayEnd+" 00:00:00"

//     let datumEnd = Date.parse(dateEnd.toString())/1000
    
//     this.end = datumEnd.toString();

//     this.getOpenskyStatistics(this.airport, this.begin, this.end)

    
    //For date time picker
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

//   titleSettings: object = {
//     text: 'Airports Location',
//     textStyle: {
//         size: '16px'
//     }
//   };
//   public zoomSettings: object = {
//       enable: false
//   };
//   public legendSettings: object = { visible: true };

//   public layers: object[] = [{
//       shapeData: worldMap,
//       shapePropertyPath: 'continent',
//       shapeDataPath: 'continent', 
//       shapeSettings: { colorValuePath: 'color', }, 
//   },

// ];
//   // custom code start
//   public load = (args: ILoadEventArgs) => {
//       let theme: string = location.hash.split('/')[1];
//       theme = theme ? theme : 'Material';
//       args.maps.theme = <MapsTheme>(theme.charAt(0).toUpperCase() + theme.slice(1));
//   }

      public markerCheckedState: boolean = true;
    public lineCheckedState: boolean = false;
    public connectLineCheckedState: boolean = false;
    public navigationLines: Object[] = [];
    public latitude: number[] = [];
    public longitude: number[] = [];
    public lineWidth: number = 1;
    public disableLineWidthTextBox: boolean = true;
    public disableConnectLineCheckbox: boolean = true;
    public disableButton: boolean = true;
    public disableShapeBox: boolean = false;
    public markerShape: string = "Image";

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
        layerType: 'OSM'
    }];


    markerChangeHandler = (args: CheckBoxChangeEvents) => {
        this.markerCheckedState = args.checked;
        if (args.checked) {
            this.disableShapeBox = false;
        } else {
            this.disableShapeBox = true;
        }
    };
    lineChangeHandler = (args: CheckBoxChangeEvents) => {
        this.lineCheckedState = args.checked;
        if (args.checked) {
            this.disableConnectLineCheckbox = this.disableLineWidthTextBox = !args.checked;
        }
        else {
            this.disableConnectLineCheckbox = this.disableLineWidthTextBox = !args.checked;
            this.connectLineCheckedState = args.checked;
        }
    }
    connectionLineChangeHandler = (args: CheckBoxChangeEvents) => {
        this.connectLineCheckedState = args.checked;
        if (!args.checked) {
            this.emptySavedLinePositions();
        }

    }
    clearItems = () => {
        this.maps.layers[0].markerSettings = [];
        this.maps.layers[0].navigationLineSettings = [];
        this.navigationLines = [];
        this.emptySavedLinePositions();
        this.maps.refresh();
        this.disableButton = true;
    }

    public mapClicked = (args: any) => {
        if (this.markerCheckedState && args['path'][1].id.indexOf('_Zooming_') == -1) {
            this.addMarker(args);
        }
        if (this.lineCheckedState && !this.connectLineCheckedState) {
            this.addLine(args, this.lineWidth);
        }
        if (this.connectLineCheckedState) {
            this.addLine(args, this.lineWidth, true);
        }
        if (this.markerCheckedState || this.lineCheckedState || this.connectLineCheckedState) {
            this.maps.refresh();
            if (this.disableButton && (this.maps.layers[0].markerSettings.length ||
            this.maps.layers[0].navigationLineSettings.length)) {
                this.disableButton = false;
            }
        }
    }

    public emptySavedLinePositions: any = () => {
        this.latitude = [];
        this.longitude = [];
    };
    public addMarker: any = (args: any) => {
        if (args['latitude'] !== null && args['longitude'] !== null) {
            let layerIndex: number = 0;
            let geo = this.maps.getTileGeoLocation(args.layerX, args.layerY);
            args['latitude'] = geo['latitude'];
            args['longitude'] = geo['longitude'];
            let marker: MarkerSettingsModel[];
            let dynamicMarker: MarkerSettingsModel[] = this.maps.layersCollection[layerIndex].markerSettings;
            dynamicMarker.push(new MarkerSettings(this.maps, 'markerSettings', marker));
            let markerIndex: number = dynamicMarker.length - 1;
            dynamicMarker[markerIndex].visible = true;
            dynamicMarker[markerIndex].dataSource = [
                { latitude: args['latitude'], longitude: args['longitude'], name: 'dynamicmarker' }
            ];
            dynamicMarker[markerIndex].animationDuration = 0;
            dynamicMarker[markerIndex].fill = '#DB4537';
            dynamicMarker[markerIndex].shape = (this.markerShape !== 'Image') ? this.markerShape as MarkerType : 'Image';
            dynamicMarker[markerIndex].height = (this.markerShape !== 'Image') ? 12 : 20;
            dynamicMarker[markerIndex].width = (this.markerShape !== 'Image') ? 12 : 20;
            dynamicMarker[markerIndex].imageUrl = (this.markerShape !== 'Image') ? '' : './assets/maps/images/ballon.png';
        }
    };
    public addLine: any = (lineArgs: any, lineWidth: number, connectiveLine?: boolean) => {
        let geo = this.maps.getTileGeoLocation(lineArgs.layerX, lineArgs.layerY);
        lineArgs['latitude'] = geo['latitude'];
        lineArgs['longitude'] = geo['longitude'];
        if (lineArgs.latitude != null && lineArgs.longitude != null) {
            this.latitude.push(lineArgs.latitude);
            this.longitude.push(lineArgs.longitude);
        }
        if (this.latitude.length >= 2) {
            this.navigationLines.push({
                'visible': true,
                'latitude': [this.latitude[(this.latitude.length - 2)], this.latitude[(this.latitude.length - 1)]],
                'longitude': [this.longitude[(this.longitude.length - 2)], this.longitude[(this.longitude.length - 1)]],
                'angle': 0,
                'color': 'blue',
                'width': (lineWidth > 5) ? 5 : (((5 >= lineWidth) && (lineWidth >= 1)) ? lineWidth : 1)
            });
            this.maps.layers[0].navigationLineSettings = this.navigationLines;
            if (!connectiveLine) {
                this.emptySavedLinePositions();
            }
        }
    }
    public markerShapeData: string[] = ['Image', 'Circle', 'Diamond', 'Star', 'Triangle'];
  
  
  
  
  
  
  
  
  
  
  
}
