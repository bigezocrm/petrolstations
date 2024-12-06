import { Component, AfterViewInit, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../superbase.service';


declare var google: any; // Declare Google Maps for TypeScript

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements AfterViewInit, AfterViewChecked {
  showMap = true; // Track map visibility
  title: string = 'Petrol Stations in Uganda';
  map: any; // Declare the map variable
  mapInitialized = false; // Track if the map has been initialized
  markers: any;
  overlay: any;
  northPolygonData: any  = null;
entireMapPolygonData: any  = null;
ugandaPolygonData:any=null;
eastPolygonData:any=null;
westPolygonData:any=null;
centralPolygonData:any=null;


  northPolygon =   {
    "type": "Feature",
    "properties": {
      "name": "NORTH",
      "description": "North region",
      "styleUrl": "#poly-E65100-3401-217",
      "fill-opacity": 0.6,
      "fill": "#e65100",
      "stroke-opacity": 1,
      "stroke": "#ffffff",
      "stroke-width": 2
    },
    "geometry": {
      "coordinates": [
        [
          [31.2815037, 2.182163, 0],
          [31.4023533, 2.4126903, 0],
          [31.6110935, 2.5553783, 0],
          [31.8088474, 2.577329, 0],
          [32.2922458, 2.2150977, 0],
          [32.5778904, 2.2919426, 0],
          [32.8305759, 2.2699873, 0],
          [32.9953708, 1.9955196, 0],
          [33.5007419, 1.8088551, 0],
          [34.137949, 2.0174788, 0],
          [34.4895115, 2.4126903, 0],
          [34.874033, 2.6102542, 0],
          [34.6652927, 2.8845964, 0],
          [34.4126072, 3.3892086, 0],
          [34.4895115, 3.6304543, 0],
          [34.3137302, 3.6962376, 0],
          [33.9621677, 4.1894507, 0],
          [33.5337009, 3.7729786, 0],
          [33.2810154, 3.762016, 0],
          [33.0832615, 3.9374005, 0],
          [32.8964939, 3.8058655, 0],
          [32.4790134, 3.762016, 0],
          [32.2153415, 3.5427358, 0],
          [31.995615, 3.5427358, 0],
          [31.8418064, 3.8168275, 0],
          [31.5341892, 3.6523826, 0],
          [31.2815037, 3.783941, 0],
          [30.8859958, 3.6304543, 0],
          [30.9299412, 3.4221094, 0],
          [30.7651462, 3.0601411, 0],
          [30.8859958, 2.8626514, 0],
          [30.7431736, 2.4785482, 0],
          [31.2815037, 2.182163, 0]
        ]
      ],
      "type": "Polygon"
    }
  };

  entiremapPolygon= {
    "type": "Feature",
    "properties": {
      "stroke": "#555555",
      "stroke-width": 0,
      "stroke-opacity": 0,
      "fill": "#000000",
      "fill-opacity": 0.6
    },
    "geometry": {
      "coordinates": [
        [
          [-8.082438444104156, 49.02965503015514],
          [-34.10130792669378, 16.580900015937132],
          [-40.88417914266006, -50.32121032982951],
          [81.74863939828613, -65.64716462009923],
          [103.1874780781283, -36.04828534768893],
          [86.60966418612, 35.829399043344395],
          [-8.082438444104156, 49.02965503015514]
        ]
      ],
      "type": "Polygon"
    },
    "id": 1
  };

  ugandaMapPolygon= {
    "type": "Feature",
    "properties": {
      "stroke": "#ffffff",
      "stroke-width": 2,
      "stroke-opacity": 1,
      "fill": "#33cc33",
      "fill-opacity": 0.7
    },
    "geometry": {
      "coordinates": [
        [
          [30.733968396403156, -0.9987046322610098],
          [33.94409756835438, -0.99377174522931],
          [33.92698192289549, -0.46418390366360995],
          [33.986814388751554, -0.13959652669909417],
          [33.91846511365466, 0.09958864184245897],
          [34.072205450596215, 0.3302276319047053],
          [34.12346046634369, 0.5437755209200077],
          [34.251530519762724, 0.6548101779279278],
          [34.4812742446681, 0.9023235887892724],
          [34.550704476828884, 1.0775992130084546],
          [34.703871446886154, 1.1824067449789197],
          [34.85953559197449, 1.465790648034897],
          [35.033319796852254, 1.8547847044679031],
          [34.937614333183745, 2.5414895632306553],
          [34.670278471763254, 2.972769951112383],
          [34.507115520952, 3.210914755544877],
          [34.452194734046174, 3.481731409095758],
          [34.41299067794091, 3.753719588770153],
          [34.17131625962938, 3.8703551317858995],
          [34.07537019123552, 4.29497995240088],
          [33.501117148872254, 3.7525109424339718],
          [33.20156849386791, 3.779479557972053],
          [32.99283116013382, 3.878929577751677],
          [32.80250069610895, 3.788697977844805],
          [32.41246504761659, 3.7436193764661],
          [32.24916471766224, 3.644066225527027],
          [32.203808620667246, 3.5263683797518866],
          [31.98605357495586, 3.5988528923882512],
          [31.81362557757069, 3.825101271655285],
          [31.532357941630664, 3.6440638645056964],
          [31.2329327443164, 3.7979039959189578],
          [31.03332827612016, 3.734457039149163],
          [30.842816559427916, 3.5351378992598512],
          [30.94261520921188, 3.5170156843908984],
          [30.797453230535552, 3.0732165169747674],
          [30.88818074975231, 2.846694839829425],
          [30.724928370860653, 2.4478138521402997],
          [30.9063665045677, 2.366214845502114],
          [31.060559329279897, 2.302885329929083],
          [31.30552320909777, 2.1398573400621785],
          [31.05145575678722, 1.7589810089014293],
          [30.48891697496083, 1.2328795461190225],
          [30.28932249325061, 1.187524014226625],
          [30.162358786971737, 0.9244649635365647],
          [29.99909482001425, 0.8428350091894288],
          [29.96287439413689, 0.561650967046802],
          [29.726881528923315, -0.06440583906929476],
          [29.59133085567555, -1.3698722868038686],
          [29.854241724680662, -1.3700774153996917],
          [29.91773648476763, -1.46981548444451],
          [30.14436290109748, -1.3250439688654296],
          [30.325736082883623, -1.1438028994494118],
          [30.343876442778765, -1.0531091450474293],
          [30.61602379565045, -1.0712978353660247],
          [30.733968396403156, -0.9987046322610098]
        ]
      ],
      "type": "Polygon"
    },
    "id": 1
  };

eastPolygon= {
  "type": "Feature",
  "properties": {
    "name": "EAST",
      "description": "East region",
      "styleUrl": "#poly-E65100-3401-217",
    "stroke": "#ffffff",
    "stroke-width": 2,
    "stroke-opacity": 1,
    "fill": "#ff3300",
    "fill-opacity": 0.6
  },
  "geometry": {
    "coordinates": [
      [
        [34.966787426251614, 2.321779707072494],
        [34.87309339850509, 2.25579985575402],
        [34.79682027522637, 2.085104261428512],
        [34.61534558461173, 2.4166382715287824],
        [34.56304386172923, 2.416701210299152],
        [34.46552314818331, 2.043442000072673],
        [34.224643754658615, 1.8654575244622578],
        [34.19644734007048, 2.134125133535292],
        [33.88921137775782, 2.287909549940565],
        [33.745979860383756, 2.4275797225441096],
        [33.54682847028596, 2.3158808241810647],
        [33.49441873928828, 2.2251010284629587],
        [33.42803418162177, 2.235582287696843],
        [33.469960463334814, 2.165706761643122],
        [33.431531936208444, 2.1202741503796574],
        [33.31973727608349, 2.046983088713773],
        [33.228890803578764, 1.8968720166638064],
        [33.1310342176136, 1.8445230764958893],
        [33.04368609345738, 1.6908540930150053],
        [32.94585584169312, 1.8270563365744863],
        [32.799103852354676, 1.8200727908956793],
        [32.56848013956758, 1.6279886899531846],
        [32.41484063306217, 1.6838566163835367],
        [32.31692867759847, 1.6349718886377502],
        [32.43220793976957, 1.5755974902729832],
        [32.56149470872472, 1.523204874686428],
        [32.61740838473372, 1.4463612049553092],
        [32.6837830960032, 1.4254015668072242],
        [32.875971748696145, 1.4638261775972552],
        [33.005242704769785, 1.4673177151977939],
        [33.158984517575504, 1.3555394296724899],
        [33.24633782030523, 1.3275940353692022],
        [33.35815004780031, 1.3590325814191146],
        [33.4210444257663, 1.2856753537143248],
        [33.33921831643232, 1.084306822884642],
        [33.302467334093365, 0.9511499414147551],
        [33.26229085635413, 0.7860014902958454],
        [33.190842792923945, 0.705610296504986],
        [33.08815085225248, 0.6520482082704007],
        [33.05243917748615, 0.5984922758579785],
        [33.079244550159075, 0.5315654600398005],
        [33.02566138507416, 0.5315505608592161],
        [32.97653575521477, 0.5538467122462123],
        [32.94977891002287, 0.45569496844821344],
        [32.96319482507823, 0.40663796877801417],
        [32.869436791926404, 0.3551088333989014],
        [32.90080079019347, 0.2767509376001698],
        [32.864198996385966, 0.1460576601485002],
        [32.85686924863552, -0.1351214430437011],
        [32.86684988657515, -1.0087782773796476],
        [33.94967623216132, -1.0033053625065236],
        [33.94028654706159, -0.45619908309873836],
        [33.98198859034571, -0.14445202277499902],
        [33.95595968548281, -0.005153059856240816],
        [33.92425067115758, 0.09195630841625757],
        [33.96166813177814, 0.1578346238724322],
        [34.0717553823865, 0.31075998327135324],
        [34.132915498510016, 0.5370572424760667],
        [34.49264871177485, 0.9237725691046847],
        [34.55347629210263, 1.0706126414160764],
        [34.71297817271892, 1.173829539847489],
        [35.02574109106479, 1.8700710612146452],
        [34.966787426251614, 2.321779707072494]
      ]
    ],
    "type": "Polygon"
  },
  "id": 3
};

westPolygon= {
  "type": "Feature",
  "properties": {
    "stroke": "#ffffff",
    "stroke-width": 2,
    "stroke-opacity": 1,
    "fill": "#a700b3",
    "fill-opacity": 0.5
  },
  "geometry": {
    "coordinates": [
      [
        [32.10855491697012, 1.6540906973986864],
        [32.068611589740925, 1.656540011633723],
        [32.339278192477195, 1.8881848020103718],
        [32.35111051778658, 2.060623035657862],
        [32.2643739167894, 2.2461844571798757],
        [32.18334284403302, 2.2103390662158926],
        [31.892287977811655, 2.352148457803941],
        [31.796605386747157, 2.354310140052536],
        [31.743652915607655, 2.295277416127613],
        [31.621894569999398, 2.2501161201051048],
        [31.55527849216631, 2.295689977818256],
        [31.30373471321542, 2.137068660943811],
        [31.029856377603465, 1.7212311120122479],
        [30.509647191137788, 1.2369939946471078],
        [30.276503255658128, 1.1921389560683195],
        [30.160022069046136, 0.9230898789764836],
        [29.98069624412622, 0.8423763344614201],
        [29.980840681636863, 0.5464414657137837],
        [29.729520499568395, -0.08139124748082338],
        [29.586958352279026, -1.3810120646480755],
        [29.85570897626272, -1.3632792303137222],
        [29.909502580824807, -1.4887788259519397],
        [30.15133917907795, -1.3366485635984304],
        [30.339546560366756, -1.148482423480047],
        [30.339545618515075, -1.0408834557352264],
        [30.62649374398285, -1.0857584144996792],
        [30.74313208451528, -0.9898216205001944],
        [32.89061988891601, -1.0232491139107651],
        [32.86018785695694, -0.166892518336482],
        [31.985732430296167, -0.12350513739512792],
        [31.819545732751095, 0.03553397032011674],
        [31.602750656768904, 0.07167251908816752],
        [31.407655567838617, 0.19454679727169832],
        [31.29927488533974, 0.19456121870737775],
        [31.335401505165436, 0.2740466183638546],
        [31.55942226614789, 0.3463109201256884],
        [31.732843895840404, 0.22344772820771652],
        [31.935177864544556, 0.4040970469386451],
        [31.89905897174819, 0.49082928278927795],
        [31.91353537836696, 0.6281486188995444],
        [32.0291592506195, 0.6426038806144589],
        [32.173662971433686, 0.6714788233092577],
        [32.2242237734562, 0.7726109222059989],
        [32.13748507536627, 0.8954394462076181],
        [32.0290865423994, 0.9460269101054024],
        [31.920655859786535, 1.0760801400026878],
        [31.81946284947162, 1.3506499163091092],
        [31.963997032324812, 1.4590264875758976],
        [31.99290868449512, 1.531275497276468],
        [32.07964124076037, 1.5601738183183187],
        [32.10855491697012, 1.6540906973986864]
      ]
    ],
    "type": "Polygon"
  }
};

centralPolygon= {
  "type": "Feature",
  "properties": {
    "stroke": "#ffffff",
    "stroke-width": 2,
    "stroke-opacity": 1,
    "fill": "#fbff1a",
    "fill-opacity": 0.5
  },
  "geometry": {
    "coordinates": [
      [
        [32.85653926494075, -0.17164261606885134],
        [32.860616879377346, 0.14209908579509545],
        [32.90135698538873, 0.2724883571537333],
        [32.86469232512863, 0.35802452036031696],
        [32.96653578680559, 0.41099477438955034],
        [32.95024246721411, 0.45985864443454716],
        [32.97468914973794, 0.5494631024929362],
        [33.02357628132657, 0.5291011725810364],
        [33.08875774644412, 0.5291066841322731],
        [33.052098599888126, 0.5983501442249661],
        [33.08877016206239, 0.6513075687060876],
        [33.19470511637769, 0.6961199840554997],
        [33.2680318370476, 0.7857483614416338],
        [33.345490414847035, 1.0913054378280833],
        [33.42292248504913, 1.2950079359950166],
        [33.35772598371943, 1.3642605625468889],
        [33.24363210639251, 1.3275976492049892],
        [33.15806169839826, 1.3601869328248029],
        [33.01136957040649, 1.4579521007705978],
        [32.87282794654965, 1.4660872241529859],
        [32.685387238633524, 1.4253637163883894],
        [32.612045836230976, 1.449795190439744],
        [32.56314575929753, 1.5231222975107812],
        [32.318670375286246, 1.6330852505059426],
        [32.196413303788376, 1.6738347339206854],
        [32.110857401848364, 1.653454277375232],
        [32.07417425450052, 1.559782396654768],
        [31.992674343322932, 1.5394197591400598],
        [31.960088063302436, 1.4579439095196278],
        [31.813430642403347, 1.3479430795561598],
        [31.907211106890117, 1.079061912213433],
        [32.029415657968116, 0.9487073146561471],
        [32.13126405244034, 0.9038956975310555],
        [32.22502526984178, 0.773526405690987],
        [32.15987704826577, 0.6716847078064916],
        [31.91973848597945, 0.626913325874142],
        [31.89933468944494, 0.48434900855025376],
        [31.935931503179944, 0.4028607130636317],
        [31.73642073345016, 0.2236730555427897],
        [31.55720668333379, 0.34994351050373496],
        [31.341330142231385, 0.2725548923100831],
        [31.300531183822983, 0.19106660145993715],
        [31.40238292058234, 0.19922035520649217],
        [31.605989949455306, 0.07291605369115928],
        [31.817742634023517, 0.036207275368866476],
        [31.98877844711629, -0.1227287870010656],
        [32.85653926494075, -0.17164261606885134]
      ]
    ],
    "type": "Polygon"
  },
  "id": 4
};

  constructor(private router: Router, private supabaseService: SupabaseService) {}

  // Logout function
  logout() {
    this.supabaseService
      .logout()
      .then(() => {
        this.router.navigate(['/login']); // Redirect after logout
      })
      .catch((error) => {
        console.error('Logout failed:', error);
      });
  }

  ngAfterViewInit() {
    // Initialize map only once when the view is ready
  }

  ngAfterViewChecked() {
    if (this.showMap && !this.mapInitialized) {
      this.initMap();
    }
  }

  // Method to initialize the map
  initMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) {
      console.error('ERROR ------------- Map element not found');
      return;
    }

    // Reuse the map instance if already initialized
    if (!this.map) {
      this.map = new google.maps.Map(mapElement, {
        center: { lat: 1.2740605, lng: 32.7256175 },
        zoom: 7,
        mapTypeId: 'roadmap',
        minZoom: 5,
      });
    } else {
      this.map.setCenter({ lat: 0.3740605, lng: 32.7256175 }); // Reset center
      this.map.setZoom(7); // Reset zoom
    }

    // Initialize map with Shell stations
    //this.loadStationsGeoJSON('/uganda.geojson', 'north', 'shell');
    this.clearMap();
    this.mapInitialized = true;
  }

  // Function to load stations and the polygon based on location and station type
  loadStationsGeoJSON(url: string, location: string, station: string) {
    const map = this.map;
  this.clearMap();
    // Log the inputs to this method
    console.log(`loadStationsGeoJSON called with: url=${url}, location=${location}, station=${station}`);
  
    // Dynamically handle different locations
    if (location === 'North') {
      this.clearMap();
      console.log(`Loading North region polygon for location: ${location}`);
      this.loadEntireMapPolygon();
      this.loadNorthPolygon();
    } 
    else  if (location === 'East') {
      this.clearMap();
      console.log(`Loading East region polygon for location: ${location}`);
      this.loadEntireMapPolygon();
      this.loadEastPolygon();
    }
    else  if (location === 'West') {
      this.clearMap();
      console.log(`Loading West region polygon for location: ${location}`);
      this.loadEntireMapPolygon();
      this.loadWestPolygon();
    }

    else  if (location === 'Central') {
      this.clearMap();
      console.log(`Loading Central region polygon for location: ${location}`);
      this.loadEntireMapPolygon();
      this.loadCentralPolygon();
    }
    else if (location === 'all') {
      this.clearMap();
      console.log(`Loading entire map polygon for location: ${location}`);
      this.loadEntireMapPolygon();
      this.loadUgandaMapPolygon();
    } else {
      console.warn(`No polygon defined for location: ${location}`);
    }
  
    // Load GeoJSON data
    console.log(`Attempting to load GeoJSON from URL: ${url}`);
    fetch(url)
      .then((response) => response.json())
      .then((geojsonData) => {
        if (!geojsonData || !geojsonData.features) {
          console.error('Invalid GeoJSON data.');
          return;
        }
  
        console.log(`GeoJSON data loaded successfully: ${geojsonData.features.length} features found.`);
  
        // Filter features based on location and station
        const filteredFeatures = geojsonData.features.filter((feature: any) => {
          const properties = feature.properties;
          if (!properties) return false;
  
          // If station is 'all', only filter by location
          if (station === 'all') {
            return properties.location === location;
          }
  
          // Filter by both location and station
          return properties.location === location && properties.station === station;
        });
  
        console.log(`Filtered features count: ${filteredFeatures.length}`);
  
        if (filteredFeatures.length === 0) {
          console.warn('No features matched the filter criteria.');
          return;
        }
  
        // Add filtered features to the map
        filteredFeatures.forEach((feature: any) => {
          map.data.addGeoJson({ type: 'FeatureCollection', features: [feature] });
        });
  
        // Set the style for markers
        map.data.setStyle({
          icon: {
            url: 'shell.png', // Update this path if needed
            scaledSize: new google.maps.Size(16, 16),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 16),
          },
        });
  
        console.log('Filtered features added to map and styled.');
  
        // Add click listener to display popup with details
        map.data.addListener('click', (event: any) => {
          console.log('Map data click event detected:', event);
          const feature = event.feature;
          if (!feature) {
            console.error('No feature found on click event.');
            return;
          }
  
          const properties = feature.getProperties();
          if (!properties) {
            console.error('No properties found for this feature.');
            return;
          }
  
          console.log('Feature properties:', properties);
  
          const contentString = `
            <div>
              <h3>${properties.Code || 'N/A'}</h3>
              <p><strong>Location:</strong> ${properties.location || 'N/A'}</p>
              <p><strong>Volume:</strong> ${properties.Vol || 'N/A'}</p>
              <p><strong>Description:</strong> ${properties.description?.value || 'N/A'}</p>
            </div>
          `;
  
          const infoWindow = new google.maps.InfoWindow({
            content: contentString,
            position: event.latLng,
          });
  
          infoWindow.open(map);
          console.log('InfoWindow opened with details for:', properties.Code);
        });
      })
      .catch((error) => {
        console.error('Error fetching or processing GeoJSON data:', error);
      });
  }
  
  
  

loadNorthPolygon() {
  const map = this.map;
  const northPolygon = this.northPolygon;

  // Create a new Data instance and store it
  const polygonData = new google.maps.Data();
  polygonData.addGeoJson(northPolygon);
  polygonData.setStyle({
    fillColor: northPolygon.properties.fill,
    fillOpacity: northPolygon.properties['fill-opacity'],
    strokeColor: northPolygon.properties.stroke,
    strokeWeight: northPolygon.properties['stroke-width'],
    strokeOpacity: northPolygon.properties['stroke-opacity']
  });
  polygonData.setMap(map); // Add the polygon to the map

  // Save reference for clearing later
  this.northPolygonData = polygonData;
}

loadEastPolygon() {
  const map = this.map;
  const eastPolygon = this.eastPolygon;

  // Create a new Data instance and store it
  const polygonData = new google.maps.Data();
  polygonData.addGeoJson(eastPolygon);
  polygonData.setStyle({
    fillColor: eastPolygon.properties.fill,
    fillOpacity: eastPolygon.properties['fill-opacity'],
    strokeColor: eastPolygon.properties.stroke,
    strokeWeight: eastPolygon.properties['stroke-width'],
    strokeOpacity: eastPolygon.properties['stroke-opacity']
  });
  polygonData.setMap(map); // Add the polygon to the map

  // Save reference for clearing later
  this.eastPolygonData = polygonData;
}

loadWestPolygon() {
  const map = this.map;
  const westPolygon = this.westPolygon;

  // Create a new Data instance and store it
  const polygonData = new google.maps.Data();
  polygonData.addGeoJson(westPolygon);
  polygonData.setStyle({
    fillColor: westPolygon.properties.fill,
    fillOpacity: westPolygon.properties['fill-opacity'],
    strokeColor: westPolygon.properties.stroke,
    strokeWeight: westPolygon.properties['stroke-width'],
    strokeOpacity: westPolygon.properties['stroke-opacity']
  });
  polygonData.setMap(map); // Add the polygon to the map

  // Save reference for clearing later
  this.westPolygonData = polygonData;
}


loadCentralPolygon() {
  const map = this.map;
  const centralPolygon = this.centralPolygon;

  // Create a new Data instance and store it
  const polygonData = new google.maps.Data();
  polygonData.addGeoJson(centralPolygon);
  polygonData.setStyle({
    fillColor: centralPolygon.properties.fill,
    fillOpacity: centralPolygon.properties['fill-opacity'],
    strokeColor: centralPolygon.properties.stroke,
    strokeWeight: centralPolygon.properties['stroke-width'],
    strokeOpacity: centralPolygon.properties['stroke-opacity']
  });
  polygonData.setMap(map); // Add the polygon to the map

  // Save reference for clearing later
  this.centralPolygonData = polygonData;
}
loadEntireMapPolygon() {
  const map = this.map;
  const entiremapPolygon = this.entiremapPolygon;

  // Create a new Data instance and store it
  const polygonData = new google.maps.Data();
  polygonData.addGeoJson(entiremapPolygon);
  polygonData.setStyle({
    fillColor: entiremapPolygon.properties.fill,
    fillOpacity: entiremapPolygon.properties['fill-opacity'],
    strokeColor: entiremapPolygon.properties.stroke,
    strokeWeight: entiremapPolygon.properties['stroke-width'],
    strokeOpacity: entiremapPolygon.properties['stroke-opacity']
  });
  polygonData.setMap(map); // Add the polygon to the map

  // Save reference for clearing later
  this.entireMapPolygonData = polygonData;
}

loadUgandaMapPolygon() {
  const map = this.map;
  const ugandaMapPolygon = this.ugandaMapPolygon;

  // Create a new Data instance and store it
  const polygonData = new google.maps.Data();
  polygonData.addGeoJson(ugandaMapPolygon);
  polygonData.setStyle({
    fillColor: ugandaMapPolygon.properties.fill,
    fillOpacity: ugandaMapPolygon.properties['fill-opacity'],
    strokeColor: ugandaMapPolygon.properties.stroke,
    strokeWeight: ugandaMapPolygon.properties['stroke-width'],
    strokeOpacity: ugandaMapPolygon.properties['stroke-opacity']
  });
  polygonData.setMap(map); // Add the polygon to the map

  // Save reference for clearing later
  this.ugandaPolygonData = polygonData;
}
  // Method to handle station selection (region and station type)
  loadStation(region: string, station: string) {
    alert(`Loading ---------->  ${station} stations in ${region} region...`);

    if (!this.mapInitialized) {
      this.initMap(); // Initialize the North Shell map
    }

    // Update map based on region and station type
    this.loadStationsGeoJSON('/uganda.geojson', region, station);
    this.showMap = true;
  }

  clearMap() {
    const map = this.map;
  
    // Clear all GeoJSON data from map.data
    if (map.data) {
      map.data.forEach((feature: any) => {
        map.data.remove(feature); // Remove all features
      });
    }
  
    // Clear North region polygon
    if (this.northPolygonData) {
      this.northPolygonData.setMap(null); // Remove the polygon
      this.northPolygonData = null; // Clear reference
    }
  
    // Clear entire map polygon
    if (this.entireMapPolygonData) {
      this.entireMapPolygonData.setMap(null); // Remove the polygon
      this.entireMapPolygonData = null; // Clear reference
    }

    if (this.ugandaPolygonData) {
      this.ugandaPolygonData.setMap(null); // Remove the polygon
      this.ugandaPolygonData = null; // Clear reference
    }

    if (this.eastPolygonData) {
      this.eastPolygonData.setMap(null); // Remove the polygon
      this.eastPolygonData = null; // Clear reference
    }
  
    if (this.westPolygonData) {
      this.westPolygonData.setMap(null); // Remove the polygon
      this.westPolygonData = null; // Clear reference
    }

    
    if (this.centralPolygonData) {
      this.centralPolygonData.setMap(null); // Remove the polygon
      this.centralPolygonData = null; // Clear reference
    }
  
    // Remove any custom markers
    if (this.markers) {
      for (let i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null); // Remove each marker from the map
      }
      this.markers = []; // Reset markers array after clearing
    }
  
    // Clear any additional overlays (InfoWindows, custom overlays)
    if (this.overlay) {
      this.overlay.setMap(null); // Remove the overlay from the map
      this.overlay = null; // Reset the overlay
    }
  
    console.log('Map cleared.');
  }
  
}
