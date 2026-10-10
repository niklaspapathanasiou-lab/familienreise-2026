import {json,requireSession} from "../_shared.js";



const days = [


 {city:"Singapur",dateLabel:"So., 18. Oktober 2026",title:"Ankunft & entspannt ankommen",status:"Ankunftstag",description:"Ankunftszeiten und Transfer ergänzen. Nach dem Check-in die Umgebung des Hotels erkunden und den Abend flexibel halten.",items:[{title:"YOTEL Singapore Orchard Road",place:"YOTEL Singapore Orchard Road",note:"Unser Hotel und Ausgangspunkt"},{title:"Orchard Road",place:"Orchard Road Singapore",note:"Spaziergang und unkompliziertes Abendessen"}]},


 {city:"Singapur",dateLabel:"Mo., 19. Oktober 2026",title:"Marina Bay & Gardens by the Bay",status:"Vorschlag",description:"Klassischer erster Erkundungstag. Öffnungszeiten und Tickets für die Gewächshäuser vorab prüfen.",items:[{title:"Merlion Park",place:"Merlion Park Singapore"},{title:"Gardens by the Bay",place:"Gardens by the Bay Singapore",note:"Tickets für Flower Dome / Cloud Forest prüfen"},{title:"Marina Bay Sands Waterfront",place:"Marina Bay Sands waterfront Singapore",note:"Abendspaziergang"}]},


 {city:"Singapur",dateLabel:"Di., 20. Oktober 2026",title:"Stadtviertel & teamLab",status:"Vorschlag",description:"teamLab ist als Programmpunkt vorgesehen; bitte den konkreten Veranstaltungsort und verfügbare Eintrittszeiten vorab bestätigen.",items:[{title:"teamLab",place:"teamLab Singapore",note:"Veranstaltungsort und Tickets bestätigen"},{title:"Kampong Glam",place:"Kampong Glam Singapore",note:"Haji Lane und Sultan Mosque von außen"},{title:"Abendessen in Chinatown",place:"Chinatown Singapore restaurants",note:"Budget ca. 30–60 € pro Person"}]},


 {city:"Singapur",dateLabel:"Mi., 21. Oktober 2026",title:"Sentosa optional & Abflug",status:"Abflug 18:15",description:"Nur einen kurzen Ausflug einplanen und ausreichend Zeit für Gepäckabholung und Transfer zum Flughafen lassen. Thai Airways TG408: Abflug 18:15; Terminal und Check-in-Zeit prüfen.",items:[{title:"Sentosa (optional)",place:"Sentosa Island Singapore",note:"Nur wenn es zeitlich passt: Cable Car, Skyline Luge oder Palawan Beach"},{title:"Changi Airport",place:"Singapore Changi Airport",note:"Rückkehr mit großzügigem Zeitpuffer"}]},


 {city:"Bangkok",dateLabel:"22. Oktober 2026",title:"Bangkok – Tagesplan ergänzen",status:"Noch zu planen",description:"Tragt hier nach Bestätigung eurer Ankunft, Unterkunft und Transferzeit die Tagesplanung ein.",items:[{title:"Unterkunft",place:"Bangkok hotel",note:"Hoteladresse ergänzen"},{title:"Aktivität auswählen",place:"Bangkok Thailand attractions",note:"Vorschlag und Uhrzeit ergänzen"}]},


 {city:"Bangkok",dateLabel:"23. Oktober 2026",title:"Tempel, Fluss oder Shopping",status:"Noch zu planen",description:"Den Tag nach Wetter, Öffnungszeiten und euren Interessen planen.",items:[{title:"Bangkok Sehenswürdigkeiten",place:"Bangkok Thailand attractions"},{title:"Restaurants",place:"Restaurants near central Bangkok",note:"Reservierung und Budget prüfen"}]},


 {city:"Bangkok",dateLabel:"24. Oktober 2026",title:"Bangkok – flexibel planen",status:"Noch zu planen",description:"Platz für Shopping, einen Ausflug oder freie Zeit.",items:[{title:"Einkaufszentrum",place:"modern shopping mall Bangkok"},{title:"Abendessen",place:"family friendly restaurants Bangkok"}]},


 {city:"Chiang Mai",dateLabel:"25. Oktober 2026",title:"Ankunft & Altstadt",status:"Noch zu planen",description:"Reisedatum und Transfer von Bangkok nach Chiang Mai bitte bestätigen. Den ersten Tag entspannt halten.",items:[{title:"Unterkunft",place:"Chiang Mai hotel",note:"Hoteladresse ergänzen"},{title:"Altstadt",place:"Chiang Mai Old City"}]},


 {city:"Chiang Mai",dateLabel:"26. Oktober 2026",title:"Tempel & Altstadt",status:"Noch zu planen",description:"Öffnungszeiten und respektvolle Kleidung für Tempelbesuche beachten.",items:[{title:"Wat Chedi Luang",place:"Wat Chedi Luang Chiang Mai"},{title:"Wat Phra Singh",place:"Wat Phra Singh Chiang Mai"},{title:"Abendmarkt",place:"Chiang Mai night market"}]},


 {city:"Chiang Mai",dateLabel:"27. Oktober 2026",title:"Ausflugstag",status:"Noch zu planen",description:"Ausflug erst nach Prüfung von Dauer, Transport und Tierwohl-Aspekten buchen.",items:[{title:"Doi Suthep",place:"Wat Phra That Doi Suthep"},{title:"Ausflugsoptionen",place:"Chiang Mai day trips",note:"Tour und Rückfahrt prüfen"}]},


 {city:"Chiang Mai",dateLabel:"28. Oktober 2026",title:"Freier Tag & lokale Küche",status:"Noch zu planen",description:"Zeit für Cafés, Märkte, Kochkurs oder einen entspannten Tag.",items:[{title:"Lokaler Markt",place:"Warorot Market Chiang Mai"},{title:"Restaurants",place:"Northern Thai food Chiang Mai"}]},


 {city:"Chiang Mai",dateLabel:"29. Oktober 2026",title:"Chiang Mai – Wünsche der Familie",status:"Noch zu planen",description:"Hier gemeinsame Vorschläge und Kommentare sammeln.",items:[{title:"Aktivität nach Wahl",place:"Chiang Mai attractions"}]},


 {city:"Chiang Mai",dateLabel:"30. Oktober 2026",title:"Letzter voller Tag",status:"Noch zu planen",description:"Puffer für Lieblingsorte, Einkäufe und Packen einplanen.",items:[{title:"Altstadt / Einkauf",place:"Chiang Mai Old City"},{title:"Abschiedsessen",place:"family friendly restaurants Chiang Mai"}]},


 {city:"Chiang Mai",dateLabel:"31. Oktober 2026",title:"Abreise",status:"Abflugdetails ergänzen",description:"Flugnummer, Abflugzeit und Transfer zur Unterkunft ergänzen. Abfahrtszeit mit ausreichendem Puffer planen.",items:[{title:"Flughafen Chiang Mai",place:"Chiang Mai International Airport"}]}


];


export async function onRequestGet({request,env}) {


 const denied=await requireSession(request,env); if(denied)return denied;


 return json({title:"Unsere Asienreise 2026",days});


}
