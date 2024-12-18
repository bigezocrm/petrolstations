import { Component, AfterViewInit, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../superbase.service';
import Swal from 'sweetalert2';




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
            [31.2815037, 2.182163],
            [31.4023533, 2.4126903],
            [31.560913801921902, 2.346494296353355],
            [31.716820281410474, 2.393534377116987],
            [31.648202811230462, 1.9978470924136915],
            [31.786934201110448, 1.7270269096305455],
            [32.04024151473186, 1.3240787788764665],
            [32.184923565879245, 0.779057115804251],
            [32.32053783101826, 0.5731385615423537],
            [32.69139980651275, 0.5737534140549813],
            [32.76124304118453, 0.7081599807799306],
            [32.846689406888956, 0.7317943731643568],
            [32.91029491023176, 0.97903941130908],
            [33.103194667393865, 1.1087700634715563],
            [33.337234201590235, 1.0798713087255654],
            [33.60705225210717, 1.0771744708557334],
            [33.61827993653488, 1.3682480838708788],
            [33.85691441932717, 1.354314390787433],
            [34.08379539804413, 1.4931349243727636],
            [34.38684136225531, 1.5263091085042948],
            [34.58434686572293, 1.7942979260401808],
            [34.72479774191911, 2.0682297736926643],
            [34.95916257037522, 2.1542511768504427],
            [34.934380492150325, 2.4703452320306623],
            [34.874033, 2.6102542],
            [34.6652927, 2.8845964],
            [34.4126072, 3.3892086],
            [34.4895115, 3.6304543],
            [34.3137302, 3.6962376],
            [33.9621677, 4.1894507],
            [33.5337009, 3.7729786],
            [33.2810154, 3.762016],
            [33.0832615, 3.9374005],
            [32.8964939, 3.8058655],
            [32.4790134, 3.762016],
            [32.2153415, 3.5427358],
            [31.995615, 3.5427358],
            [31.8418064, 3.8168275],
            [31.5341892, 3.6523826],
            [31.2815037, 3.783941],
            [30.8859958, 3.6304543],
            [30.9299412, 3.4221094],
            [30.7651462, 3.0601411],
            [30.8859958, 2.8626514],
            [30.7431736, 2.4785482],
            [31.2815037, 2.182163]
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
      "fill": "#ffffff",
      "fill-opacity": 0.5
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
            [
              34.966787426251614,
              2.321779707072494
            ],
            [
              34.92314671041444,
              2.529482454430493
            ],
            [
              34.76658549764963,
              2.7864403802186644
            ],
            [
              34.521738696714664,
              2.6539069738418988
            ],
            [
              34.44390417947827,
              2.4161221573743603
            ],
            [
              34.46552314818331,
              2.043442000072673
            ],
            [
              34.224643754658615,
              1.8654575244622578
            ],
            [
              34.19644734007048,
              2.134125133535292
            ],
            [
              33.88921137775782,
              2.287909549940565
            ],
            [
              33.745979860383756,
              2.4275797225441096
            ],
            [
              33.54682847028596,
              2.3158808241810647
            ],
            [
              33.49441873928828,
              2.2251010284629587
            ],
            [
              33.42803418162177,
              2.235582287696843
            ],
            [
              33.469960463334814,
              2.165706761643122
            ],
            [
              33.431531936208444,
              2.1202741503796574
            ],
            [
              33.31973727608349,
              2.046983088713773
            ],
            [
              33.35231078448595,
              1.8557388266082597
            ],
            [
              33.471932080587436,
              1.7740248105894807
            ],
            [
              33.40222564591153,
              1.6791092635724993
            ],
            [
              33.281583168209494,
              1.4639951205632968
            ],
            [
              33.42842658296311,
              1.3321678806229897
            ],
            [
              33.20013353618961,
              1.302654392926172
            ],
            [
              33.08764241023806,
              1.198312897954807
            ],
            [
              32.9055775326303,
              1.1298565645144691
            ],
            [
              32.77452392977372,
              0.9859811002203571
            ],
            [
              32.692705582110904,
              0.8551197720357351
            ],
            [
              32.69123544316815,
              0.7337159830123312
            ],
            [
              32.557032598987035,
              0.6390859362980166
            ],
            [
              32.55168308136197,
              0.5588624415838126
            ],
            [
              32.52900267081601,
              0.5056029543004144
            ],
            [
              32.52580736392605,
              0.46213143527756984
            ],
            [
              32.518158280495,
              0.4064592117767276
            ],
            [
              32.5303815895768,
              0.35412688592630914
            ],
            [
              32.56501637412174,
              0.3359382494066052
            ],
            [
              32.6185459009605,
              0.33662880128659545
            ],
            [
              32.66206806448693,
              0.3166509868838716
            ],
            [
              32.66335302221913,
              0.2659183490806498
            ],
            [
              32.68925201738301,
              0.11805969501770619
            ],
            [
              32.77605198684813,
              -0.06552265620568676
            ],
            [
              32.85686924863552,
              -0.1351214430437011
            ],
            [
              32.86684988657515,
              -1.0087782773796476
            ],
            [
              33.94967623216132,
              -1.0033053625065236
            ],
            [
              33.94028654706159,
              -0.45619908309873836
            ],
            [
              33.98198859034571,
              -0.14445202277499902
            ],
            [
              33.95595968548281,
              -0.005153059856240816
            ],
            [
              33.92425067115758,
              0.09195630841625757
            ],
            [
              33.96166813177814,
              0.1578346238724322
            ],
            [
              34.0717553823865,
              0.31075998327135324
            ],
            [
              34.132915498510016,
              0.5370572424760667
            ],
            [
              34.49264871177485,
              0.9237725691046847
            ],
            [
              34.55347629210263,
              1.0706126414160764
            ],
            [
              34.71297817271892,
              1.173829539847489
            ],
            [
              35.02574109106479,
              1.8700710612146452
            ],
            [
              34.966787426251614,
              2.321779707072494
            ]
          ]
        ],
        "type": "Polygon"
      }
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
            [
              32.76702555004087,
              1.3209130822903177
            ],
            [
              32.64579216145697,
              1.3883794655273363
            ],
            [
              32.59008755443888,
              1.5570450643172293
            ],
            [
              32.45248438806957,
              1.6372937364858906
            ],
            [
              32.428696275594916,
              1.7663063616040375
            ],
            [
              32.668146615979495,
              1.9468784295170352
            ],
            [
              32.73044462045955,
              2.1290018214001396
            ],
            [
              32.52449197790944,
              2.246145039620597
            ],
            [
              32.18334284403302,
              2.2103390662158926
            ],
            [
              31.892287977811655,
              2.352148457803941
            ],
            [
              31.796605386747157,
              2.354310140052536
            ],
            [
              31.743652915607655,
              2.295277416127613
            ],
            [
              31.621894569999398,
              2.2501161201051048
            ],
            [
              31.55527849216631,
              2.295689977818256
            ],
            [
              31.30373471321542,
              2.137068660943811
            ],
            [
              31.029856377603465,
              1.7212311120122479
            ],
            [
              30.509647191137788,
              1.2369939946471078
            ],
            [
              30.276503255658128,
              1.1921389560683195
            ],
            [
              30.160022069046136,
              0.9230898789764836
            ],
            [
              29.98069624412622,
              0.8423763344614201
            ],
            [
              29.980840681636863,
              0.5464414657137837
            ],
            [
              29.729520499568395,
              -0.08139124748082338
            ],
            [
              29.586958352279026,
              -1.3810120646480755
            ],
            [
              29.85570897626272,
              -1.3632792303137222
            ],
            [
              29.909502580824807,
              -1.4887788259519397
            ],
            [
              30.15133917907795,
              -1.3366485635984304
            ],
            [
              30.339546560366756,
              -1.148482423480047
            ],
            [
              30.339545618515075,
              -1.0408834557352264
            ],
            [
              30.62649374398285,
              -1.0857584144996792
            ],
            [
              30.74313208451528,
              -0.9898216205001944
            ],
            [
              32.89061988891601,
              -1.0232491139107651
            ],
            [
              32.86018785695694,
              -0.166892518336482
            ],
            [
              32.62792461151395,
              -0.14789777673365734
            ],
            [
              32.537614024652555,
              -0.012298706195664977
            ],
            [
              32.52858905934815,
              0.20087808452959166
            ],
            [
              32.537242574511566,
              0.30290509534849264
            ],
            [
              32.54578812328633,
              0.311988247880187
            ],
            [
              32.55286152032026,
              0.3168843526665661
            ],
            [
              32.56322588373445,
              0.3168792667522684
            ],
            [
              32.57148986854627,
              0.3266754940679846
            ],
            [
              32.573058506666044,
              0.33699836120175064
            ],
            [
              32.576026109221374,
              0.3413702000767529
            ],
            [
              32.57740602445166,
              0.34591220352940866
            ],
            [
              32.58436656216876,
              0.3497711956611056
            ],
            [
              32.589905673028,
              0.3892711478668929
            ],
            [
              32.62145987245583,
              0.4008412479698329
            ],
            [
              32.62917830548406,
              0.42990856249821974
            ],
            [
              32.69575397579246,
              0.47191564043933454
            ],
            [
              32.75085224935779,
              0.6471035683626809
            ],
            [
              32.58191529553761,
              0.731975588534084
            ],
            [
              32.291937801699504,
              0.8385422920424048
            ],
            [
              32.22419523014983,
              0.9541619201587395
            ],
            [
              32.0507255021252,
              1.0760826025202306
            ],
            [
              32.09585706098926,
              1.1962332303648395
            ],
            [
              32.38852986700781,
              1.1199408820304022
            ],
            [
              32.670347766038546,
              1.0174479958038134
            ],
            [
              32.811262110615644,
              1.1050579088485648
            ],
            [
              32.76702555004087,
              1.3209130822903177
            ]
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
        [
          32.85653926494075,
          -0.17164261606885134
        ],
        [
          32.96419587413271,
          0.10757373109365176
        ],
        [
          32.90135698538873,
          0.2724883571537333
        ],
        [
          32.86469232512863,
          0.35802452036031696
        ],
        [
          32.96653578680559,
          0.41099477438955034
        ],
        [
          32.95024246721411,
          0.45985864443454716
        ],
        [
          32.89539606120874,
          0.4669531537997216
        ],
        [
          32.95541056593305,
          0.5431028253998704
        ],
        [
          32.96445299476295,
          0.5960548718694412
        ],
        [
          32.819660256159636,
          0.6835264080829404
        ],
        [
          32.714390575893276,
          0.5741479818464512
        ],
        [
          32.561102209238754,
          0.562053143587832
        ],
        [
          32.414369687289565,
          0.6691306828641501
        ],
        [
          32.32859751238129,
          0.6147203807679062
        ],
        [
          32.15987704826577,
          0.6716847078064916
        ],
        [
          31.91973848597945,
          0.626913325874142
        ],
        [
          31.89933468944494,
          0.48434900855025376
        ],
        [
          31.935931503179944,
          0.4028607130636317
        ],
        [
          31.73642073345016,
          0.2236730555427897
        ],
        [
          31.716465494693495,
          0.07982077098057516
        ],
        [
          31.817742634023517,
          0.036207275368866476
        ],
        [
          31.98877844711629,
          -0.1227287870010656
        ],
        [
          32.17320277975189,
          -0.23759458489278806
        ],
        [
          32.21952717282165,
          -0.3938919176739937
        ],
        [
          32.32109200363129,
          -0.4742337982665763
        ],
        [
          32.48480178086611,
          -0.4440962478368604
        ],
        [
          32.553280192774814,
          -0.3285809297527926
        ],
        [
          32.7015988284456,
          -0.2997037907259914
        ],
        [
          32.711814859108216,
          -0.18106119729214676
        ],
        [
          32.85653926494075,
          -0.17164261606885134
        ]
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


/*   loadStationsGeoJSON(url: string, location: string, station: string) {
    const map = this.map;
    this.clearMap();
  
    console.log(`loadStationsGeoJSON called with: url=${url}, location=${location}, station=${station}`);
  
    // Dynamically handle different locations
    if (location === 'North') {
      this.loadEntireMapPolygon();
      this.loadNorthPolygon();
    } else if (location === 'East') {
      this.loadEntireMapPolygon();
      this.loadEastPolygon();
    } else if (location === 'West') {
      this.loadEntireMapPolygon();
      this.loadWestPolygon();
    } else if (location === 'Central') {
      this.loadEntireMapPolygon();
      this.loadCentralPolygon();
    } else if (location === 'all') {
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
  
          if (station === 'all') {
            return properties.location === location;
          }
  
          return properties.location === location && properties.station === station;
        });
  
        console.log(`Filtered features count: ${filteredFeatures.length}`);
  
        if (filteredFeatures.length === 0) {
          console.warn('No features matched the filter criteria.');
          Swal.fire({
            title: 'No Data Found',
            html:  `<p> No data found for <span class="text-danger">${station}</span> stations in <span class="text-danger"> ${location} </span> regions.</p>`,
            icon: 'warning',
          });
          return;
        }
  
        // Display SweetAlert table with details
        Swal.fire({
          title: 'Key Analytics',
          html: `
            <table style="width:100%; text-align:left; border-collapse: collapse;">
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">Station Type</td>
                <td style="border: 1px solid #ddd; padding: 8px; font-weight:bold; ">${station}</td>
              </tr>
              <tr>
                <td  style="border: 1px solid #ddd; padding: 8px;">Location</td>
                <td style="border: 1px solid #ddd; padding: 8px; font-weight:bold;">${location}</td>
              </tr>
              <tr>
                <td  style="border: 1px solid #ddd; padding: 8px;">Total Stations</td>
                <td style="border: 1px solid #ddd; padding: 8px; font-weight:bold;">${filteredFeatures.length}</td>
              </tr>
            </table>
          `,
          icon: 'info',
          confirmButtonText: 'View Map',
        });
  
        // Add filtered features to the map
        filteredFeatures.forEach((feature: any) => {
          map.data.addGeoJson({ type: 'FeatureCollection', features: [feature] });
        });
  
        // Style markers
        map.data.setStyle({
          
          icon: {
            url: 'shell.png', // Update this path if needed
            scaledSize: new google.maps.Size(16, 16),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 16),
          },
        });
  
        console.log('Filtered features added to map and styled.');
  
        // Add click listener to display popup details
        map.data.addListener('click', (event: any) => {
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
  } */
  
  
  /*    loadStationsGeoJSON(url: string, location: string, station: string) {
        const map = this.map;
        this.clearMap();
      
        console.log(`loadStationsGeoJSON called with: url=${url}, location=${location}, station=${station}`);
      
        // Dynamically handle different locations
        if (location === 'North') {
          this.loadEntireMapPolygon();
          this.loadNorthPolygon();
        } else if (location === 'East') {
          this.loadEntireMapPolygon();
          this.loadEastPolygon();
        } else if (location === 'West') {
          this.loadEntireMapPolygon();
          this.loadWestPolygon();
        } else if (location === 'Central') {
          this.loadEntireMapPolygon();
          this.loadCentralPolygon();
        } else if (location === 'all') {
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
      
            // Filter features based on location and station, including 'all' option
            const filteredFeatures = geojsonData.features.filter((feature: any) => {
              const properties = feature.properties;
              if (!properties) return false;
    
              // Custom filter for 'all' location
              if (location === 'all') {
                return true; // Include all features
              }
      
              // Otherwise filter by location and station
              if (station === 'all') {
                return properties.location === location;
              }
    
              return properties.location === location && properties.station === station;
            });
      
            
      
            if (filteredFeatures.length === 0) {
              console.warn('No features matched the filter criteria.');
              Swal.fire({
                title: 'No Data Found',
                html:  `<p> No data found for <span class="text-danger">${station}</span> stations in <span class="text-danger"> ${location} </span> regions.</p>`,
                icon: 'warning',
              });
              return;
            }
      
            // Display SweetAlert table with details
            Swal.fire({
              title: 'Key Analytics',
              html: `
                <table style="width:100%; text-align:left; border-collapse: collapse;">
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">Station Type</td>
                    <td style="border: 1px solid #ddd; padding: 8px; font-weight:bold; ">${station}</td>
                  </tr>
                  <tr>
                    <td  style="border: 1px solid #ddd; padding: 8px;">Location</td>
                    <td style="border: 1px solid #ddd; padding: 8px; font-weight:bold;">${location}</td>
                  </tr>
                  <tr>
                    <td  style="border: 1px solid #ddd; padding: 8px;">Total Stations</td>
                    <td style="border: 1px solid #ddd; padding: 8px; font-weight:bold;">${filteredFeatures.length}</td>
                  </tr>
                </table>
              `,
              icon: 'info',
              confirmButtonText: 'View Map',
            });
      
            // Add filtered features to the map
            filteredFeatures.forEach((feature: any) => {
              map.data.addGeoJson({ type: 'FeatureCollection', features: [feature] });
            });
      
            // Style markers
            map.data.setStyle({
              icon: {
                url: 'shell.png', // Update this path if needed
                scaledSize: new google.maps.Size(16, 16),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(0, 16),
              },
            });
      
            console.log('Filtered features added to map and styled.');
      
            // Add click listener to display popup details
            map.data.addListener('click', (event: any) => {
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
    }  */
    
  
     /*  loadStationsGeoJSON(url: string, location: string, station: string) {
            const map = this.map;
            this.clearMap();
          
            console.log(`loadStationsGeoJSON called with: url=${url}, location=${location}, station=${station}`);
          
            // Dynamically handle different locations
            if (location === 'North') {
              this.loadEntireMapPolygon();
              this.loadNorthPolygon();
            } else if (location === 'East') {
              this.loadEntireMapPolygon();
              this.loadEastPolygon();
            } else if (location === 'West') {
              this.loadEntireMapPolygon();
              this.loadWestPolygon();
            } else if (location === 'Central') {
              this.loadEntireMapPolygon();
              this.loadCentralPolygon();
            } else if (location === 'all') {
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
          
                // Filter features based on location and station, including 'all' option
                const filteredFeatures = geojsonData.features.filter((feature: any) => {
                  const properties = feature.properties;
                  if (!properties) return false;
        
                  // Custom filter for 'all' location
                  if (location === 'all') {
                    if (station === 'all') {
                      return true; // Include all features regardless of station
                    }
                    return properties.station === station; // Include features that match the station
                  }
        
                  // Otherwise filter by location
                  if (station === 'all') {
                    return properties.location === location; // Include all stations in the specific location
                  }
        
                  return properties.location === location && properties.station === station; // Filter by both location and station
                });
          
                console.log(`Filtered features count: ${filteredFeatures.length}`);
          
                if (filteredFeatures.length === 0) {
                  console.warn('No features matched the filter criteria.');
                  Swal.fire({
                    title: 'No Data Found',
                    html:  `<p> No data found for <span class="text-danger">${station}</span> stations in <span class="text-danger"> ${location} </span> regions.</p>`,
                    icon: 'warning',
                  });
                  return;
                }
          
                // Display SweetAlert table with details
                Swal.fire({
                  title: 'Key Analytics',
                  html: `
                    <table style="width:100%; text-align:left; border-collapse: collapse;">
                      <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">Station Type</td>
                        <td style="border: 1px solid #ddd; padding: 8px; font-weight:bold; ">${station}</td>
                      </tr>
                      <tr>
                        <td  style="border: 1px solid #ddd; padding: 8px;">Location</td>
                        <td style="border: 1px solid #ddd; padding: 8px; font-weight:bold;">${location}</td>
                      </tr>
                      <tr>
                        <td  style="border: 1px solid #ddd; padding: 8px;">Total Stations</td>
                        <td style="border: 1px solid #ddd; padding: 8px; font-weight:bold;">${filteredFeatures.length}</td>
                      </tr>
                    </table>
                  `,
                  icon: 'info',
                  confirmButtonText: 'View Map',
                  showClass: {
                    popup: '', // Disable animation for showing
                  },
                  hideClass: {
                    popup: '', // Disable animation for hiding
                  },
                  confirmButtonColor: '#40bf40',
                  position: 'top-end', // Position the popup at the top-right corner
                  toast: false, // Use a toast-like design for the popup
                });
          
                // Add filtered features to the map
                filteredFeatures.forEach((feature: any) => {
                  map.data.addGeoJson({ type: 'FeatureCollection', features: [feature] });
                });
          
                // Style markers
                map.data.setStyle((feature: any) => {
                  // Get the station and icon properties from the GeoJSON feature
                  const station = feature.getProperty('station');
                  const iconUrl = feature.getProperty('icon'); // Use the icon URL directly if available
              
                  // Fallback or dynamic URL assignment
                  let url = iconUrl; // Use iconUrl from feature properties if defined
                  if (!url) {
                      // Dynamically assign a URL based on the station property if no icon is set in properties
                      if (station === 'Shell') {
                          url = 'https://i.ibb.co/8Kcffcb/shell.png';
                      } else if (station === 'Total') {
                          url = 'https://i.ibb.co/4S1k5WW/total.png'; // Replace with the correct URL
                      } else {
                          url = 'https://i.ibb.co/8Kcffcb/shell.png'; // Fallback icon
                      }
                  }
              
                  // Return the dynamic style
                  return {
                      icon: {
                          url: url, // Set the resolved URL
                          scaledSize: new google.maps.Size(24, 24),
                          origin: new google.maps.Point(0, 0),
                          anchor: new google.maps.Point(8, 16), // Adjust for alignment
                      },
                  };
              });
              
              
          
                console.log('Filtered features added to map and styled.');
          
                // Add click listener to display popup details
                map.data.addListener('click', (event: any) => {
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
        }  */
              loadStationsGeoJSON(url: string, location: string, station: string) {
                const map = this.map;
                this.clearMap();
              
                console.log(`loadStationsGeoJSON called with: url=${url}, location=${location}, station=${station}`);
              
                // Dynamically handle different locations
                if (location === 'North') {
                  this.loadEntireMapPolygon();
                  this.loadNorthPolygon();
                } else if (location === 'East') {
                  this.loadEntireMapPolygon();
                  this.loadEastPolygon();
                } else if (location === 'West') {
                  this.loadEntireMapPolygon();
                  this.loadWestPolygon();
                } else if (location === 'Central') {
                  this.loadEntireMapPolygon();
                  this.loadCentralPolygon();
                } else if (location === 'all') {
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
              
                    // Filter features based on location and station, including 'all' option
                    const filteredFeatures = geojsonData.features.filter((feature: any) => {
                      const properties = feature.properties;
                      if (!properties) return false;
              
                      // Custom filter for 'all' location
                      if (location === 'all') {
                        if (station === 'all') {
                          return true; // Include all features regardless of station
                        }
                        return properties.station === station; // Include features that match the station
                      }
              
                      // Otherwise filter by location
                      if (station === 'all') {
                        return properties.location === location; // Include all stations in the specific location
                      }
              
                      return properties.location === location && properties.station === station; // Filter by both location and station
                    });
              
                    console.log(`Filtered features count: ${filteredFeatures.length}`);
              
                    if (filteredFeatures.length === 0) {
                      console.warn('No features matched the filter criteria.');
                      Swal.fire({
                        title: 'No Data Found',
                        html: `<p>No data found for <span class="text-danger">${station}</span> stations in <span class="text-danger">${location}</span> regions.</p>`,
                        icon: 'warning',
                      });
                      return;
                    }
              
                    // Display SweetAlert table with details
                    Swal.fire({
                      title: 'Key Analytics',
                      html: `
                        <table style="width:100%; text-align:left; border-collapse: collapse;">
                          <tr>
                            <td style="border: 1px solid #ddd; padding: 8px;">Station Type</td>
                            <td style="border: 1px solid #ddd; padding: 8px; font-weight:bold;">${station}</td>
                          </tr>
                          <tr>
                            <td style="border: 1px solid #ddd; padding: 8px;">Location</td>
                            <td style="border: 1px solid #ddd; padding: 8px; font-weight:bold;">${location}</td>
                          </tr>
                          <tr>
                            <td style="border: 1px solid #ddd; padding: 8px;">Total Stations</td>
                            <td style="border: 1px solid #ddd; padding: 8px; font-weight:bold;">${filteredFeatures.length}</td>
                          </tr>
                        </table>
                      `,
                      icon: 'info',
                      confirmButtonText: 'View Map',
                      confirmButtonColor: '#40bf40',
                      position: 'top-end',
                      toast: false,
                    });
              
                    // Add filtered features to the map
                    filteredFeatures.forEach((feature: any) => {
                      map.data.addGeoJson({ type: 'FeatureCollection', features: [feature] });
                    });
              
                    // Style markers
               map.data.setStyle((feature: any) => {
                      const station = feature.getProperty('station');
                      const iconUrl = feature.getProperty('icon') || 'https://i.ibb.co/8Kcffcb/shell.png'; // Default icon fallback
              
                      return {
                        icon: {
                          url: iconUrl,
                          scaledSize: new google.maps.Size(24, 24),
                          origin: new google.maps.Point(0, 0),
                          anchor: new google.maps.Point(8, 16),
                        },
                      };
                    }); 
                  // Add a listener to detect zoom changes and update styles
/* map.addListener('zoom_changed', () => {
  const zoom = map.getZoom(); // Get the current zoom level
  console.log(`Zoom level changed to: ${zoom}`);

  map.data.setStyle((feature: any) => {
    const iconUrl = feature.getProperty('icon') || 'https://i.ibb.co/8Kcffcb/independent.png'; // Default icon fallback

    // Adjust icon size based on zoom level
    const baseSize = 24; // Base size for icons
    const scaledSize = Math.max(16, baseSize + (zoom - 5) * 5); // Scale with zoom (min size 16px)

    console.log(`Icon scaled size: ${scaledSize}`);

    return {
      icon: {
        url: iconUrl,
        scaledSize: new google.maps.Size(scaledSize, scaledSize),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(scaledSize / 2, scaledSize / 2),
      },
    };
  });
});
 */
                    
              
                    console.log('Filtered features added to map and styled.');
              
                    // Add click listener to display popup details
                  
                 //  let activeInfoWindow: any;
                 /*    map.data.addListener('click', (event: any) => {
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
                          <p><strong>Station type:</strong> ${properties.station?.value || 'N/A'}</p>
                        </div>
                      `;
                    
                      // Close the previously active InfoWindow
                      if (activeInfoWindow) {
                        activeInfoWindow.close();
                      }
                    
                      // Create a new InfoWindow
                      activeInfoWindow = new google.maps.InfoWindow({
                        content: contentString,
                        position: event.latLng,
                      });
                    
                      // Ensure activeInfoWindow is not null before calling open
                      if (activeInfoWindow) {
                        activeInfoWindow.open(map);
                        console.log('InfoWindow opened with details for:', properties.Code);
                      }
                    }); */
                    // Initialize variable to track the active InfoWindow
/// <reference types="google.maps" />

let activeInfoWindow: any;

// Add a click listener for displaying details in a popup
/* map.data.addListener('click', (event: any) => {
  const feature = event.feature;
  console.error('---------------------------------POINT HAS BEEN CLICKED');
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

  // Build content for the InfoWindow
  const contentString = `
    <div>
      <h3>${properties.Code || 'N/A'}</h3>
      <p><strong>Location:</strong> ${properties.location || 'N/A'}</p>
      <p><strong>Volume:</strong> ${properties.Vol || 'N/A'}</p>
      <p><strong>Station Type:</strong> ${properties.station?.value || 'N/A'}</p>
    </div>
  `;

  // Close the previous InfoWindow if it exists
  if (activeInfoWindow) {
    activeInfoWindow.close();
  }

  // Create and open a new InfoWindow
  activeInfoWindow = new google.maps.InfoWindow({
    content: contentString,
    position: event.latLng,
  });

  if (activeInfoWindow) {
    activeInfoWindow.open(map);
  }
  console.log('InfoWindow opened with details for:', properties.Code);
}); */

map.data.addListener('click', (event: any) => {
  const feature = event.feature;
  console.error('---------------------------------POINT HAS BEEN CLICKED');
  
  if (!feature) {
    console.error('No feature found on click event.');
    return;
  }

  console.log('Feature:', feature);

  // Attempt to access properties directly
  const properties = feature.Fg;
  if (!properties) {
    console.error('No properties found for this feature.');
    return;
  }
  
  console.log('Feature properties:', properties);

  // Build content for the InfoWindow
  const contentString = `
    <div>
      <h3>${properties.Code || 'N/A'}</h3>
      <p><strong>Location:</strong> ${properties.location || 'N/A'}</p>
      <p><strong>Longitude:</strong> ${properties.lon || 'N/A'}</p>
      <p><strong>Latitude:</strong> ${properties.lat || 'N/A'}</p>
    </div>
  `;

  // Close the previous InfoWindow if it exists
  if (activeInfoWindow) {
    activeInfoWindow.close();
  }

  // Create and open a new InfoWindow
  activeInfoWindow = new google.maps.InfoWindow({
    content: contentString,
    position: event.latLng,
  });

  if (activeInfoWindow) {
    activeInfoWindow.open(map);
  }
  console.log('InfoWindow opened with details for:', properties.Code);
});

// Close the InfoWindow when the map is clicked elsewhere
map.addListener('click', () => {
  if (activeInfoWindow) {
    activeInfoWindow.close();
    activeInfoWindow = null;
    console.log('InfoWindow closed.');
  }
});


// Close the InfoWindow when the map is clicked elsewhere
map.addListener('click', () => {
  if (activeInfoWindow) {
    activeInfoWindow.close();
    activeInfoWindow = null;
    console.log('InfoWindow closed.');
  }
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
    this.loadStationsGeoJSON('/uganda_shell_total.geojson', region, station);
    this.showMap = true;
  }
  loadSubStation(region: string, station: string) {
    alert(`Loading ---------->  ${station} stations sub in ${region} region...`);

    if (!this.mapInitialized) {
      this.initMap(); // Initialize the North Shell map
    }

    // Update map based on region and station type
    this.loadSubStationsGeoJSON('/uganda_shell_total.geojson', region, station);
    this.showMap = true;
  }

  loadSubStationsGeoJSON(url: string, sublocation: string, station: string) {
    const map = this.map;
    this.clearMap();
  
    console.log(`loadStationsGeoJSON called with: url=${url}, location=${sublocation}, station=${station}`);
  
    this.loadEntireMapPolygon();
    this.loadCentralPolygon();
   
  
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
  
        // Filter features based on location and station, including 'all' option
        const filteredFeatures = geojsonData.features.filter((feature: any) => {
          const properties = feature.properties;
          if (!properties) return false;
  
          // Custom filter for 'all' location
          if (sublocation === 'all') {
            if (station === 'all') {
              return true; // Include all features regardless of station
            }
            return properties.station === station; // Include features that match the station
          }
  
          // Otherwise filter by location
          if (station === 'all') {
            return properties.sublocation === sublocation; // Include all stations in the specific location
          }
          return properties.sublocation === sublocation;
        //  return properties.location === location && properties.station === station; // Filter by both location and station
        });
  
        console.log(`Filtered features count: ${filteredFeatures.length}`);
  
        if (filteredFeatures.length === 0) {
          console.warn('No features matched the filter criteria.');
          Swal.fire({
            title: 'No Data Found',
            html: `<p>No data found for <span class="text-danger">${station}</span> stations in <span class="text-danger">${sublocation}</span> regions.</p>`,
            icon: 'warning',
          });
          return;
        }
  
        // Display SweetAlert table with details
        Swal.fire({
          title: 'Key Analytics',
          html: `
            <table style="width:100%; text-align:left; border-collapse: collapse;">
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">Station Type</td>
                <td style="border: 1px solid #ddd; padding: 8px; font-weight:bold;">${station}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">Location</td>
                <td style="border: 1px solid #ddd; padding: 8px; font-weight:bold;">${sublocation}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">Total Stations</td>
                <td style="border: 1px solid #ddd; padding: 8px; font-weight:bold;">${filteredFeatures.length}</td>
              </tr>
            </table>
          `,
          icon: 'info',
          confirmButtonText: 'View Map',
          confirmButtonColor: '#40bf40',
          position: 'top-end',
          toast: false,
        });
  
        // Add filtered features to the map
        filteredFeatures.forEach((feature: any) => {
          map.data.addGeoJson({ type: 'FeatureCollection', features: [feature] });
        });
  
        // Style markers
   map.data.setStyle((feature: any) => {
          const station = feature.getProperty('station');
          const iconUrl = feature.getProperty('icon') || 'https://i.ibb.co/8Kcffcb/shell.png'; // Default icon fallback
  
          return {
            icon: {
              url: iconUrl,
              scaledSize: new google.maps.Size(24, 24),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(8, 16),
            },
          };
        }); 
      // Add a listener to detect zoom changes and update styles
/* map.addListener('zoom_changed', () => {
const zoom = map.getZoom(); // Get the current zoom level
console.log(`Zoom level changed to: ${zoom}`);

map.data.setStyle((feature: any) => {
const iconUrl = feature.getProperty('icon') || 'https://i.ibb.co/8Kcffcb/independent.png'; // Default icon fallback

// Adjust icon size based on zoom level
const baseSize = 24; // Base size for icons
const scaledSize = Math.max(16, baseSize + (zoom - 5) * 5); // Scale with zoom (min size 16px)

console.log(`Icon scaled size: ${scaledSize}`);

return {
icon: {
url: iconUrl,
scaledSize: new google.maps.Size(scaledSize, scaledSize),
origin: new google.maps.Point(0, 0),
anchor: new google.maps.Point(scaledSize / 2, scaledSize / 2),
},
};
});
});
*/
        
  
        console.log('Filtered features added to map and styled.');
  
        // Add click listener to display popup details
      
     //  let activeInfoWindow: any;
     /*    map.data.addListener('click', (event: any) => {
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
              <p><strong>Station type:</strong> ${properties.station?.value || 'N/A'}</p>
            </div>
          `;
        
          // Close the previously active InfoWindow
          if (activeInfoWindow) {
            activeInfoWindow.close();
          }
        
          // Create a new InfoWindow
          activeInfoWindow = new google.maps.InfoWindow({
            content: contentString,
            position: event.latLng,
          });
        
          // Ensure activeInfoWindow is not null before calling open
          if (activeInfoWindow) {
            activeInfoWindow.open(map);
            console.log('InfoWindow opened with details for:', properties.Code);
          }
        }); */
        // Initialize variable to track the active InfoWindow
/// <reference types="google.maps" />

let activeInfoWindow: any;

// Add a click listener for displaying details in a popup
/* map.data.addListener('click', (event: any) => {
const feature = event.feature;
console.error('---------------------------------POINT HAS BEEN CLICKED');
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

// Build content for the InfoWindow
const contentString = `
<div>
<h3>${properties.Code || 'N/A'}</h3>
<p><strong>Location:</strong> ${properties.location || 'N/A'}</p>
<p><strong>Volume:</strong> ${properties.Vol || 'N/A'}</p>
<p><strong>Station Type:</strong> ${properties.station?.value || 'N/A'}</p>
</div>
`;

// Close the previous InfoWindow if it exists
if (activeInfoWindow) {
activeInfoWindow.close();
}

// Create and open a new InfoWindow
activeInfoWindow = new google.maps.InfoWindow({
content: contentString,
position: event.latLng,
});

if (activeInfoWindow) {
activeInfoWindow.open(map);
}
console.log('InfoWindow opened with details for:', properties.Code);
}); */

map.data.addListener('click', (event: any) => {
const feature = event.feature;
console.error('---------------------------------POINT HAS BEEN CLICKED');

if (!feature) {
console.error('No feature found on click event.');
return;
}

console.log('Feature:', feature);

// Attempt to access properties directly
const properties = feature.Fg;
if (!properties) {
console.error('No properties found for this feature.');
return;
}

console.log('Feature properties:', properties);

// Build content for the InfoWindow
const contentString = `
<div>
<h3>${properties.Code || 'N/A'}</h3>
<p><strong>Location:</strong> ${properties.location || 'N/A'}</p>
<p><strong>Longitude:</strong> ${properties.lon || 'N/A'}</p>
<p><strong>Latitude:</strong> ${properties.lat || 'N/A'}</p>
</div>
`;

// Close the previous InfoWindow if it exists
if (activeInfoWindow) {
activeInfoWindow.close();
}

// Create and open a new InfoWindow
activeInfoWindow = new google.maps.InfoWindow({
content: contentString,
position: event.latLng,
});

if (activeInfoWindow) {
activeInfoWindow.open(map);
}
console.log('InfoWindow opened with details for:', properties.Code);
});

// Close the InfoWindow when the map is clicked elsewhere
map.addListener('click', () => {
if (activeInfoWindow) {
activeInfoWindow.close();
activeInfoWindow = null;
console.log('InfoWindow closed.');
}
});


// Close the InfoWindow when the map is clicked elsewhere
map.addListener('click', () => {
if (activeInfoWindow) {
activeInfoWindow.close();
activeInfoWindow = null;
console.log('InfoWindow closed.');
}
});


      })
      .catch((error) => {
        console.error('Error fetching or processing GeoJSON data:', error);
      });
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
