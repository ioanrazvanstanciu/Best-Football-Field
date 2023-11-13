import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from "@angular/core";
import { setDefaultOptions, loadModules } from 'esri-loader';
import esri = __esri;
import Point = __esri.Point;

import { Router } from '@angular/router';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AuthService } from "../../shared/services/auth.service";

@Component({
  selector: "app-esri-map",
  templateUrl: "./esri-map.component.html",
  styleUrls: ["./esri-map.component.scss"]
})
export class EsriMapComponent implements OnInit, OnDestroy {
  @Output() mapLoadedEvent = new EventEmitter<boolean>();

  // The <div> where we will place the map
  @ViewChild("mapViewNode", { static: true }) private mapViewEl?: ElementRef;

  // register Dojo AMD dependencies
  _Map: any;
  _MapView: any;
  _FeatureLayer: (new (arg0: { url: string; popupTemplate?: { title: string; content: string; }; }) => esri.FeatureLayer) | undefined;
  _Graphic: any;
  _GraphicsLayer: any;
  _Route: any;
  _RouteParameters: any;
  _FeatureSet: any;
  _Point: any;
  _locator: any;
  _SpatialReferences: any;


  // Instances
  map: esri.Map | undefined;
  view: esri.MapView | undefined;
  pointGraphic: esri.Graphic | undefined;
  graphicsLayer: esri.GraphicsLayer | undefined;
  routeGraphic: esri.GraphicsLayerProperties
    // Attributes
    | undefined


  // Attributes
  zoom = 12.5;
  center: Array<number> = [26.055260, 44.444589];
  basemap = "arcgis-topographic";
  loaded = false;
  pointCoords: number[] = [26.055260, 44.444589];
  //44.444589, 26.055260
  //26.055260, 44.444589
  dir: number = 0;
  count: number = 0;
  timeoutHandler = null;

  constructor(
    public authService: AuthService,
    public router: Router,
    public appRoutingModule: AppRoutingModule
  ) { }

  // @ts-ignore
  private options: any;
  async initializeMap() {
    try {
      // configure esri-loader to use version x from the ArcGIS CDN
      // setDefaultOptions({ version: '3.3.0', css: true });
      setDefaultOptions({ css: true });
      // Load the modules for the ArcGIS API for JavaScript
      const [esriConfig, Map, MapView, FeatureLayer, Graphic, Point, GraphicsLayer, route, RouteParameters, FeatureSet, Search, Locate, Track] = await loadModules([
        "esri/config",
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/FeatureLayer",
        "esri/Graphic",
        "esri/geometry/Point",
        "esri/layers/GraphicsLayer",
        "esri/rest/route",
        "esri/rest/support/RouteParameters",
        "esri/rest/support/FeatureSet",
        "esri/widgets/Search",
        "esri/widgets/Locate",
        "esri/widgets/Track"
      ]);

      esriConfig.apiKey = "AAPK19cc5ed287f34a649cf16f254420dedffsQjqs3kRR14R4hp7_x402Ak34cIuHmeUWVKwuywgYavggqCfHdwevE48_0sLHSp";

      this._Map = Map;
      this._MapView = MapView;
      this._FeatureLayer = FeatureLayer;
      this._Graphic = Graphic;
      this._GraphicsLayer = GraphicsLayer;
      this._Route = route;
      this._RouteParameters = RouteParameters;
      this._FeatureSet = FeatureSet;
      this._Point = new Point(this.pointCoords[0], this.pointCoords[1]);

      // Configure the Map
      const mapProperties = {
        basemap: "arcgis-navigation" //Basemap layer service
      };


      this.map = new Map(mapProperties);

      this.addFeatureLayers();
      this.addGraphicLayers();
      this.addPoint(this.pointCoords[1], this.pointCoords[0]);

      // Initialize the MapView
      // @ts-ignore
      const mapViewProperties = {
        container: this.mapViewEl.nativeElement,
        center: [26.055260, 44.444589],
        zoom: this.zoom,
        map: this.map
      };

      this.view = new MapView(mapViewProperties);
      const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";
      const search = new Search({  //Add Search widget
        view: this.view
      });
      this.view.ui.add(search, "top-right"); //Add to the map

      const locate = new Locate({
        view: this.view,
        useHeadingEnabled: false,
        goToOverride: function(view, options) {
          options.target.scale = 1500;
          return view.goTo(options.target);
        }
      });
      this.view.ui.add(locate, "top-left");


      const track = new Track({
        view: this.view,
        graphic: new Graphic({
          symbol: {
            type: "simple-marker",
            size: "12px",
            color: "green",
            outline: {
              color: "#efefef",
              width: "1.5px"
            }
          }
        }),
        useHeadingEnabled: false
      });
      this.view.ui.add(track, "top-left");

      // Fires `pointer-move` event when user clicks on "Shift"
      // key and moves the pointer on the view.
      // // @ts-ignore
      // this.view.on('pointer-move', ["Shift"], (event) => {
      //   // @ts-ignore
      //   let point = this.view.toMap({ x: event.x, y: event.y });
      //   console.log("map moved: ", point.longitude, point.latitude);
      // });


      await this.view.when(); // wait for map to load
      console.log("ArcGIS map loaded");
      this.addRouter();
      console.log("Map center: " + this.view.center.latitude + ", " + this.view.center.longitude);

      return this.view;
    } catch (error) {
      console.log("EsriLoader: ", error);
    }
  }

  addGraphicLayers() {
    this.graphicsLayer = new this._GraphicsLayer();
    this.map.add(this.graphicsLayer);
  }



  addFeatureLayers() {
    // Trailheads feature layer (points)
    // @ts-ignore
    var trailheadsLayer: __esri.FeatureLayer = new this._FeatureLayer({

      url:
        "https://services7.arcgis.com/q3jnX0CLBpfNBGZ6/arcgis/rest/services/terenurifotbalregie/FeatureServer/0"
    });

    this.map.add(trailheadsLayer);
    
    const popupTrailheads = {
      "title": "Trailhead",
      "content": "<b>Name:</b> {Name}<br><b>Fulladdress:</b> {Fulladdress}<br><b>Street:</b> {Street}<br><b>Featured image: </b> {Featured_image} <br><b>Municipality:</b> {Municipality}<br><b>Categories:</b> {Categories}<br><b>Phones:</b> {Phones}<br><b>Claimed:</b> {Claimed}<br><b>Opening hours: </b> {Opening_hours}<br><b>Review Count:</b> {Review_Count}<br><b>Average Rating:</b> {Average_Rating}<br><b>Review URL</b> {Review_URL}<br><b>Google Maps URL: </b> {Google_Maps_URL}<br><b>Website: </b> {Website}<br><b>Latitude:</b> {Latitude}<br><b>Longitude: </b> {Longitude} ft"
    }
    popupTrailheads.content = popupTrailheads.content.replace(
      "{Featured_image}",
      "<img src='{Featured_image}' style='max-width:200px;max-height:200px;'/>"
    );

    popupTrailheads.content = popupTrailheads.content.replace(
      "{Review_URL}",
      "<a href='{Review_URL}' target='_blank'>Review</a>"
    );
    
    popupTrailheads.content = popupTrailheads.content.replace(
      "{Google_Maps_URL}",
      "<a href='{Google_Maps_URL}' target='_blank'>Google Maps Link</a>"
    );
    
    popupTrailheads.content = popupTrailheads.content.replace(
      "{Website}",
      "<a href='{Website}' target='_blank'>Website</a>"
    );

    // Trails feature layer (lines)
    var trailsLayer: __esri.FeatureLayer = new this._FeatureLayer({
      url:
        "https://services7.arcgis.com/q3jnX0CLBpfNBGZ6/arcgis/rest/services/terenurifotbalregie/FeatureServer/0",
      popupTemplate: popupTrailheads

    });

    this.map.add(trailsLayer, 0);

    // Parks and open spaces (polygons)



    var parksLayer: __esri.FeatureLayer = new this._FeatureLayer({
      url:
        "https://services7.arcgis.com/q3jnX0CLBpfNBGZ6/arcgis/rest/services/terenurifotbalregie/FeatureServer/0"
    });

    this.map.add(parksLayer, 0);

    console.log("feature layers added");
  }

  addPoint(lat: number, lng: number) {
    // @ts-ignore
    this.graphicsLayer = new this._GraphicsLayer();
    // @ts-ignore
    this.map.add(this.graphicsLayer);
    const point = { //Create a point
      type: "point",
      longitude: lng,
      latitude: lat
    };
    const simpleMarkerSymbol = {
      type: "simple-marker",
      color: [226, 119, 40],  // Orange
      outline: {
        color: [255, 255, 255], // White
        width: 1
      }
    };
    // @ts-ignore
    this.pointGraphic = new this._Graphic({
      geometry: point,
      symbol: simpleMarkerSymbol
    });
    // @ts-ignore
    this.graphicsLayer.add(this.pointGraphic);
  }

  removePoint() {
    if (this.pointGraphic != null) {
      // @ts-ignore
      this.graphicsLayer.remove(this.pointGraphic);
    }
  }

  addRouter() {
    const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";
    // @ts-ignore
    this.view.on("click", (event) => {
      console.log("point clicked: ", event.mapPoint.latitude, event.mapPoint.longitude);
      // @ts-ignore
      if (this.view.graphics.length === 0) {
        addGraphic("origin", event.mapPoint);
      } else { // @ts-ignore
        if (this.view.graphics.length === 1) {
          addGraphic("destination", event.mapPoint);
          getRoute(); // Call the route service
        } else {
          // @ts-ignore
          this.view.graphics.removeAll();
          addGraphic("origin", event.mapPoint);
        }
      }
    });

    var addGraphic = (type: any, point: any) => {
      const graphic = new this._Graphic({
        symbol: {
          type: "simple-marker",
          color: (type === "origin") ? "white" : "black",
          size: "8px"
        } as any,
        geometry: point
      });
      this.view.graphics.add(graphic);
    }


    var getRoute = () => {
      // @ts-ignore
      const routeParams = new this._RouteParameters({
        stops: new this._FeatureSet({
          features: this.view.graphics.toArray()
        }),
        returnDirections: true,
        directionsLanguage: "ro"
      });

      this._Route.solve(routeUrl, routeParams).then((data: any) => {
        for (let result of data.routeResults) {
          result.route.symbol = {
            type: "simple-line",
            color: [5, 150, 255],
            width: 3
          };
          // @ts-ignore
          this.view.graphics.add(result.route);
        }

        // Display directions
        if (data.routeResults.length > 0) {
          const directions: any = document.createElement("ol");
          directions.classList = "esri-widget esri-widget--panel esri-directions__scroller";
          directions.style.marginTop = "0";
          directions.style.padding = "15px 15px 15px 30px";
          const features = data.routeResults[0].directions.features;

          let sum = 0;
          // Show each direction
          features.forEach((result: any, i: any) => {
            sum += parseFloat(result.attributes.length);
            const direction = document.createElement("li");
            let sumKm = result.attributes.length * 1.609344;
            let sumM = sumKm * 1000;
            sumM = Math.round(sumM);
            direction.innerHTML = result.attributes.text + " (" + sumM + ") m";
            directions.appendChild(direction);
          });

          sum = sum * 1.609344;
          console.log('dist (km) = ', sum);

          // @ts-ignore
          this.view.ui.empty("top-right");
          // @ts-ignore
          this.view.ui.add(directions, "top-right");

        }

      }).catch((error: any) => {
        console.log(error);
      });
    }
  }

  runTimer() {
    // @ts-ignore
    this.timeoutHandler = setTimeout(() => {
      // code to execute continuously until the view is closed
      // ...
      //this.animatePointDemo();
      this.runTimer();
    }, 200);
  }

  animatePointDemo() {
    this.removePoint();
    switch (this.dir) {
      case 0:
        this.pointCoords[1] += 0.01;
        break;
      case 1:
        this.pointCoords[0] += 0.02;
        break;
      case 2:
        this.pointCoords[1] -= 0.01;
        break;
      case 3:
        this.pointCoords[0] -= 0.02;
        break;
    }

    this.count += 1;
    if (this.count >= 10) {
      this.count = 0;
      this.dir += 1;
      if (this.dir > 3) {
        this.dir = 0;
      }
    }

    this.addPoint(this.pointCoords[1], this.pointCoords[0]);
  }

  stopTimer() {
    if (this.timeoutHandler != null) {
      clearTimeout(this.timeoutHandler);
      this.timeoutHandler = null;
    }

  }

  ngOnInit() {
    // Initialize MapView and return an instance of MapView
    this.initializeMap().then(() => {
      // The map has been initialized
      // @ts-ignore
      console.log("mapView ready: ", this.view.ready);
      // @ts-ignore
      this.loaded = this.view.ready;
      this.mapLoadedEvent.emit(true);
      this.runTimer();
    });
  }

  ngOnDestroy() {
    if (this.view) {
      // destroy the map view
      this.view.container = null;
    }
    this.stopTimer();
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

}
