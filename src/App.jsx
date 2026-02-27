import { useState, useRef, useEffect } from "react";

// ─── NFL TEAMS ───────────────────────────────────────────────────────────────
const TEAMS = [
  {id:"ARI",name:"Cardinals",city:"Arizona",p:"#97233F",s:"#FFB612"},
  {id:"ATL",name:"Falcons",city:"Atlanta",p:"#A71930",s:"#A5ACAF"},
  {id:"BAL",name:"Ravens",city:"Baltimore",p:"#241773",s:"#9E7C0C"},
  {id:"BUF",name:"Bills",city:"Buffalo",p:"#00338D",s:"#C60C30"},
  {id:"CAR",name:"Panthers",city:"Carolina",p:"#0085CA",s:"#101820"},
  {id:"CHI",name:"Bears",city:"Chicago",p:"#0B162A",s:"#C83803"},
  {id:"CIN",name:"Bengals",city:"Cincinnati",p:"#FB4F14",s:"#000000"},
  {id:"CLE",name:"Browns",city:"Cleveland",p:"#311D00",s:"#FF3C00"},
  {id:"DAL",name:"Cowboys",city:"Dallas",p:"#003594",s:"#869397"},
  {id:"DEN",name:"Broncos",city:"Denver",p:"#FB4F14",s:"#002244"},
  {id:"DET",name:"Lions",city:"Detroit",p:"#0076B6",s:"#B0B7BC"},
  {id:"GB",name:"Packers",city:"Green Bay",p:"#203731",s:"#FFB612"},
  {id:"HOU",name:"Texans",city:"Houston",p:"#03202F",s:"#A71930"},
  {id:"IND",name:"Colts",city:"Indianapolis",p:"#002C5F",s:"#A2AAAD"},
  {id:"JAX",name:"Jaguars",city:"Jacksonville",p:"#006778",s:"#9F792C"},
  {id:"KC",name:"Chiefs",city:"Kansas City",p:"#E31837",s:"#FFB81C"},
  {id:"LV",name:"Raiders",city:"Las Vegas",p:"#000000",s:"#A5ACAF"},
  {id:"LAC",name:"Chargers",city:"L.A.",p:"#0080C6",s:"#FFC20E"},
  {id:"LAR",name:"Rams",city:"L.A.",p:"#003594",s:"#FFA300"},
  {id:"MIA",name:"Dolphins",city:"Miami",p:"#008E97",s:"#FC4C02"},
  {id:"MIN",name:"Vikings",city:"Minnesota",p:"#4F2683",s:"#FFC62F"},
  {id:"NE",name:"Patriots",city:"New England",p:"#002244",s:"#C60C30"},
  {id:"NO",name:"Saints",city:"New Orleans",p:"#9F8958",s:"#101820"},
  {id:"NYG",name:"Giants",city:"N.Y.",p:"#0B2265",s:"#A71930"},
  {id:"NYJ",name:"Jets",city:"N.Y.",p:"#125740",s:"#FFFFFF"},
  {id:"PHI",name:"Eagles",city:"Philadelphia",p:"#004C54",s:"#A5ACAF"},
  {id:"PIT",name:"Steelers",city:"Pittsburgh",p:"#101820",s:"#FFB612"},
  {id:"SF",name:"49ers",city:"San Francisco",p:"#AA0000",s:"#B3995D"},
  {id:"SEA",name:"Seahawks",city:"Seattle",p:"#002244",s:"#69BE28"},
  {id:"TB",name:"Buccaneers",city:"Tampa Bay",p:"#D50A0A",s:"#FF7900"},
  {id:"TEN",name:"Titans",city:"Tennessee",p:"#0C2340",s:"#4B92DB"},
  {id:"WAS",name:"Commanders",city:"Washington",p:"#5A1414",s:"#FFB612"},
];

// ─── POSITION SLOTS ──────────────────────────────────────────────────────────
const SLOTS = [
  {key:"QB", label:"Quarterback",       weight:1.5,  rosterKey:"QB"},
  {key:"RB", label:"Running Back",      weight:1.2,  rosterKey:"RB"},
  {key:"WR1",label:"Wide Receiver 1",   weight:1.0,  rosterKey:"WR"},
  {key:"WR2",label:"Wide Receiver 2",   weight:1.0,  rosterKey:"WR"},
  {key:"WR3",label:"Wide Receiver 3",   weight:1.0,  rosterKey:"WR"},
  {key:"TE", label:"Tight End",         weight:1.1,  rosterKey:"TE"},
  {key:"DEF",label:"Defense",           weight:1.3,  rosterKey:"DEF"},
  {key:"HC", label:"Head Coach",        weight:1.15, rosterKey:"HC"},
];

// ─── CURRENT ROSTERS (2025-26 season, COMPOSITE ratings) ────────────────────
// Rating methodology: PFF 2025 season grade 50% + Madden 26 OVR 25% + SI/Media ranking 25%
// Sources: pff.com/nfl-pff-101 · EA Sports Madden 26 launch ratings · SI/MMQB 2026 Top 100
// Key 2025 facts:
// Matthew Stafford (LAR) NFL MVP, 91.9 PFF passing grade
// Puka Nacua (LAR) #1 WR at 96.3 PFF, 1,715 yards, 10 TDs
// Jaxon Smith-Njigba (SEA) #2 WR; Kenneth Walker III (SEA) #1 RB, Super Bowl 60 MVP
// Myles Garrett (CLE) broke all-time sack record (23), 93.3 pass-rush grade
// George Kittle (SF) #1 TE at 90.7; George Pickens traded PIT→DAL
// Seattle Seahawks won Super Bowl 60 over New England Patriots 29-13
// Ben Johnson (CHI HC yr1) won NFC North; Davante Adams moved to LAR
// 2025 ROOKIES: Tetairoa McMillan (CAR), Harold Fannin Jr. (CLE),
//   Ashton Jeanty (LV), Tyler Warren (IND), Colston Loveland (CHI),
//   Luther Burden III (CHI), Kyle Monangai (CHI), Emeka Egbuka (TB),
//   Omarion Hampton (LAC), Matthew Golden (GB), Jayden Higgins (HOU),
//   Woody Marks (HOU), RJ Harvey (DEN), Cam Skattebo (NYG),
//   Tyler Shough (NO), Travis Hunter (JAX - injured Wk7),
//   Shedeur Sanders (CLE), Quinshon Judkins (CLE), Isaiah Bond (CLE),
//   Jaxson Dart (NYG), Cam Ward (TEN), Jacory Croskey-Merritt (WAS)

const ROSTERS = {
  ARI:{
    QB:[{n:"Kyler Murray",r:76},{n:"Clayton Tune",r:58}],
    RB:[{n:"James Conner",r:70},{n:"Trey Benson",r:63}],
    WR:[{n:"Marvin Harrison Jr.",r:83},{n:"Michael Wilson",r:64},{n:"Greg Dortch",r:61}],
    TE:[{n:"Trey McBride",r:93},{n:"Elijah Higgins",r:58}],
    DEF:[{n:"Arizona Defense",r:62}],
    HC:[{n:"Jonathan Gannon",r:60}],
  },
  ATL:{
    QB:[{n:"Michael Penix Jr.",r:73},{n:"Kirk Cousins",r:78}],
    RB:[{n:"Bijan Robinson",r:92},{n:"Tyler Allgeier",r:65}],
    WR:[{n:"Drake London",r:87},{n:"Darnell Mooney",r:68},{n:"KhaDarel Hodge",r:60}],
    TE:[{n:"Kyle Pitts",r:83},{n:"Charlie Woerner",r:58}],
    DEF:[{n:"Atlanta Defense",r:72}],
    HC:[{n:"Kevin Stefanski",r:76}],
  },
  BAL:{
    QB:[{n:"Lamar Jackson",r:94},{n:"Josh Johnson",r:53}],
    RB:[{n:"Derrick Henry",r:88},{n:"Justice Hill",r:63}],
    WR:[{n:"Zay Flowers",r:78},{n:"Rashod Bateman",r:65},{n:"Nelson Agholor",r:61}],
    TE:[{n:"Mark Andrews",r:85},{n:"Isaiah Likely",r:68}],
    DEF:[{n:"Baltimore Defense",r:82}],
    HC:[{n:"John Harbaugh",r:85}],
  },
  BUF:{
    QB:[{n:"Josh Allen",r:97},{n:"Mitchell Trubisky",r:58}],
    RB:[{n:"James Cook",r:92},{n:"Ray Davis",r:62}],
    WR:[{n:"Keon Coleman",r:73},{n:"Khalil Shakir",r:71},{n:"Mack Hollins",r:62}],
    TE:[{n:"Dalton Kincaid",r:73},{n:"Dawson Knox",r:65}],
    DEF:[{n:"Buffalo Defense",r:79}],
    HC:[{n:"Joe Brady",r:78}],
  },
  CAR:{
    QB:[{n:"Bryce Young",r:72},{n:"Andy Dalton",r:59}],
    RB:[{n:"Chuba Hubbard",r:66},{n:"Miles Sanders",r:61}],
    WR:[{n:"Tetairoa McMillan",r:83},{n:"Adam Thielen",r:63},{n:"Jonathan Mingo",r:60}],
    TE:[{n:"Ja'Tavion Sanders",r:63},{n:"Tommy Tremble",r:58}],
    DEF:[{n:"Carolina Defense",r:62}],
    HC:[{n:"Dave Canales",r:63}],
  },
  CHI:{
    QB:[{n:"Caleb Williams",r:83},{n:"Tyson Bagent",r:56}],
    RB:[{n:"D'Andre Swift",r:74},{n:"Kyle Monangai",r:65}],
    WR:[{n:"DJ Moore",r:79},{n:"Luther Burden III",r:75},{n:"Rome Odunze",r:72}],
    TE:[{n:"Colston Loveland",r:84},{n:"Cole Kmet",r:67}],
    DEF:[{n:"Chicago Defense",r:77}],
    HC:[{n:"Ben Johnson",r:84}],
  },
  CIN:{
    QB:[{n:"Joe Burrow",r:94},{n:"Jake Browning",r:60}],
    RB:[{n:"Chase Brown",r:79},{n:"Zack Moss",r:63}],
    WR:[{n:"Ja'Marr Chase",r:98},{n:"Tee Higgins",r:84},{n:"Tyler Boyd",r:68}],
    TE:[{n:"Mike Gesicki",r:66},{n:"Drew Sample",r:57}],
    DEF:[{n:"Cincinnati Defense",r:74}],
    HC:[{n:"Zac Taylor",r:72}],
  },
  CLE:{
    QB:[{n:"Shedeur Sanders",r:66},{n:"Dillon Gabriel",r:60}],
    RB:[{n:"Quinshon Judkins",r:74},{n:"Dylan Sampson",r:63}],
    WR:[{n:"Jerry Jeudy",r:72},{n:"Isaiah Bond",r:65},{n:"Cedric Tillman",r:63}],
    TE:[{n:"Harold Fannin Jr.",r:82},{n:"David Njoku",r:72}],
    DEF:[{n:"Cleveland Defense",r:76}],
    HC:[{n:"Todd Monken",r:72}],
  },
  DAL:{
    QB:[{n:"Dak Prescott",r:85},{n:"Cooper Rush",r:62}],
    RB:[{n:"Javonte Williams",r:75},{n:"Deuce Vaughn",r:60}],
    WR:[{n:"CeeDee Lamb",r:93},{n:"George Pickens",r:88},{n:"Jalen Tolbert",r:61}],
    TE:[{n:"Jake Ferguson",r:72},{n:"Luke Schoonmaker",r:60}],
    DEF:[{n:"Dallas Defense",r:78}],
    HC:[{n:"Brian Schottenheimer",r:75}],
  },
  DEN:{
    QB:[{n:"Bo Nix",r:79},{n:"Jarrett Stidham",r:57}],
    RB:[{n:"RJ Harvey",r:71},{n:"Javonte Williams",r:68}],
    WR:[{n:"Courtland Sutton",r:73},{n:"Marvin Mims",r:67},{n:"Troy Franklin",r:63}],
    TE:[{n:"Adam Trautman",r:62},{n:"Greg Dulcich",r:58}],
    DEF:[{n:"Denver Defense",r:90}],
    HC:[{n:"Sean Payton",r:83}],
  },
  DET:{
    QB:[{n:"Jared Goff",r:83},{n:"Hendon Hooker",r:60}],
    RB:[{n:"Jahmyr Gibbs",r:95},{n:"David Montgomery",r:78}],
    WR:[{n:"Amon-Ra St. Brown",r:95},{n:"Jameson Williams",r:83},{n:"Josh Reynolds",r:62}],
    TE:[{n:"Sam LaPorta",r:76},{n:"Brock Wright",r:58}],
    DEF:[{n:"Detroit Defense",r:78}],
    HC:[{n:"Dan Campbell",r:85}],
  },
  GB:{
    QB:[{n:"Jordan Love",r:86},{n:"Sean Clifford",r:53}],
    RB:[{n:"Josh Jacobs",r:90},{n:"Emanuel Wilson",r:63}],
    WR:[{n:"Romeo Doubs",r:74},{n:"Jayden Reed",r:74},{n:"Matthew Golden",r:65}],
    TE:[{n:"Tucker Kraft",r:85},{n:"Luke Musgrave",r:66}],
    DEF:[{n:"Green Bay Defense",r:76}],
    HC:[{n:"Matt LaFleur",r:81}],
  },
  HOU:{
    QB:[{n:"C.J. Stroud",r:77},{n:"Case Keenum",r:55}],
    RB:[{n:"Woody Marks",r:73},{n:"Joe Mixon",r:74}],
    WR:[{n:"Nico Collins",r:89},{n:"Jayden Higgins",r:72},{n:"Tank Dell",r:73}],
    TE:[{n:"Dalton Schultz",r:68},{n:"Brevin Jordan",r:62}],
    DEF:[{n:"Houston Defense",r:89}],
    HC:[{n:"DeMeco Ryans",r:82}],
  },
  IND:{
    QB:[{n:"Daniel Jones",r:79},{n:"Joe Flacco",r:58}],
    RB:[{n:"Jonathan Taylor",r:93},{n:"Trey Sermon",r:58}],
    WR:[{n:"Michael Pittman Jr.",r:76},{n:"Josh Downs",r:70},{n:"Alec Pierce",r:61}],
    TE:[{n:"Tyler Warren",r:83},{n:"Mo Alie-Cox",r:57}],
    DEF:[{n:"Indianapolis Defense",r:68}],
    HC:[{n:"Shane Steichen",r:68}],
  },
  JAX:{
    QB:[{n:"Trevor Lawrence",r:82},{n:"C.J. Beathard",r:52}],
    RB:[{n:"Travis Etienne Jr.",r:85},{n:"Tank Bigsby",r:65}],
    WR:[{n:"Brian Thomas Jr.",r:81},{n:"Travis Hunter",r:68},{n:"Gabe Davis",r:64}],
    TE:[{n:"Evan Engram",r:74},{n:"Brenton Strange",r:58}],
    DEF:[{n:"Jacksonville Defense",r:68}],
    HC:[{n:"Liam Coen",r:83}],
  },
  KC:{
    QB:[{n:"Patrick Mahomes",r:92},{n:"Carson Wentz",r:60}],
    RB:[{n:"Kareem Hunt",r:72},{n:"Isiah Pacheco",r:72}],
    WR:[{n:"Rashee Rice",r:76},{n:"Mecole Hardman",r:65},{n:"Skyy Moore",r:61}],
    TE:[{n:"Travis Kelce",r:84},{n:"Noah Gray",r:60}],
    DEF:[{n:"Kansas City Defense",r:81}],
    HC:[{n:"Andy Reid",r:94}],
  },
  LV:{
    QB:[{n:"Geno Smith",r:70},{n:"Aidan O'Connell",r:60}],
    RB:[{n:"Ashton Jeanty",r:78},{n:"Ameer Abdullah",r:57}],
    WR:[{n:"Jakobi Meyers",r:70},{n:"Quentin Johnston",r:65},{n:"Michael Gallup",r:61}],
    TE:[{n:"Brock Bowers",r:92},{n:"Michael Mayer",r:64}],
    DEF:[{n:"Las Vegas Defense",r:66}],
    HC:[{n:"Pete Carroll",r:62}],
  },
  LAC:{
    QB:[{n:"Justin Herbert",r:88},{n:"Easton Stick",r:54}],
    RB:[{n:"J.K. Dobbins",r:72},{n:"Omarion Hampton",r:69}],
    WR:[{n:"Quentin Johnston",r:65},{n:"Joshua Palmer",r:66},{n:"Ladd McConkey",r:74}],
    TE:[{n:"Will Dissly",r:62},{n:"Donald Parham Jr.",r:60}],
    DEF:[{n:"L.A. Chargers Defense",r:73}],
    HC:[{n:"Jim Harbaugh",r:84}],
  },
  LAR:{
    QB:[{n:"Matthew Stafford",r:96},{n:"Dresser Winn",r:54}],
    RB:[{n:"Kyren Williams",r:84},{n:"Blake Corum",r:63}],
    WR:[{n:"Puka Nacua",r:99},{n:"Davante Adams",r:90},{n:"Tutu Atwell",r:65}],
    TE:[{n:"Colby Parkinson",r:66},{n:"Davis Allen",r:58}],
    DEF:[{n:"L.A. Rams Defense",r:84}],
    HC:[{n:"Sean McVay",r:88}],
  },
  MIA:{
    QB:[{n:"Tua Tagovailoa",r:70},{n:"Tyler Huntley",r:57}],
    RB:[{n:"De'Von Achane",r:87},{n:"Raheem Mostert",r:67}],
    WR:[{n:"Tyreek Hill",r:86},{n:"Jaylen Waddle",r:77},{n:"Malik Washington",r:60}],
    TE:[{n:"Durham Smythe",r:59},{n:"Julian Hill",r:57}],
    DEF:[{n:"Miami Defense",r:67}],
    HC:[{n:"Mike McDaniel",r:70}],
  },
  MIN:{
    QB:[{n:"J.J. McCarthy",r:62},{n:"Nick Mullens",r:53}],
    RB:[{n:"Aaron Jones",r:73},{n:"Jordan Mason",r:71}],
    WR:[{n:"Justin Jefferson",r:95},{n:"Jordan Addison",r:75},{n:"Jalen Nailor",r:60}],
    TE:[{n:"T.J. Hockenson",r:77},{n:"Josh Oliver",r:58}],
    DEF:[{n:"Minnesota Defense",r:81}],
    HC:[{n:"Kevin O'Connell",r:81}],
  },
  NE:{
    QB:[{n:"Drake Maye",r:89},{n:"Jacoby Brissett",r:60}],
    RB:[{n:"Treveyon Henderson",r:78},{n:"Rhamondre Stevenson",r:71}],
    WR:[{n:"Ja'Lynn Polk",r:65},{n:"Demario Douglas",r:63},{n:"Kendrick Bourne",r:63}],
    TE:[{n:"Hunter Henry",r:65},{n:"Austin Hooper",r:58}],
    DEF:[{n:"New England Defense",r:85}],
    HC:[{n:"Mike Vrabel",r:87}],
  },
  NO:{
    QB:[{n:"Tyler Shough",r:73},{n:"Derek Carr",r:71}],
    RB:[{n:"Alvin Kamara",r:76},{n:"Kendre Miller",r:63}],
    WR:[{n:"Chris Olave",r:82},{n:"Rashid Shaheed",r:69},{n:"Marquez Valdes-Scantling",r:61}],
    TE:[{n:"Juwan Johnson",r:65},{n:"Foster Moreau",r:60}],
    DEF:[{n:"New Orleans Defense",r:65}],
    HC:[{n:"Dennis Allen",r:60}],
  },
  NYG:{
    QB:[{n:"Jaxson Dart",r:70},{n:"Tommy DeVito",r:54}],
    RB:[{n:"Cam Skattebo",r:78},{n:"Tyrone Tracy Jr.",r:68}],
    WR:[{n:"Malik Nabers",r:91},{n:"Darius Slayton",r:66},{n:"Wan'Dale Robinson",r:64}],
    TE:[{n:"Daniel Bellinger",r:60},{n:"Tommy Sweeney",r:57}],
    DEF:[{n:"N.Y. Giants Defense",r:73}],
    HC:[{n:"John Harbaugh",r:80}],
  },
  NYJ:{
    QB:[{n:"Justin Fields",r:68},{n:"Brady Cook",r:58}],
    RB:[{n:"Breece Hall",r:82},{n:"Braelon Allen",r:65}],
    WR:[{n:"Garrett Wilson",r:84},{n:"Allen Lazard",r:61},{n:"Xavier Gipson",r:58}],
    TE:[{n:"Tyler Conklin",r:62},{n:"Jeremy Ruckert",r:57}],
    DEF:[{n:"N.Y. Jets Defense",r:76}],
    HC:[{n:"Aaron Glenn",r:66}],
  },
  PHI:{
    QB:[{n:"Jalen Hurts",r:82},{n:"Kenny Pickett",r:63}],
    RB:[{n:"Saquon Barkley",r:97},{n:"Kenneth Gainwell",r:62}],
    WR:[{n:"A.J. Brown",r:91},{n:"DeVonta Smith",r:85},{n:"Parris Campbell",r:61}],
    TE:[{n:"Dallas Goedert",r:84},{n:"Grant Calcaterra",r:58}],
    DEF:[{n:"Philadelphia Defense",r:82}],
    HC:[{n:"Nick Sirianni",r:76}],
  },
  PIT:{
    QB:[{n:"Aaron Rodgers",r:77},{n:"Russell Wilson",r:66}],
    RB:[{n:"Najee Harris",r:71},{n:"Jaylen Warren",r:66}],
    WR:[{n:"DK Metcalf",r:84},{n:"Calvin Austin III",r:65},{n:"Mike Williams",r:68}],
    TE:[{n:"Pat Freiermuth",r:68},{n:"Darnell Washington",r:63}],
    DEF:[{n:"Pittsburgh Defense",r:86}],
    HC:[{n:"Mike McCarthy",r:74}],
  },
  SF:{
    QB:[{n:"Brock Purdy",r:84},{n:"Brandon Allen",r:53}],
    RB:[{n:"Christian McCaffrey",r:93},{n:"Jordan Mason",r:70}],
    WR:[{n:"Brandon Aiyuk",r:77},{n:"Ricky Pearsall",r:68},{n:"Jauan Jennings",r:68}],
    TE:[{n:"George Kittle",r:97},{n:"Charlie Woerner",r:57}],
    DEF:[{n:"San Francisco Defense",r:85}],
    HC:[{n:"Kyle Shanahan",r:87}],
  },
  SEA:{
    QB:[{n:"Sam Darnold",r:85},{n:"Sam Howell",r:61}],
    RB:[{n:"Kenneth Walker III",r:94},{n:"Zach Charbonnet",r:68}],
    WR:[{n:"Jaxon Smith-Njigba",r:96},{n:"Cooper Kupp",r:79},{n:"Tyler Lockett",r:70}],
    TE:[{n:"Noah Fant",r:66},{n:"AJ Barner",r:60}],
    DEF:[{n:"Seattle Defense",r:93}],
    HC:[{n:"Mike Macdonald",r:90}],
  },
  TB:{
    QB:[{n:"Baker Mayfield",r:80},{n:"Kyle Trask",r:56}],
    RB:[{n:"Bucky Irving",r:86},{n:"Rachaad White",r:68}],
    WR:[{n:"Mike Evans",r:88},{n:"Emeka Egbuka",r:81},{n:"Chris Godwin",r:75}],
    TE:[{n:"Cade Otton",r:65},{n:"Ko Kieft",r:57}],
    DEF:[{n:"Tampa Bay Defense",r:76}],
    HC:[{n:"Todd Bowles",r:68}],
  },
  TEN:{
    QB:[{n:"Cam Ward",r:75},{n:"Mason Rudolph",r:55}],
    RB:[{n:"Tony Pollard",r:72},{n:"Tyjae Spears",r:64}],
    WR:[{n:"Calvin Ridley",r:72},{n:"Nick Westbrook-Ikhine",r:61},{n:"DeAndre Hopkins",r:72}],
    TE:[{n:"Chig Okonkwo",r:70},{n:"Josh Whyle",r:57}],
    DEF:[{n:"Tennessee Defense",r:65}],
    HC:[{n:"Robert Saleh",r:76}],
  },
  WAS:{
    QB:[{n:"Jayden Daniels",r:79},{n:"Marcus Mariota",r:58}],
    RB:[{n:"Jacory Croskey-Merritt",r:74},{n:"Austin Ekeler",r:68}],
    WR:[{n:"Terry McLaurin",r:90},{n:"Deebo Samuel",r:81},{n:"Jahan Dotson",r:67}],
    TE:[{n:"John Bates",r:60},{n:"Cole Turner",r:57}],
    DEF:[{n:"Washington Defense",r:74}],
    HC:[{n:"Dan Quinn",r:78}],
  },
};

// ─── TEAM LEGENDS (retired legends per franchise, 95–99 only) ────────────────
// pos = which roster slot(s) this legend can fill
const TEAM_LEGENDS = {
  ARI:[
    {n:"Kurt Warner",     r:97, era:"1998–2009", pos:["QB"], note:"2× Super Bowl, 2× NFL MVP"},
    {n:"Larry Fitzgerald",r:98, era:"2004–2020", pos:["WR1","WR2","WR3"], note:"Second all-time receiving yards"},
  ],
  ATL:[
    {n:"Michael Vick",   r:98, era:"2001–2006", pos:["QB"], note:"Most electric dual-threat QB ever"},
    {n:"Matt Ryan",      r:96, era:"2008–2021", pos:["QB"], note:"2016 NFL MVP, franchise leader"},
    {n:"Julio Jones",    r:98, era:"2011–2020", pos:["WR1","WR2","WR3"], note:"Best WR of his era, 7× Pro Bowl"},
  ],
  BAL:[
    {n:"2000 Baltimore Defense",r:99, era:"2000", pos:["DEF"], note:"4 shutouts, 165 points allowed all season, Ray Lewis DPOY — historic D"},
    {n:"Don Shula",       r:96, era:"1963–1969", pos:["HC"], note:"Built early Colts dynasty before taking Dolphins to perfection"},
    {n:"Johnny Unitas",   r:98, era:"1956–1972", pos:["QB"], note:"The Original, 3× NFL MVP, HOF"},
    {n:"Priest Holmes",   r:96, era:"1997–2001", pos:["RB"], note:"Key to early Ravens runs"},
  ],
  BUF:[
    {n:"Marv Levy",       r:95, era:"1986–1997", pos:["HC"], note:"4 consecutive Super Bowl appearances — unmatched run, HOF"},
    {n:"Jim Kelly",       r:97, era:"1986–1996", pos:["QB"], note:"4× Super Bowl, HOF, K-Gun architect"},
    {n:"Thurman Thomas",  r:97, era:"1988–1999", pos:["RB"], note:"4× Super Bowl RB, HOF, Bills legend"},
    {n:"Andre Reed",      r:96, era:"1985–1999", pos:["WR1","WR2","WR3"], note:"HOF WR, K-Gun offense core"},
    {n:"O.J. Simpson",    r:97, era:"1969–1977", pos:["RB"], note:"First 2,000-yard rusher, HOF"},
  ],
  CAR:[
    {n:"Steve Smith Sr.", r:97, era:"2001–2013", pos:["WR1","WR2","WR3"], note:"Most electric WR in Panthers history"},
    {n:"Jake Delhomme",   r:95, era:"2003–2009", pos:["QB"], note:"Led Panthers to Super Bowl XXXVIII"},
  ],
  CHI:[
    {n:"1985 Chicago Defense",r:99, era:"1985", pos:["DEF"], note:"18-1, allowed 10 points in playoffs, Buddy Ryan's masterpiece — greatest defense ever"},
    {n:"George Halas",    r:97, era:"1920–1967", pos:["HC"], note:"Papa Bear — founded the NFL, 6 championships, 318 wins, HOF"},
    {n:"Walter Payton",   r:99, era:"1975–1987", pos:["RB"], note:"Sweetness — greatest all-around RB ever"},
    {n:"Gale Sayers",     r:97, era:"1965–1971", pos:["RB"], note:"Greatest open-field runner, HOF"},
    {n:"Sid Luckman",     r:96, era:"1939–1950", pos:["QB"], note:"5× NFL champion, HOF"},
    {n:"Mike Ditka",      r:96, era:"1961–1966", pos:["TE","HC"], note:"HOF TE, iconic Bears HC"},
    {n:"Bronko Nagurski", r:95, era:"1930–1937", pos:["RB"], note:"Original Bears legend, HOF"},
  ],
  CIN:[
    {n:"Chad Johnson",    r:97, era:"2001–2010", pos:["WR1","WR2","WR3"], note:"6× Pro Bowl, Bengals all-time WR leader"},
    {n:"Boomer Esiason",  r:96, era:"1984–1997", pos:["QB"], note:"1988 NFL MVP, HOF finalist"},
    {n:"Cris Collinsworth",r:95,era:"1981–1988", pos:["WR1","WR2","WR3"], note:"3× Pro Bowl, Bengals WR legend"},
    {n:"Ken Anderson",    r:96, era:"1971–1986", pos:["QB"], note:"1981 NFL MVP, near-HOF career"},
  ],
  CLE:[
    {n:"Paul Brown",      r:97, era:"1946–1962", pos:["HC"], note:"Invented modern football — playbook, film study, face mask, HOF"},
    {n:"Jim Brown",       r:99, era:"1957–1965", pos:["RB"], note:"Greatest RB in NFL history, HOF"},
    {n:"Otto Graham",     r:98, era:"1946–1955", pos:["QB"], note:"10 straight championship games, HOF"},
    {n:"Ozzie Newsome",   r:97, era:"1978–1990", pos:["TE"], note:"HOF TE, Wizard of Oz, Browns legend"},
    {n:"Leroy Kelly",     r:96, era:"1964–1973", pos:["RB"], note:"3× rushing title, HOF, Browns star"},
  ],
  DAL:[
    {n:"Doomsday Defense",r:95, era:"1971–1977", pos:["DEF"], note:"Bob Lilly led D — 2 Super Bowls, fewest points allowed in NFC"},
    {n:"Jimmy Johnson",   r:96, era:"1989–1993", pos:["HC"], note:"2 consecutive Super Bowls, drafted the 90s dynasty, HOF"},
    {n:"Tom Landry",      r:97, era:"1960–1988", pos:["HC"], note:"2 Super Bowls, 20 consecutive winning seasons, HOF pioneer"},
    {n:"Roger Staubach",  r:98, era:"1969–1979", pos:["QB"], note:"2× Super Bowl MVP, HOF, Captain America"},
    {n:"Troy Aikman",     r:97, era:"1989–2000", pos:["QB"], note:"3× Super Bowl, HOF"},
    {n:"Emmitt Smith",    r:98, era:"1990–2002", pos:["RB"], note:"All-time NFL rushing leader, HOF"},
    {n:"Michael Irvin",   r:97, era:"1988–1999", pos:["WR1","WR2","WR3"], note:"The Playmaker, HOF, 3× Super Bowl"},
    {n:"Tony Dorsett",    r:96, era:"1977–1987", pos:["RB"], note:"HOF RB, Super Bowl XII champion"},
  ],
  DEN:[
    {n:"2015 Denver Defense",r:96, era:"2015", pos:["DEF"], note:"Von Miller & DeMarcus Ware — Super Bowl 50 MVP defense, held Cam Newton to 1 TD"},
    {n:"Mike Shanahan",   r:95, era:"1995–2008", pos:["HC"], note:"2 consecutive Super Bowls (XXXII, XXXIII), HOF"},
    {n:"John Elway",      r:97, era:"1983–1998", pos:["QB"], note:"2× Super Bowl, HOF, The Drive"},
    {n:"Terrell Davis",   r:97, era:"1995–2001", pos:["RB"], note:"Super Bowl XXXII MVP, HOF, 2000-yard rusher"},
    {n:"Shannon Sharpe",  r:96, era:"1990–2003", pos:["TE"], note:"3× Super Bowl TE, HOF"},
    {n:"Floyd Little",    r:96, era:"1967–1975", pos:["RB"], note:"The Franchise, HOF, first Broncos great"},
  ],
  DET:[
    {n:"Barry Sanders",   r:99, era:"1989–1998", pos:["RB"], note:"Most electric runner in NFL history"},
    {n:"Calvin Johnson",  r:98, era:"2007–2015", pos:["WR1","WR2","WR3"], note:"Megatron — greatest physical WR ever"},
    {n:"Bobby Layne",     r:96, era:"1950–1958", pos:["QB"], note:"3× NFL Champion, HOF Lions legend"},
    {n:"Herman Moore",    r:95, era:"1991–2001", pos:["WR1","WR2","WR3"], note:"Single-season reception record (then), Lions WR star"},
  ],
  GB:[
    {n:"Vince Lombardi",  r:99, era:"1959–1967", pos:["HC"], note:"5 NFL titles, 2 Super Bowls, invented modern coaching, symbol of excellence"},
    {n:"Bart Starr",      r:98, era:"1956–1971", pos:["QB"], note:"5× NFL champion, 2× Super Bowl MVP, HOF"},
    {n:"Brett Favre",     r:97, era:"1992–2007", pos:["QB"], note:"3× MVP, Super Bowl XXXI, HOF Packer"},
    {n:"Don Hutson",      r:98, era:"1935–1945", pos:["WR1","WR2","WR3"], note:"First great WR, 8× scoring title, HOF"},
    {n:"Sterling Sharpe", r:96, era:"1988–1994", pos:["WR1","WR2","WR3"], note:"Best Packer WR before illness cut career"},
    {n:"Paul Hornung",    r:96, era:"1957–1966", pos:["RB"], note:"Golden Boy, 5× NFL champion, HOF"},
  ],
  HOU:[
    {n:"Andre Johnson",   r:97, era:"2003–2014", pos:["WR1","WR2","WR3"], note:"Franchise WR, 2× receiving yards leader"},
    {n:"Arian Foster",    r:96, era:"2009–2015", pos:["RB"], note:"2010 rushing champion, Texans all-time RB"},
    {n:"Earl Campbell",   r:99, era:"1978–1984", pos:["RB"], note:"5× Pro Bowl, HOF, Houston Oilers legend"},
    {n:"Warren Moon",     r:98, era:"1984–1993", pos:["QB"], note:"HOF QB, 5× Grey Cup, Oilers legend"},
  ],
  IND:[
    {n:"Tony Dungy",      r:95, era:"2002–2008", pos:["HC"], note:"Super Bowl XLI, first Black HC to win Super Bowl, HOF"},
    {n:"Peyton Manning",  r:99, era:"1998–2011", pos:["QB"], note:"5× NFL MVP, 2× Super Bowl, greatest Colt"},
    {n:"Johnny Unitas",   r:98, era:"1956–1972", pos:["QB"], note:"The Original, greatest early QB, HOF"},
    {n:"Marvin Harrison", r:98, era:"1996–2008", pos:["WR1","WR2","WR3"], note:"Single-season receptions record (143), HOF"},
    {n:"Edgerrin James",  r:97, era:"1999–2005", pos:["RB"], note:"HOF, 2× rushing title, Manning–James duo"},
    {n:"Reggie Wayne",    r:96, era:"2001–2014", pos:["WR1","WR2","WR3"], note:"Six 1,000-yard seasons, Colts WR legend"},
    {n:"Marshall Faulk",  r:97, era:"1994–1998", pos:["RB"], note:"HOF, best all-purpose RB before STL days"},
  ],
  JAX:[
    {n:"Fred Taylor",     r:96, era:"1998–2008", pos:["RB"], note:"Fragile Fred, franchise all-time rusher"},
    {n:"Mark Brunell",    r:95, era:"1995–2003", pos:["QB"], note:"Led Jags to 2 AFC Championships"},
    {n:"Jimmy Smith",     r:96, era:"1995–2005", pos:["WR1","WR2","WR3"], note:"9× 1,000-yard seasons, Jags WR legend"},
  ],
  KC:[
    {n:"Hank Stram",      r:93, era:"1960–1974", pos:["HC"], note:"Super Bowl IV champion, AFL innovator, HOF"},
    {n:"Len Dawson",      r:96, era:"1962–1975", pos:["QB"], note:"Super Bowl IV MVP, HOF Chiefs legend"},
    {n:"Tony Gonzalez",   r:97, era:"1997–2008", pos:["TE"], note:"HOF, redefined the TE position, KC legend"},
    {n:"Marcus Allen",    r:97, era:"1993–1997", pos:["RB"], note:"HOF, revived career in KC, Super Bowl legend"},
  ],
  LV:[
    {n:"John Madden",     r:99, era:"1969–1978", pos:["HC"], note:"Super Bowl XI, 103-32-7 record, never had a losing season, most iconic coach in NFL history"},
    {n:"Bo Jackson",      r:99, era:"1987–1990", pos:["RB"], note:"Most athletic human in sports history"},
    {n:"Jerry Rice",      r:99, era:"2001–2004", pos:["WR1","WR2","WR3"], note:"Greatest WR ever, finished career in OAK"},
    {n:"Tim Brown",       r:96, era:"1988–2003", pos:["WR1","WR2","WR3"], note:"Mr. Raider, HOF, 14,934 career yards"},
    {n:"Ken Stabler",     r:97, era:"1970–1979", pos:["QB"], note:"The Snake, Super Bowl XI MVP, HOF"},
    {n:"Fred Biletnikoff",r:96, era:"1965–1978", pos:["WR1","WR2","WR3"], note:"Super Bowl XI MVP, HOF, sticky fingers"},
  ],
  LAC:[
    {n:"LaDainian Tomlinson",r:99,era:"2001–2009", pos:["RB"], note:"28 TDs in 2006, HOF, greatest Charger"},
    {n:"Dan Fouts",       r:98, era:"1973–1987", pos:["QB"], note:"HOF, Air Coryell architect, 3× passing leader"},
    {n:"Lance Alworth",   r:98, era:"1962–1970", pos:["WR1","WR2","WR3"], note:"Bambi, first AFL player in HOF, 7× All-AFL"},
    {n:"Kellen Winslow",  r:97, era:"1979–1987", pos:["TE"], note:"Revolutionized TE position, HOF"},
    {n:"Antonio Gates",   r:96, era:"2003–2018", pos:["TE"], note:"Most TD catches by a TE in NFL history (116)"},
  ],
  LAR:[
    {n:"George Allen",    r:94, era:"1966–1968", pos:["HC"], note:"Never had a losing season, built Fearsome Foursome era defenses"},
    {n:"Eric Dickerson",  r:98, era:"1983–1987", pos:["RB"], note:"Single-season rushing record (2,105), HOF"},
    {n:"Marshall Faulk",  r:98, era:"1999–2005", pos:["RB"], note:"Greatest Greatness show RB, HOF, 2000 MVP"},
    {n:"Kurt Warner",     r:97, era:"1998–2003", pos:["QB"], note:"Greatest Show on Turf QB, 2× MVP, HOF"},
    {n:"Isaac Bruce",     r:96, era:"1994–2007", pos:["WR1","WR2","WR3"], note:"HOF WR, Super Bowl XXXIV TD catch"},
    {n:"Torry Holt",      r:96, era:"1999–2007", pos:["WR1","WR2","WR3"], note:"Greatest Show co-star, HOF WR"},
  ],
  MIA:[
    {n:"1972 No-Name Defense",r:96, era:"1972", pos:["DEF"], note:"Anchored the only perfect 17-0 season in NFL history"},
    {n:"Don Shula",       r:97, era:"1970–1995", pos:["HC"], note:"Most wins in NFL history (347), 17-0 perfect season, HOF"},
    {n:"Dan Marino",      r:99, era:"1983–1999", pos:["QB"], note:"Greatest pure passer ever, HOF"},
    {n:"Larry Csonka",    r:97, era:"1968–1979", pos:["RB"], note:"HOF, 17-0 Super Bowl RB, Dolphins legend"},
    {n:"Paul Warfield",   r:97, era:"1970–1974", pos:["WR1","WR2","WR3"], note:"HOF WR, perfect 17-0 team member"},
    {n:"Bob Griese",      r:96, era:"1967–1980", pos:["QB"], note:"HOF, 2× Super Bowl, architect of 17-0"},
  ],
  MIN:[
    {n:"1969 Purple People Eaters",r:96, era:"1969–1977", pos:["DEF"], note:"Carl Eller, Alan Page, allowed 9.5 ppg in 1969, most feared front four"},
    {n:"Bud Grant",       r:94, era:"1967–1985", pos:["HC"], note:"4 Super Bowl appearances, 11 division titles, HOF"},
    {n:"Randy Moss",      r:99, era:"1998–2004", pos:["WR1","WR2","WR3"], note:"Most electrifying WR ever, HOF"},
    {n:"Adrian Peterson", r:97, era:"2007–2016", pos:["RB"], note:"2012 MVP, 2,097 yards, HOF"},
    {n:"Fran Tarkenton",  r:96, era:"1961–1978", pos:["QB"], note:"Original scrambler, HOF, Vikings legend"},
    {n:"Cris Carter",     r:97, era:"1990–2001", pos:["WR1","WR2","WR3"], note:"HOF WR, master of the sideline catch"},
    {n:"Chuck Foreman",   r:95, era:"1973–1979", pos:["RB"], note:"3× Pro Bowl, 5 rushing TDs in a game"},
  ],
  NE:[
    {n:"Bill Belichick",  r:99, era:"2000–2023", pos:["HC"], note:"6 Super Bowls, greatest coach in NFL history, architect of the dynasty"},
    {n:"Tom Brady",       r:99, era:"2000–2019", pos:["QB"], note:"7× Super Bowl champion, GOAT"},
    {n:"Rob Gronkowski",  r:99, era:"2010–2018", pos:["TE"], note:"Greatest TE in NFL history, HOF"},
    {n:"Randy Moss",      r:99, era:"2007–2010", pos:["WR1","WR2","WR3"], note:"86 TDs with Brady, 23 TDs in 2007"},
  ],
  NO:[
    {n:"Drew Brees",      r:98, era:"2006–2020", pos:["QB"], note:"Super Bowl XLIV MVP, 80,358 career yards, HOF"},
    {n:"Archie Manning",  r:96, era:"1971–1981", pos:["QB"], note:"The Manning of New Orleans, Saints icon"},
    {n:"Deuce McAllister",r:96, era:"2001–2008", pos:["RB"], note:"Saints all-time rusher, Super Bowl legend"},
  ],
  NYG:[
    {n:"1986 Giants Defense",r:96, era:"1985–1990", pos:["DEF"], note:"LT, Pepper Johnson — held opponents to 16.8 ppg, Super Bowl XX-era dominant"},
    {n:"Bill Parcells",   r:96, era:"1983–1990", pos:["HC"], note:"2 Super Bowls with NYG, turned around 4 franchises, HOF"},
    {n:"Frank Gifford",   r:96, era:"1952–1964", pos:["RB"], note:"HOF, 5 NFL titles, Giants legend"},
    {n:"Tiki Barber",     r:96, era:"1997–2006", pos:["RB"], note:"Giants all-time rusher, 3× Pro Bowl"},
    {n:"Eli Manning",     r:96, era:"2004–2019", pos:["QB"], note:"2× Super Bowl MVP, slayer of perfect seasons"},
  ],
  NYJ:[
    {n:"Joe Namath",      r:97, era:"1965–1976", pos:["QB"], note:"Super Bowl III MVP, guaranteed the win, HOF"},
    {n:"Don Maynard",     r:96, era:"1960–1972", pos:["WR1","WR2","WR3"], note:"First 10,000-yard receiver, HOF AFL star"},
    {n:"Curtis Martin",   r:97, era:"1998–2005", pos:["RB"], note:"HOF, 4× Pro Bowl, Jets all-time rusher"},
    {n:"Freeman McNeil",  r:95, era:"1981–1992", pos:["RB"], note:"3× Pro Bowl RB, Jets legend"},
  ],
  PHI:[
    {n:"2024 Eagles Defense",r:95, era:"2024", pos:["DEF"], note:"Super Bowl LIX champions, dominant line led by Jalen Carter and Nolan Smith"},
    {n:"Andy Reid",       r:96, era:"1999–2012", pos:["HC"], note:"5 NFC Championship games with PHI, offensive genius, HOF"},
    {n:"Steve Van Buren", r:97, era:"1944–1951", pos:["RB"], note:"HOF, led Eagles to back-to-back titles"},
    {n:"Harold Carmichael",r:96,era:"1971–1983", pos:["WR1","WR2","WR3"], note:"HOF WR, Eagles all-time receiver then"},
    {n:"Donovan McNabb",  r:96, era:"1999–2009", pos:["QB"], note:"5× Pro Bowl, Super Bowl XXXIX, Eagles legend"},
  ],
  PIT:[
    {n:"1978 Steel Curtain Defense",r:98, era:"1974–1979", pos:["DEF"], note:"4 Super Bowls, Mean Joe Greene & Lambert, most dominant defensive dynasty"},
    {n:"Chuck Noll",      r:97, era:"1969–1991", pos:["HC"], note:"4 Super Bowls in 6 years, built the Steel Curtain dynasty, HOF"},
    {n:"Mike Tomlin",     r:95, era:"2007–2023", pos:["HC"], note:"17 straight winning seasons, Super Bowl XLIII, never had a losing record"},
    {n:"Terry Bradshaw",   r:97, era:"1970–1983", pos:["QB"], note:"4× Super Bowl champ, 2× SB MVP, HOF"},
    {n:"Franco Harris",    r:97, era:"1972–1983", pos:["RB"], note:"Immaculate Reception, 4× Super Bowl, HOF"},
    {n:"Lynn Swann",       r:97, era:"1974–1982", pos:["WR1","WR2","WR3"], note:"Super Bowl X MVP, HOF, acrobatic catches"},
    {n:"John Stallworth",  r:96, era:"1974–1987", pos:["WR1","WR2","WR3"], note:"4× Super Bowl WR, HOF"},
    {n:"Jerome Bettis",    r:96, era:"1996–2005", pos:["RB"], note:"The Bus, HOF, 13,662 career yards"},
    {n:"Hines Ward",       r:96, era:"1998–2011", pos:["WR1","WR2","WR3"], note:"Super Bowl XL MVP, Steelers WR legend"},
  ],
  SF:[
    {n:"2019 49ers Defense",r:95, era:"2019", pos:["DEF"], note:"Nick Bosa rookie year, dominant D-line, NFC Championship run"},
    {n:"Bill Walsh",      r:97, era:"1979–1988", pos:["HC"], note:"3 Super Bowls, invented the West Coast offense, greatest offensive mind ever"},
    {n:"Jerry Rice",      r:99, era:"1985–2000", pos:["WR1","WR2","WR3"], note:"Greatest player in NFL history, 22,895 yards"},
    {n:"Joe Montana",     r:99, era:"1979–1992", pos:["QB"], note:"4× Super Bowl, 3× SB MVP, never threw an INT in SB"},
    {n:"Steve Young",     r:97, era:"1987–1999", pos:["QB"], note:"Super Bowl XXIX MVP (6 TDs), HOF"},
    {n:"Roger Craig",     r:96, era:"1983–1990", pos:["RB"], note:"First 1,000/1,000 season, 3× Super Bowl"},
  ],
  SEA:[
    {n:"2013 Legion of Boom",r:99, era:"2013", pos:["DEF"], note:"43-8 Super Bowl XLVIII — allowed 14.4 ppg, Sherman/Thomas/Chancellor/Browner, greatest defensive performance ever"},
    {n:"Legion of Boom Defense",r:97, era:"2012–2015", pos:["DEF"], note:"Sherman, Thomas, Chancellor — greatest secondary ever, back-to-back NFC titles"},
    {n:"Pete Carroll",    r:94, era:"2010–2024", pos:["HC"], note:"Super Bowl XLVIII, back-to-back NFC titles, built Legion of Boom"},
    {n:"Steve Largent",   r:97, era:"1976–1989", pos:["WR1","WR2","WR3"], note:"HOF WR, Seahawks legend, 7× Pro Bowl"},
    {n:"Marshawn Lynch",  r:97, era:"2010–2015", pos:["RB"], note:"Beast Mode, 2× NFC Champion, GOAT of Seattle"},
    {n:"Shaun Alexander",  r:96, era:"2000–2007", pos:["RB"], note:"2005 MVP, 27 TD season, Seahawks all-time rusher"},
  ],
  TB:[
    {n:"2002 Tampa Defense",r:96, era:"2002", pos:["DEF"], note:"Derrick Brooks & Warren Sapp, Tampa 2 perfection — Super Bowl XXXVII shutout"},
    {n:"Bruce Arians",    r:93, era:"2019–2021", pos:["HC"], note:"Led Bucs to Super Bowl LV title with Brady at 43"},
    {n:"Mike Alstott",    r:95, era:"1996–2006", pos:["RB"], note:"A-Train, beloved fullback, Buccaneers icon"},
  ],
  TEN:[
    {n:"Earl Campbell",   r:99, era:"1978–1984", pos:["RB"], note:"Tyler Rose, HOF, most powerful runner ever"},
    {n:"Warren Moon",     r:98, era:"1984–1993", pos:["QB"], note:"HOF QB, 5× Grey Cup, Oilers legend"},
    {n:"Steve McNair",    r:97, era:"1995–2005", pos:["QB"], note:"Co-MVP 2003, one play from SB, Titans legend"},
    {n:"Eddie George",    r:96, era:"1996–2003", pos:["RB"], note:"1000 yards 6 straight years, Titans icon"},
  ],
  WAS:[
    {n:"Joe Gibbs",       r:97, era:"1981–1993", pos:["HC"], note:"3 Super Bowls with 3 different QBs — only coach to do it, HOF"},
    {n:"Sammy Baugh",     r:98, era:"1937–1952", pos:["QB"], note:"Greatest early QB, HOF, 6 titles, MVP"},
    {n:"John Riggins",    r:97, era:"1976–1985", pos:["RB"], note:"Super Bowl XVII MVP, HOF, 166 yards"},
    {n:"Art Monk",        r:97, era:"1980–1993", pos:["WR1","WR2","WR3"], note:"HOF WR, then-record 106 catches in '84"},
    {n:"Joe Theismann",   r:95, era:"1974–1985", pos:["QB"], note:"Super Bowl XVII starter, NFC Player of Year"},
    {n:"Charley Taylor",  r:96, era:"1964–1977", pos:["WR1","WR2","WR3"], note:"HOF WR, Redskins all-time leader"},
  ],
};

// ─── WHEEL SVG ───────────────────────────────────────────────────────────────
// ESPN logo abbreviation overrides
const ESPN_ID = { WAS:"wsh" };
const espnLogo = id => {
  const eid = (ESPN_ID[id] || id).toLowerCase();
  return `https://a.espncdn.com/i/teamlogos/nfl/500/${eid}.png`;
};

function LogoFlasher({ spinning, targetTeam, onSpinEnd, onTick }) {
  const [displayIdx, setDisplayIdx] = useState(0);
  const [isLanded, setIsLanded] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!spinning) { setIsLanded(false); return; }
    setIsLanded(false);
    clearTimeout(timerRef.current);

    const targetIdx = TEAMS.findIndex(t => t.id === targetTeam.id);
    let idx = Math.floor(Math.random() * TEAMS.length);
    let speed = 55;
    let elapsed = 0;
    const TOTAL = 3600;

    const tick = () => {
      elapsed += speed;
      const remaining = TOTAL - elapsed;

      if (remaining <= 0) {
        setDisplayIdx(targetIdx);
        setIsLanded(true);
        onSpinEnd();
        return;
      }

      if      (elapsed < TOTAL * 0.55) speed = 55;
      else if (elapsed < TOTAL * 0.72) speed = 100;
      else if (elapsed < TOTAL * 0.85) speed = 200;
      else if (elapsed < TOTAL * 0.93) speed = 360;
      else                              speed = 520;

      idx = (idx + 1) % TEAMS.length;
      setDisplayIdx(idx);
      if (onTick) onTick(speed);
      timerRef.current = setTimeout(tick, speed);
    };

    timerRef.current = setTimeout(tick, speed);
    return () => clearTimeout(timerRef.current);
  }, [spinning]);

  const team = TEAMS[displayIdx];

  return (
    <div style={{
      width: 320, height: 320, borderRadius: 16,
      background: isLanded ? team.p : "#0e0e0e",
      border: isLanded ? `4px solid ${team.s}` : "4px solid #1e1e1e",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      transition: "background 0.35s, border-color 0.35s",
      boxShadow: isLanded
        ? `0 0 50px ${team.p}88, 0 0 100px ${team.p}33, inset 0 0 30px rgba(0,0,0,0.3)`
        : "0 0 20px rgba(0,0,0,0.6)",
      position: "relative", overflow: "hidden",
    }}>
      <style>{`
        @keyframes flashPulse { from{opacity:0.15} to{opacity:0} }
        @keyframes logoBounce { 0%{transform:scale(0.7)} 65%{transform:scale(1.1)} 100%{transform:scale(1)} }
        @keyframes nameSlide { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {spinning && !isLanded && (
        <div key={displayIdx} style={{
          position:"absolute", inset:0, borderRadius:12,
          background:"rgba(255,255,255,0.08)",
          animation:"flashPulse 0.1s ease-out forwards",
          pointerEvents:"none",
        }}/>
      )}

      <img
        key={isLanded ? "l"+team.id : "f"+displayIdx}
        src={espnLogo(team.id)}
        alt={team.name}
        style={{
          width: isLanded ? 185 : 155,
          height: isLanded ? 185 : 155,
          objectFit: "contain",
          filter: spinning && !isLanded
            ? "brightness(0.65) saturate(0.8)"
            : "drop-shadow(0 6px 16px rgba(0,0,0,0.55))",
          animation: isLanded ? "logoBounce 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards" : "none",
          transition: "width 0.2s, height 0.2s",
        }}
        onError={e => { e.target.style.display = "none"; }}
      />

      {isLanded && (
        <div style={{
          marginTop: 14, fontFamily:"'Oswald',sans-serif",
          fontSize: 15, fontWeight: 700, letterSpacing: 2,
          color: team.s, textTransform: "uppercase",
          textShadow: "0 1px 6px rgba(0,0,0,0.6)",
          animation: "nameSlide 0.4s 0.2s ease-out both",
        }}>
          {team.city} {team.name}
        </div>
      )}

      {!spinning && !isLanded && (
        <div style={{
          fontFamily:"'Oswald',sans-serif", fontSize:12,
          color:"#2a2a2a", letterSpacing:4, marginTop:8,
        }}>TAP TO SPIN</div>
      )}
    </div>
  );
}

// ─── RATING BAR ──────────────────────────────────────────────────────────────
function RatingBar({r, gold}) {
  return (
    <span style={{display:"flex",alignItems:"center",gap:8}}>
      <span style={{width:60,height:5,background:"#222",borderRadius:3,overflow:"hidden",display:"inline-block"}}>
        <span style={{width:`${r}%`,height:"100%",background:gold?"#FFD700":"#E31837",display:"block",borderRadius:3}}/>
      </span>
      <span style={{fontFamily:"'Oswald',sans-serif",fontSize:14,color:gold?"#FFD700":"#aaa"}}>{r}</span>
    </span>
  );
}

// ─── PLAYER HEADSHOT ─────────────────────────────────────────────────────────
function PlayerHeadshot({ name, headshotMap, size=38, isLegend=false }) {
  const key = name.toLowerCase().replace(/[^a-z0-9]/g,"");
  const src = headshotMap[key] || null;
  const initials = name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  const [err, setErr] = useState(false);
  return src && !err ? (
    <img src={src} alt={name} onError={()=>setErr(true)}
      style={{width:size,height:size,borderRadius:"50%",objectFit:"cover",objectPosition:"top",
        border:`2px solid ${isLegend?"#FFD700":"#2a2a2a"}`,flexShrink:0,background:"#111"}}/>
  ) : (
    <div style={{width:size,height:size,borderRadius:"50%",background:isLegend?"#2a1a00":"#1a1a1a",
      border:`2px solid ${isLegend?"#FFD700":"#2a2a2a"}`,display:"flex",alignItems:"center",
      justifyContent:"center",flexShrink:0,
      fontFamily:"'Oswald',sans-serif",fontSize:size*0.35,color:isLegend?"#FFD700":"#555",fontWeight:700}}>
      {initials}
    </div>
  );
}


// ─── SOUND ENGINE ────────────────────────────────────────────────────────────
const SFX = (() => {
  let ctx = null;
  const getCtx = () => {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  };

  let _muted = false;
  const setMuted = (v) => { _muted = v; };
  const play = (fn) => { if (_muted) return; try { fn(getCtx()); } catch(e) {} };

  // Tick sound synced to each logo flash
  const spinTick = (speedMs) => play(c => {
    const now = c.currentTime;
    const o = c.createOscillator();
    const g = c.createGain();
    o.connect(g); g.connect(c.destination);
    // Fast = higher pitch, loud. Slow = lower pitch, quieter
    const t = Math.min(speedMs / 520, 1); // 0=fast, 1=slow
    o.type = "square";
    o.frequency.value = 480 - t * 200;  // 480hz fast → 280hz slow
    const vol = 0.13 - t * 0.06;        // louder when fast
    const dur = 0.018 + t * 0.04;       // shorter click when fast
    g.gain.setValueAtTime(vol, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);
    o.start(now); o.stop(now + dur + 0.005);
  });
  const startSpin = () => {};  // no-op, tick is driven by LogoFlasher
  const stopSpin = () => {};   // no-op

  // Landing — triumphant thud + shimmer
  const land = (isGood) => play(c => {
    const now = c.currentTime;
    // bass thud
    const o1 = c.createOscillator();
    const g1 = c.createGain();
    o1.connect(g1); g1.connect(c.destination);
    o1.type = "sine";
    o1.frequency.setValueAtTime(isGood ? 220 : 140, now);
    o1.frequency.exponentialRampToValueAtTime(isGood ? 110 : 60, now + 0.3);
    g1.gain.setValueAtTime(0.5, now);
    g1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    o1.start(now); o1.stop(now + 0.4);
    // shimmer
    [0, 0.05, 0.1].forEach((t, i) => {
      const o2 = c.createOscillator();
      const g2 = c.createGain();
      o2.connect(g2); g2.connect(c.destination);
      o2.type = "triangle";
      o2.frequency.value = isGood ? [880, 1100, 1320][i] : [440, 550, 660][i];
      g2.gain.setValueAtTime(0.12, now + t);
      g2.gain.exponentialRampToValueAtTime(0.001, now + t + 0.25);
      o2.start(now + t); o2.stop(now + t + 0.25);
    });
  });

  // Pick regular player — satisfying click + tone
  const pick = () => play(c => {
    const now = c.currentTime;
    const o = c.createOscillator();
    const g = c.createGain();
    o.connect(g); g.connect(c.destination);
    o.type = "triangle";
    o.frequency.setValueAtTime(660, now);
    o.frequency.exponentialRampToValueAtTime(880, now + 0.1);
    g.gain.setValueAtTime(0.2, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    o.start(now); o.stop(now + 0.18);
  });

  // Legend pick — golden fanfare
  const legend = () => play(c => {
    const now = c.currentTime;
    [[0, 523], [0.1, 659], [0.2, 784], [0.3, 1047]].forEach(([t, freq]) => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.connect(g); g.connect(c.destination);
      o.type = "sine";
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.25, now + t);
      g.gain.exponentialRampToValueAtTime(0.001, now + t + 0.35);
      o.start(now + t); o.stop(now + t + 0.35);
    });
  });

  // Button click — subtle tick
  const click = () => play(c => {
    const now = c.currentTime;
    const o = c.createOscillator();
    const g = c.createGain();
    o.connect(g); g.connect(c.destination);
    o.type = "sine";
    o.frequency.value = 800;
    g.gain.setValueAtTime(0.06, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    o.start(now); o.stop(now + 0.06);
  });

  // Respin — whoosh down
  const respin = () => play(c => {
    const now = c.currentTime;
    const o = c.createOscillator();
    const g = c.createGain();
    o.connect(g); g.connect(c.destination);
    o.type = "sawtooth";
    o.frequency.setValueAtTime(600, now);
    o.frequency.exponentialRampToValueAtTime(150, now + 0.3);
    g.gain.setValueAtTime(0.15, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    o.start(now); o.stop(now + 0.3);
  });

  // Game over — victory fanfare
  const victory = () => play(c => {
    const now = c.currentTime;
    [[0,392],[0.15,523],[0.3,659],[0.45,784],[0.6,1047],[0.75,1047]].forEach(([t,freq]) => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.connect(g); g.connect(c.destination);
      o.type = "sine";
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.3, now + t);
      g.gain.exponentialRampToValueAtTime(0.001, now + t + 0.4);
      o.start(now + t); o.stop(now + t + 0.4);
    });
  });

  // NFL Draft-style intro fanfare — ascending brass chime
  const intro = () => play(c => {
    const now = c.currentTime;
    // 4-note ascending brass fanfare
    const notes = [
      {t:0,    freq:392, dur:0.18, gain:0.4},  // G4
      {t:0.18, freq:523, dur:0.18, gain:0.4},  // C5
      {t:0.36, freq:659, dur:0.18, gain:0.4},  // E5
      {t:0.54, freq:784, dur:0.5,  gain:0.5},  // G5 — held
    ];
    notes.forEach(({t, freq, dur, gain}) => {
      // Brass body
      const o = c.createOscillator();
      const g = c.createGain();
      const dist = c.createWaveShaper();
      const curve = new Float32Array(256);
      for (let i=0;i<256;i++) { const x=i*2/256-1; curve[i]=x*(1+0.8*Math.abs(x))/(1+0.8); }
      dist.curve = curve;
      o.connect(dist); dist.connect(g); g.connect(c.destination);
      o.type = "sawtooth";
      o.frequency.value = freq;
      g.gain.setValueAtTime(0, now + t);
      g.gain.linearRampToValueAtTime(gain, now + t + 0.04);
      g.gain.setValueAtTime(gain, now + t + dur - 0.08);
      g.gain.linearRampToValueAtTime(0, now + t + dur);
      o.start(now + t); o.stop(now + t + dur + 0.05);
      // Harmonic shimmer on top
      const o2 = c.createOscillator();
      const g2 = c.createGain();
      o2.connect(g2); g2.connect(c.destination);
      o2.type = "sine";
      o2.frequency.value = freq * 2;
      g2.gain.setValueAtTime(0, now + t);
      g2.gain.linearRampToValueAtTime(gain * 0.15, now + t + 0.04);
      g2.gain.linearRampToValueAtTime(0, now + t + dur);
      o2.start(now + t); o2.stop(now + t + dur + 0.05);
    });
    // Low reverb tail
    const sub = c.createOscillator();
    const subG = c.createGain();
    sub.connect(subG); subG.connect(c.destination);
    sub.type = "sine";
    sub.frequency.value = 98;
    subG.gain.setValueAtTime(0.2, now + 0.54);
    subG.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
    sub.start(now + 0.54); sub.stop(now + 1.5);
  });

  // Fart sound for the Jaguars 🤌
  const fart = () => play(c => {
    const now = c.currentTime;
    const bufSize = c.sampleRate * 0.6;
    const buf = c.createBuffer(1, bufSize, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufSize, 0.4);
    }
    const noise = c.createBufferSource();
    noise.buffer = buf;
    const filter = c.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(180, now);
    filter.frequency.exponentialRampToValueAtTime(60, now + 0.5);
    filter.Q.value = 2.5;
    const g = c.createGain();
    g.gain.setValueAtTime(1.2, now);
    g.gain.setValueAtTime(0.9, now + 0.05);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    // wobble for wetness
    const lfo = c.createOscillator();
    const lfoG = c.createGain();
    lfo.frequency.value = 22;
    lfoG.gain.value = 40;
    lfo.connect(lfoG); lfoG.connect(filter.frequency);
    noise.connect(filter); filter.connect(g); g.connect(c.destination);
    noise.start(now); noise.stop(now + 0.6);
    lfo.start(now); lfo.stop(now + 0.6);
  });

  return { startSpin, stopSpin, land, pick, legend, click, respin, victory, setMuted, intro, fart };
})();

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
const mkRoster = () => Object.fromEntries(SLOTS.map(s=>[s.key,null]));

export default function App() {
  const [phase, setPhase]   = useState("setup");
  const [numP, setNumP]     = useState(2);
  const [names, setNames]   = useState(["Player 1","Player 2","Player 3","Player 4"]);
  const [players, setPlayers] = useState(null);
  const [pidx, setPidx]     = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [landed, setLanded] = useState(null);
  const [modal, setModal]   = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [lbLoaded, setLbLoaded] = useState(false);
  const [showLb, setShowLb] = useState(false);
  const [spinTarget, setSpinTarget] = useState(null);
  const [muted, setMuted] = useState(false);
  const [sessionId, setSessionId] = useState(() => Math.random().toString(36).slice(2,8));
  useEffect(() => { SFX.setMuted(muted); }, [muted]);
  const [headshotMap, setHeadshotMap] = useState({});

  // ── fetch ESPN headshots for all teams on mount ──
  useEffect(() => {
    const ESPN_TEAM = { WAS:"wsh", LV:"lv", NE:"ne", NO:"no", SF:"sf", TB:"tb", GB:"gb", KC:"kc", JAX:"jax" };
    const normalize = name => name.toLowerCase().replace(/[^a-z0-9]/g,"");

    // Hardcoded ESPN headshot IDs for current NFL head coaches (reliable fallback)
    const COACH_IDS = {
      "andy reid":6760, "john harbaugh":4600, "sean mcdermott":3047655,
      "ben johnson":5093879, "zac taylor":3046660, "todd monken":3046849,
      "mike mccarthy":4400, "sean payton":1900, "dan campbell":2576,
      "matt lafleur":4047616, "demeco ryans":9604, "shane steichen":4047628,
      "doug pederson":8439, "jim harbaugh":3050, "sean mcvay":3059893,
      "mike mcdaniel":4047619, "kevin oconnell":4046462, "jerod mayo":11106,
      "dennis allen":4602, "brian daboll":4046440, "aaron glenn":3027,
      "nick sirianni":4046536, "mike tomlin":1300, "kyle shanahan":3046843,
      "mike macdonald":4047969, "todd bowles":4046442, "brian callahan":4046613,
      "dan quinn":3046854, "jonathan gannon":4046537, "raheem morris":4046449,
      "dave canales":4047624, "pete carroll":2500,
    };

    const abbrs = TEAMS.map(t => (ESPN_TEAM[t.id] || t.id).toLowerCase());

    const rosterFetches = abbrs.map(a =>
      fetch(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${a}/roster`)
        .then(r => r.json()).catch(() => null)
    );
    const teamFetches = abbrs.map(a =>
      fetch(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${a}`)
        .then(r => r.json()).catch(() => null)
    );
    const coachesFetch = fetch(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/coaches`)
      .then(r => r.json()).catch(() => null);

    Promise.all([Promise.all(rosterFetches), Promise.all(teamFetches), coachesFetch])
      .then(([rosterResults, teamResults, coachesData]) => {
        const map = {};

        // seed with hardcoded coach IDs first (lowest priority — API overwrites)
        Object.entries(COACH_IDS).forEach(([name, id]) => {
          map[name] = `https://a.espncdn.com/i/headshots/nfl/players/full/${id}.png`;
        });

        const add = (firstName, lastName, fullName, obj) => {
          const url = obj?.headshot?.href || obj?.photo?.href || null;
          if (!url) return;
          if (fullName) map[normalize(fullName)] = url;
          else if (firstName && lastName) map[normalize(`${firstName} ${lastName}`)] = url;
        };

        // players from roster
        rosterResults.forEach(data => {
          if (!data) return;
          (data.athletes || []).forEach(group => {
            (group.items || []).forEach(a => {
              if (a.fullName && a.headshot?.href) map[normalize(a.fullName)] = a.headshot.href;
            });
          });
        });

        // coaches from team pages
        teamResults.forEach(data => {
          if (!data) return;
          const coaches = data?.team?.coaches || data?.coaches || [];
          coaches.forEach(c => {
            const fn = c.firstName || c.first_name || "";
            const ln = c.lastName || c.last_name || "";
            const full = c.fullName || c.name || (fn && ln ? `${fn} ${ln}` : "");
            add(fn, ln, full, c);
          });
        });

        // league-wide coaches list
        if (coachesData) {
          const list = coachesData?.items || coachesData?.coaches || coachesData?.athletes || [];
          list.forEach(c => {
            const fn = c.firstName || c.first_name || "";
            const ln = c.lastName || c.last_name || "";
            const full = c.fullName || c.name || (fn && ln ? `${fn} ${ln}` : "");
            add(fn, ln, full, c);
          });
        }

        setHeadshotMap(map);
      });
  }, []);

  // ── leaderboard storage ──
  const loadLeaderboard = async () => {
    try {
      const res = await window.storage.list("lb:", true);
      if (res && res.keys && res.keys.length > 0) {
        const entries = await Promise.all(res.keys.map(async k => {
          try { const r = await window.storage.get(k, true); return r ? JSON.parse(r.value) : null; }
          catch { return null; }
        }));
        setLeaderboard(entries.filter(Boolean).sort((a,b)=>b.score-a.score).slice(0,15));
      }
      setLbLoaded(true);
    } catch { setLbLoaded(true); }
  };

  const saveToLeaderboard = async (winnerName, sc) => {
    try {
      const entry = { name: winnerName, score: Math.round(sc*10)/10, date: new Date().toLocaleDateString() };
      await window.storage.set("lb:"+Date.now(), JSON.stringify(entry), true);
    } catch {}
  };

  // ── global player pool (shared across all devices) ──
  const [claimed, setClaimed] = useState(new Set());
  const [poolLoading, setPoolLoading] = useState(false);

  const claimKey = (teamId, playerName) => `pool:${sessionId}:${teamId}:${playerName.replace(/[\s']/g,"_")}`;

  const loadClaimed = async () => {
    try {
      const res = await window.storage.list(`pool:${sessionId}:`, true);
      if (res && res.keys) {
        setClaimed(new Set(res.keys));
      }
    } catch {}
  };

  const claimPlayer = async (teamId, playerName) => {
    const key = claimKey(teamId, playerName);
    try { await window.storage.set(key, "1", true); } catch {}
    setClaimed(prev => new Set([...prev, key]));
  };

  const isClaimed = (teamId, playerName) =>
    claimed.has(claimKey(teamId, playerName));

  // auto-reset pool on new game start (called from START DRAFT)
  const resetPool = async () => {
    try {
      const res = await window.storage.list(`pool:${sessionId}:`, true);
      if (res && res.keys) {
        await Promise.all(res.keys.map(k => window.storage.delete(k, true).catch(()=>{})));
      }
      setClaimed(new Set());
    } catch {}
  };

  // poll for pool updates every 8s so devices stay in sync
  useEffect(()=>{
    loadClaimed();
    const id = setInterval(loadClaimed, 8000);
    return ()=>clearInterval(id);
  }, []);

  // ── helpers ──
  const score = roster => SLOTS.reduce((s,sl)=>{
    const p=roster[sl.key]; return p ? s+p.r*sl.weight : s;
  },0);
  const filledCount = p => SLOTS.filter(s=>p.roster[s.key]!==null).length;
  const emptySlots  = p => SLOTS.filter(s=>p.roster[s.key]===null);



  // ── spin ──
  const spin = () => {
    if (spinning || landed) return;
    SFX.click();
    const target = TEAMS[Math.floor(Math.random() * TEAMS.length)];
    setSpinTarget(target);
    setSpinning(true);
    SFX.startSpin();
  };

  const handleSpinEnd = () => {
    SFX.stopSpin();
    setSpinning(false);
    setLanded(spinTarget);
    if (spinTarget && (spinTarget.id === "JAX" || spinTarget.id === "TEN")) {
      SFX.fart();
    } else {
      SFX.land(true);
    }
  };

  const reSpin = () => {
    if (spinning) return;
    SFX.respin();
    setPlayers(prev=>prev.map((p,i)=>i===pidx?{...p,reSpinUsed:true}:p));
    setLanded(null);
    const target = TEAMS[Math.floor(Math.random() * TEAMS.length)];
    setSpinTarget(target);
    setSpinning(true);
    SFX.startSpin();
  };

  // ── pick ──
  const pick = (slot, player, isLegend) => {
    // claim globally (non-legends are real players; legends skip claiming)
    if (!isLegend && landed) {
      if (isClaimed(landed.id, player.n)) return; // hard block double-pick
      claimPlayer(landed.id, player.n);
    }
    if (isLegend) SFX.legend(); else SFX.pick();
    let updated;
    setPlayers(prev=>{
      updated = prev.map((p,i)=>i!==pidx?p:{
        ...p,
        roster:{...p.roster,[slot]:{...player,isLegend}},
        legendTokens: isLegend?p.legendTokens-1:p.legendTokens,
      });
      return updated;
    });
    setModal(null);
    setLanded(null);
    setTimeout(()=>advance(updated||players),0);
  };

  const advance = (ps) => {
    if(ps.every(p=>SLOTS.every(s=>p.roster[s.key]!==null))){
      const scored = ps.map(p=>({...p,score:SLOTS.reduce((s,sl)=>{const pk=p.roster[sl.key];return pk?s+pk.r*sl.weight:s;},0)})).sort((a,b)=>b.score-a.score);
      saveToLeaderboard(scored[0].name, scored[0].score).then(()=>loadLeaderboard());
      SFX.victory(); setPhase("results"); return;
    }
    let next=(pidx+1)%ps.length, tries=0;
    while(SLOTS.every(s=>ps[next].roster[s.key]!==null)&&tries<ps.length){ next=(next+1)%ps.length; tries++; }
    setPidx(next); setLanded(null);
  };

  // ── setup ──
  if (phase==="setup") return (
    <div style={S.root}>
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Barlow:wght@300;400;500&display=swap" rel="stylesheet"/>
      <button onClick={()=>setMuted(m=>!m)} style={{
        position:"fixed",top:14,right:14,zIndex:9999,
        background:"rgba(20,20,20,0.85)",border:"1px solid #333",
        borderRadius:"50%",width:40,height:40,cursor:"pointer",
        display:"flex",alignItems:"center",justifyContent:"center",
        fontSize:18,backdropFilter:"blur(4px)",transition:"all 0.2s",
        boxShadow:"0 2px 8px rgba(0,0,0,0.4)"
      }} title={muted?"Unmute":"Mute"}>
        {muted ? "🔇" : "🔊"}
      </button>

      <div style={S.setup}>
        <div style={S.badge}>🏈 NFL LEGEND DRAFT</div>
        <h1 style={S.title}>WHEEL OF<br/><span style={S.accent}>DESTINY</span></h1>
        <p style={S.sub}>Spin for teams. Draft legends. Build the ultimate franchise.</p>
        <div style={S.card}>
          <div style={S.fLabel}>NUMBER OF PLAYERS</div>
          <div style={S.numRow}>
            {[1,2,3,4].map(n=>(
              <button key={n} onClick={()=>setNumP(n)} style={{...S.numBtn,...(numP===n?S.numBtnOn:{})}}>
                {n}
              </button>
            ))}
          </div>
          {Array.from({length:numP},(_,i)=>(
            <div key={i} style={{marginBottom:14}}>
              <div style={S.fLabel}>PLAYER {i+1}</div>
              <input style={S.inp} value={names[i]||`Player ${i+1}`}
                onChange={e=>{const u=[...names];u[i]=e.target.value;setNames(u);}}
                placeholder={`Player ${i+1} name`}/>
            </div>
          ))}
          <button style={S.bigBtn} onClick={async ()=>{
            await resetPool();
            setPlayers(names.slice(0,numP).map((name,i)=>({id:i,name,roster:mkRoster(),legendTokens:2,reSpinUsed:false})));
            const newSession = Math.random().toString(36).slice(2,8); setSessionId(newSession); setPidx(0); setLanded(null); setPhase("game");
          }}>START DRAFT</button>
        </div>
        <div style={S.rules}>
          <div style={S.fLabel}>HOW IT WORKS</div>
          <div style={{color:"#555",fontSize:13,lineHeight:1.7}}>
            Spin to land on an NFL team and pick from their current roster for that slot.
            You get <strong style={{color:"#e8e8e8"}}>2 Legend Tokens ⭐</strong> — spend one to draft any retired great <em>from that same team</em> instead (all legends rated 95–99).
            You also get <strong style={{color:"#e8e8e8"}}>1 Re-Spin 🔄</strong> — burn it if you land on a bad team.
            Highest weighted score wins.
          </div>
        </div>

        {/* setup leaderboard */}
        <div style={{marginTop:16}}>
          <button style={{...S.bigBtn,background:"#0d0d0d",border:"1px solid #2a2a2a",color:"#FFD700",letterSpacing:2}}
            onClick={()=>{if(!lbLoaded)loadLeaderboard();setShowLb(v=>!v);}}>
            {showLb?"▲ HIDE LEADERBOARD":"🏅 ALL-TIME LEADERBOARD"}
          </button>
          {showLb&&(
            <div style={{background:"#0d0d0d",border:"1px solid #1e1e1e",borderTop:"none",borderRadius:"0 0 8px 8px",overflow:"hidden",marginTop:0}}>
              {!lbLoaded
                ? <div style={{padding:20,textAlign:"center",color:"#444",fontSize:13}}>Loading…</div>
                : leaderboard.length===0
                  ? <div style={{padding:20,textAlign:"center",color:"#333",fontSize:13}}>No scores yet — you're first!</div>
                  : leaderboard.map((entry,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"11px 18px",borderBottom:"1px solid #141414",background:i===0?"#110d00":"transparent"}}>
                      <span style={{fontFamily:"'Oswald',sans-serif",fontSize:15,color:i===0?"#FFD700":i===1?"#aaa":i===2?"#cd7f32":"#333",width:24,textAlign:"center",fontWeight:700}}>
                        {i===0?"🥇":i===1?"🥈":i===2?"🥉":`#${i+1}`}
                      </span>
                      <span style={{flex:1,fontSize:14,color:i===0?"#e8e8e8":"#777",fontWeight:i===0?600:400}}>{entry.name}</span>
                      <span style={{fontFamily:"'Oswald',sans-serif",fontSize:17,color:i===0?"#FFD700":"#555",fontWeight:700}}>{entry.score}</span>
                      <span style={{fontSize:11,color:"#2a2a2a",minWidth:60,textAlign:"right"}}>{entry.date}</span>
                    </div>
                  ))
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ── results ──
  if (phase==="results") {
    const sorted=[...players].map(p=>({...p,score:score(p.roster)})).sort((a,b)=>b.score-a.score);
    return (
      <div style={S.root}>
        <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Barlow:wght@300;400;500&display=swap" rel="stylesheet"/>
      <button onClick={()=>setMuted(m=>!m)} style={{
        position:"fixed",top:14,right:14,zIndex:9999,
        background:"rgba(20,20,20,0.85)",border:"1px solid #333",
        borderRadius:"50%",width:40,height:40,cursor:"pointer",
        display:"flex",alignItems:"center",justifyContent:"center",
        fontSize:18,backdropFilter:"blur(4px)",transition:"all 0.2s",
        boxShadow:"0 2px 8px rgba(0,0,0,0.4)"
      }} title={muted?"Unmute":"Mute"}>
        {muted ? "🔇" : "🔊"}
      </button>

        <div style={S.setup}>
          <div style={S.badge}>🏆 FINAL STANDINGS</div>
          <h1 style={S.title}><span style={S.accent}>{sorted[0].name.toUpperCase()}</span><br/>WINS THE DRAFT</h1>
          {sorted.map((p,rank)=>(
            <div key={p.id} style={{...S.resCard,...(rank===0?S.resCardWin:{})}}>
              <div style={S.resHead}>
                <span style={{fontSize:26}}>{["🥇","🥈","🥉"][rank]||`#${rank+1}`}</span>
                <span style={{...S.resName}}>{p.name}</span>
                <span style={S.resScore}>{p.score.toFixed(1)}</span>
              </div>
              <div style={S.resGrid}>
                {SLOTS.map(sl=>{
                  const pick=p.roster[sl.key];
                  return (
                    <div key={sl.key} style={S.resSlot}>
                      <div style={S.resSlotLabel}>{sl.label} <span style={{color:"#333"}}>×{sl.weight}</span></div>
                      {pick?(
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <PlayerHeadshot name={pick.n} size={32} isLegend={pick.isLegend} headshotMap={headshotMap}/>
                          {pick.isLegend&&<span style={{fontSize:11}}>⭐</span>}
                          <span style={{fontSize:13,color:pick.isLegend?"#FFD700":"#ccc"}}>{pick.n}</span>
                          <span style={{fontFamily:"'Oswald',sans-serif",fontSize:12,color:pick.isLegend?"#FFD700":"#3a9a3a",marginLeft:2}}>{pick.r}</span>
                        </div>
                      ):<span style={{color:"#444",fontSize:12}}>Empty</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <div style={{fontSize:12,color:"#333",textAlign:"center",margin:"12px 0 24px"}}>
            Weights: QB ×1.5 · DEF ×1.3 · RB ×1.2 · HC ×1.15 · TE ×1.1 · WR ×1.0 · Ratings from 2025 PFF grades
          </div>

          {/* ── leaderboard ── */}
          <div style={{marginBottom:24}}>
            <button style={{...S.bigBtn,background:"#0d0d0d",border:"1px solid #2a2a2a",color:"#FFD700",letterSpacing:2,marginBottom:0}}
              onClick={()=>{if(!lbLoaded)loadLeaderboard();setShowLb(v=>!v);}}>
              {showLb?"▲ HIDE LEADERBOARD":"🏅 ALL-TIME LEADERBOARD"}
            </button>
            {showLb&&(
              <div style={{background:"#0d0d0d",border:"1px solid #1e1e1e",borderTop:"none",borderRadius:"0 0 8px 8px",overflow:"hidden"}}>
                {!lbLoaded
                  ? <div style={{padding:20,textAlign:"center",color:"#444",fontSize:13}}>Loading…</div>
                  : leaderboard.length===0
                    ? <div style={{padding:20,textAlign:"center",color:"#333",fontSize:13}}>No scores yet — you're first!</div>
                    : leaderboard.map((entry,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"11px 18px",borderBottom:"1px solid #141414",background:i===0?"#110d00":"transparent"}}>
                        <span style={{fontFamily:"'Oswald',sans-serif",fontSize:15,color:i===0?"#FFD700":i===1?"#aaa":i===2?"#cd7f32":"#333",width:24,textAlign:"center",fontWeight:700}}>
                          {i===0?"🥇":i===1?"🥈":i===2?"🥉":`#${i+1}`}
                        </span>
                        <span style={{flex:1,fontSize:14,color:i===0?"#e8e8e8":"#777",fontWeight:i===0?600:400}}>{entry.name}</span>
                        <span style={{fontFamily:"'Oswald',sans-serif",fontSize:17,color:i===0?"#FFD700":"#555",fontWeight:700}}>{entry.score}</span>
                        <span style={{fontSize:11,color:"#2a2a2a",minWidth:60,textAlign:"right"}}>{entry.date}</span>
                      </div>
                    ))
                }
              </div>
            )}
          </div>

          <button style={S.bigBtn} onClick={()=>{setPhase("setup");setLanded(null);setSpinning(false);setShowLb(false);}}>PLAY AGAIN</button>
        </div>
      </div>
    );
  }

  // ── game ──
  const cur = players[pidx];
  const empty = emptySlots(cur);
  const done = empty.length===0;
  const teamLegends = landed ? (TEAM_LEGENDS[landed.id]||[]) : [];

  return (
    <div style={S.root}>
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Barlow:wght@300;400;500&display=swap" rel="stylesheet"/>
      <button onClick={()=>setMuted(m=>!m)} style={{
        position:"fixed",top:14,right:14,zIndex:9999,
        background:"rgba(20,20,20,0.85)",border:"1px solid #333",
        borderRadius:"50%",width:40,height:40,cursor:"pointer",
        display:"flex",alignItems:"center",justifyContent:"center",
        fontSize:18,backdropFilter:"blur(4px)",transition:"all 0.2s",
        boxShadow:"0 2px 8px rgba(0,0,0,0.4)"
      }} title={muted?"Unmute":"Mute"}>
        {muted ? "🔇" : "🔊"}
      </button>


      {/* header */}
      <div style={S.hdr}>
        <div style={{fontFamily:"'Oswald',sans-serif",fontSize:18,color:"#fff",letterSpacing:1}}>🏈 NFL WHEEL DRAFT</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {players.map((p,i)=>(
            <div key={p.id} style={{...S.tab,...(i===pidx?S.tabOn:{})}}>
              {p.name}<span style={{fontSize:11,color:i===pidx?"#aaa":"#444",marginLeft:6}}>{filledCount(p)}/{SLOTS.length}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={S.body}>
        {/* WHEEL */}
        <div style={S.wheelCol}>
          <div style={{fontFamily:"'Oswald',sans-serif",fontSize:20,color:"#fff",letterSpacing:1,marginBottom:8}}>
            {done?`${cur.name} is done!`:`${cur.name}'s Turn`}
          </div>

          {/* tokens */}
          <div style={{display:"flex",gap:16,marginBottom:12,fontSize:13}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{color:"#555",letterSpacing:2,fontSize:10}}>LEGENDS</span>
              {[0,1].map(i=><span key={i} style={{fontSize:18,opacity:i<cur.legendTokens?1:0.18}}>⭐</span>)}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{color:"#555",letterSpacing:2,fontSize:10}}>RE-SPIN</span>
              <span style={{fontSize:18,opacity:cur.reSpinUsed?0.18:1}}>🔄</span>
            </div>
          </div>

          <div style={{position:"relative",display:"flex",justifyContent:"center"}}>
            <LogoFlasher spinning={spinning} targetTeam={spinTarget || TEAMS[0]} onSpinEnd={handleSpinEnd} onTick={SFX.spinTick}/>
          </div>

          {/* spin / respin buttons */}
          {!done && (
            <div style={{display:"flex",gap:10,width:"100%",maxWidth:380,marginTop:12}}>
              <button style={{...S.spinBtn,flex:1,...(spinning||landed?S.spinOff:{})}}
                onClick={spin} disabled={spinning||!!landed}>
                {spinning?"SPINNING…":landed?`${landed.city} ${landed.name}`:"SPIN"}
              </button>
              {!cur.reSpinUsed && landed && !spinning && (
                <button style={S.reSpinBtn} onClick={reSpin}>🔄 RE-SPIN</button>
              )}
            </div>
          )}

          {landed && !spinning && (
            <div style={{...S.landedBanner,background:landed.p,color:landed.s,marginTop:8}}>
              <div style={{fontFamily:"'Oswald',sans-serif",fontSize:18,fontWeight:700}}>{landed.city} {landed.name}</div>
              <div style={{fontSize:11,opacity:.8,marginTop:3}}>Select a slot to fill →</div>
            </div>
          )}
        </div>

        {/* ROSTER */}
        <div style={S.rosterCol}>
          <div style={{fontFamily:"'Oswald',sans-serif",fontSize:17,color:"#fff",marginBottom:14,letterSpacing:1}}>
            {cur.name}'s Roster
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:7}}>
            {SLOTS.map(sl=>{
              const fill=cur.roster[sl.key];
              const isEmpty=fill===null;
              const canPick=isEmpty&&landed&&!spinning;
              const canLegend=isEmpty&&cur.legendTokens>0&&landed&&!spinning;
              const teamHasLegendForSlot = teamLegends.some(lg=>lg.pos.includes(sl.key)&&(sl.key!=="DEF"||(lg.n.includes("Defense")||/^\d{4}/.test(lg.n)||lg.n.includes("Legion")||lg.n.includes("Curtain")||lg.n.includes("People")||lg.n.includes("Doomsday")||lg.n.includes("No-Name")||lg.n.includes("Tampa 2")||lg.n.includes("Boom"))));
              return (
                <div key={sl.key} style={{...S.row,...(fill?S.rowFill:S.rowEmpty)}}>
                  {fill && <PlayerHeadshot name={fill.n} isLegend={fill.isLegend} headshotMap={headshotMap}/>}
                  <div style={{flex:1,minWidth:0}}>
                    <div style={S.slotLbl}>{sl.label} <span style={{color:"#2a2a2a"}}>×{sl.weight}</span></div>
                    {fill?(
                      <div style={{display:"flex",alignItems:"center",gap:5}}>
                        {fill.isLegend&&<span style={{fontSize:11}}>⭐</span>}
                        <span style={{fontSize:14,color:fill.isLegend?"#FFD700":"#e8e8e8",fontWeight:500}}>{fill.n}</span>
                        <span style={{fontFamily:"'Oswald',sans-serif",fontSize:12,color:fill.isLegend?"#FFD700":"#3a9a3a"}}>{fill.r}</span>
                      </div>
                    ):<span style={{fontSize:12,color:"#333",fontStyle:"italic"}}>Empty</span>}
                  </div>
                  {isEmpty&&(
                    <div style={{display:"flex",gap:7,flexShrink:0}}>
                      {canPick&&<button style={S.pickBtn} onClick={()=>setModal({type:"pick",slot:sl.key})}>PICK</button>}
                      {canLegend&&teamHasLegendForSlot&&(
                        <button style={S.legBtn} onClick={()=>setModal({type:"legend",slot:sl.key})}>⭐ LEGEND</button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {modal&&(
        <div style={S.overlay} onClick={()=>setModal(null)}>
          <div style={S.modalBox} onClick={e=>e.stopPropagation()}>
            {modal.type==="pick"&&landed&&(()=>{
              const rosterKey=SLOTS.find(s=>s.key===modal.slot)?.rosterKey;
              const allOpts=(ROSTERS[landed.id]?.[rosterKey])||[];
              const available = allOpts.filter(p=>!isClaimed(landed.id, p.n));
              const taken = allOpts.filter(p=>isClaimed(landed.id, p.n));
              return (
                <>
                  <div style={{...S.mHead,background:landed.p,color:landed.s}}>
                    {landed.city} {landed.name}
                    <div style={S.mSub}>Picking: {SLOTS.find(s=>s.key===modal.slot)?.label} · {taken.length} already drafted</div>
                  </div>
                  <div style={S.mList}>
                    {available.map((p,i)=>(
                      <button key={i} style={S.opt} onClick={()=>pick(modal.slot,p,false)}>
                        <span style={{fontSize:15,fontWeight:500,flex:1,textAlign:"left"}}>{p.n}</span>
                        <RatingBar r={p.r}/>
                      </button>
                    ))}
                    {taken.map((p,i)=>(
                      <div key={"t"+i} style={{...S.opt,opacity:0.35,cursor:"not-allowed",pointerEvents:"none"}}>
                        <span style={{fontSize:15,fontWeight:500,flex:1,textAlign:"left",textDecoration:"line-through",color:"#555"}}>{p.n}</span>
                        <span style={{fontSize:11,color:"#444",marginLeft:8}}>DRAFTED</span>
                      </div>
                    ))}
                    {available.length===0&&allOpts.length>0&&(
                      <div style={{color:"#555",padding:16,textAlign:"center"}}>
                        <div style={{fontSize:22,marginBottom:8}}>😬</div>
                        All {SLOTS.find(s=>s.key===modal.slot)?.label}s from this team have been drafted.
                      </div>
                    )}
                    {allOpts.length===0&&<div style={{color:"#555",padding:16}}>No players listed for this position.</div>}
                    {taken.length>0&&(
                      <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid #1a1a1a"}}>
                        <div style={{fontSize:10,letterSpacing:2,color:"#2a2a2a",padding:"0 4px 8px",textTransform:"uppercase"}}>Already Drafted</div>
                        {taken.map((p,i)=>(
                          <div key={i} style={{...S.opt,opacity:.35,cursor:"not-allowed",pointerEvents:"none"}}>
                            <span style={{fontSize:15,flex:1,textAlign:"left",textDecoration:"line-through"}}>{p.n}</span>
                            <RatingBar r={p.r}/>
                            <span style={{fontSize:10,color:"#E31837",marginLeft:6}}>TAKEN</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              );
            })()}
            {modal.type==="legend"&&landed&&(()=>{
              const slotLegends=teamLegends.filter(lg=>lg.pos.includes(modal.slot)&&(modal.slot!=="DEF"||(lg.n.includes("Defense")||/^\d{4}/.test(lg.n)||lg.n.includes("Legion")||lg.n.includes("Curtain")||lg.n.includes("People")||lg.n.includes("Doomsday")||lg.n.includes("No-Name")||lg.n.includes("Tampa 2")||lg.n.includes("Boom"))));
              return (
                <>
                  <div style={{...S.mHead,background:"#1a1400",color:"#FFD700",border:"1px solid #4a3800"}}>
                    ⭐ {landed.city} {landed.name} Legends
                    <div style={{...S.mSub,color:"#9a7a00"}}>
                      {SLOTS.find(s=>s.key===modal.slot)?.label} · Uses 1 token ({cur.legendTokens} remaining)
                    </div>
                  </div>
                  <div style={S.mList}>
                    {slotLegends.map((p,i)=>(
                      <button key={i} style={{...S.opt,borderColor:"#2a2000"}} onClick={()=>pick(modal.slot,p,true)}>
                        <div style={{flex:1,textAlign:"left"}}>
                          <div style={{fontSize:15,fontWeight:600,color:"#FFD700"}}>{p.n}</div>
                          <div style={{fontSize:11,color:"#666",marginTop:2}}>{p.era} · {p.note}</div>
                        </div>
                        <RatingBar r={p.r} gold/>
                      </button>
                    ))}
                    {slotLegends.length===0&&<div style={{color:"#555",padding:16}}>No {SLOTS.find(s=>s.key===modal.slot)?.label} legends for this team.</div>}
                  </div>
                </>
              );
            })()}
            <button style={S.closeBtn} onClick={()=>setModal(null)}>✕ CANCEL</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const S = {
  root:{minHeight:"100vh",background:"#0a0a0a",color:"#e8e8e8",fontFamily:"'Barlow',sans-serif",overflowX:"hidden"},
  setup:{maxWidth:540,margin:"0 auto",padding:"52px 24px"},
  badge:{display:"inline-block",padding:"5px 14px",background:"#111",border:"1px solid #222",borderRadius:4,fontSize:11,letterSpacing:3,color:"#666",marginBottom:22},
  title:{fontFamily:"'Oswald',sans-serif",fontSize:58,fontWeight:700,lineHeight:1,margin:"0 0 10px",letterSpacing:-1},
  accent:{color:"#E31837"},
  sub:{color:"#555",fontSize:15,marginBottom:36,fontWeight:300},
  card:{background:"#111",border:"1px solid #1e1e1e",borderRadius:12,padding:"28px 26px",marginBottom:20},
  fLabel:{fontSize:10,letterSpacing:3,color:"#444",marginBottom:10,textTransform:"uppercase"},
  numRow:{display:"flex",gap:8,marginBottom:24},
  numBtn:{width:46,height:46,background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:8,color:"#666",fontSize:17,fontFamily:"'Oswald',sans-serif",cursor:"pointer"},
  numBtnOn:{background:"#E31837",border:"1px solid #E31837",color:"#fff"},
  inp:{width:"100%",background:"#151515",border:"1px solid #2a2a2a",borderRadius:6,padding:"10px 14px",color:"#e8e8e8",fontSize:15,fontFamily:"'Barlow',sans-serif",boxSizing:"border-box",outline:"none"},
  bigBtn:{width:"100%",padding:"14px",background:"#E31837",border:"none",borderRadius:8,color:"#fff",fontSize:15,fontFamily:"'Oswald',sans-serif",fontWeight:600,letterSpacing:2,cursor:"pointer",marginTop:6},
  rules:{background:"#0d0d0d",border:"1px solid #181818",borderRadius:8,padding:"18px 22px"},
  hdr:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 22px",borderBottom:"1px solid #151515",background:"#0d0d0d",flexWrap:"wrap",gap:10},
  tab:{padding:"5px 14px",background:"#151515",border:"1px solid #222",borderRadius:6,fontSize:13,color:"#555",display:"flex",alignItems:"center"},
  tabOn:{background:"#1a0808",border:"1px solid #E31837",color:"#fff"},
  body:{display:"flex",flexWrap:"wrap"},
  wheelCol:{flex:"0 0 420px",minWidth:280,padding:"28px 22px",borderRight:"1px solid #151515",display:"flex",flexDirection:"column",alignItems:"center"},
  rosterCol:{flex:1,minWidth:280,padding:"22px",overflowY:"auto",maxHeight:"calc(100vh - 62px)"},
  spinBtn:{padding:"13px 24px",background:"#E31837",border:"none",borderRadius:8,color:"#fff",fontSize:14,fontFamily:"'Oswald',sans-serif",fontWeight:600,letterSpacing:2,cursor:"pointer"},
  spinOff:{background:"#1e1e1e",color:"#444",cursor:"not-allowed"},
  reSpinBtn:{padding:"13px 18px",background:"#111",border:"1px solid #3a3a00",borderRadius:8,color:"#FFD700",fontSize:13,fontFamily:"'Oswald',sans-serif",letterSpacing:1,cursor:"pointer",flexShrink:0},
  landedBanner:{width:"100%",maxWidth:380,borderRadius:8,padding:"12px 18px",textAlign:"center"},
  row:{display:"flex",alignItems:"center",padding:"11px 14px",borderRadius:8,border:"1px solid",gap:10},
  rowEmpty:{background:"#0f0f0f",borderColor:"#1e1e1e"},
  rowFill:{background:"#111",borderColor:"#1a2a1a"},
  slotLbl:{fontSize:9,letterSpacing:2,color:"#444",marginBottom:3,textTransform:"uppercase"},
  pickBtn:{padding:"6px 12px",background:"#E31837",border:"none",borderRadius:6,color:"#fff",fontSize:11,fontFamily:"'Oswald',sans-serif",letterSpacing:1,cursor:"pointer",whiteSpace:"nowrap"},
  legBtn:{padding:"6px 10px",background:"#140f00",border:"1px solid #3a2800",borderRadius:6,color:"#FFD700",fontSize:10,fontFamily:"'Oswald',sans-serif",letterSpacing:.5,cursor:"pointer",whiteSpace:"nowrap"},
  overlay:{position:"fixed",inset:0,background:"rgba(0,0,0,.88)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:20},
  modalBox:{background:"#111",border:"1px solid #222",borderRadius:12,width:"100%",maxWidth:480,maxHeight:"82vh",overflow:"hidden",display:"flex",flexDirection:"column"},
  mHead:{padding:"18px 22px",fontFamily:"'Oswald',sans-serif",fontSize:19,fontWeight:700,letterSpacing:1},
  mSub:{fontSize:12,opacity:.75,marginTop:4,fontFamily:"'Barlow',sans-serif",fontWeight:400,letterSpacing:0},
  mList:{overflowY:"auto",flex:1,padding:10,display:"flex",flexDirection:"column",gap:6},
  opt:{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",background:"#161616",border:"1px solid #242424",borderRadius:8,color:"#e8e8e8",cursor:"pointer",textAlign:"left"},
  closeBtn:{margin:"10px",padding:"9px",background:"none",border:"1px solid #222",borderRadius:8,color:"#555",cursor:"pointer",fontFamily:"'Oswald',sans-serif",letterSpacing:1,fontSize:12},
  resCard:{background:"#111",border:"1px solid #1e1e1e",borderRadius:12,marginBottom:14,overflow:"hidden"},
  resCardWin:{border:"1px solid #3a2e00",boxShadow:"0 0 24px rgba(255,215,0,.08)"},
  resHead:{display:"flex",alignItems:"center",gap:14,padding:"14px 18px",borderBottom:"1px solid #181818"},
  resName:{fontFamily:"'Oswald',sans-serif",fontSize:19,fontWeight:600,flex:1,color:"#fff"},
  resScore:{fontFamily:"'Oswald',sans-serif",fontSize:22,color:"#FFD700",fontWeight:700},
  resGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))",gap:1,background:"#181818"},
  resSlot:{padding:"9px 14px",background:"#111"},
  resSlotLabel:{fontSize:9,letterSpacing:2,color:"#333",marginBottom:3},
};
