import axios from "axios"
import fs from 'fs'
import { parse } from 'json2csv'

const size = 8000 

let reqOptions = {
  url: "https://imunizacao-es.saude.gov.br/_search?scroll=1m",
  method: "GET",
  headers: { "Authorization": "Basic aW11bml6YWNhb19wdWJsaWM6cWx0bzV0JjdyX0ArI1Rsc3RpZ2k=", "Content-Type": "application/json" },
  data: JSON.stringify({"size": size})
}

var response = await axios.request(reqOptions)

for(var i = 0 ; i < size; i++) {
    var csv = parse(response.data.hits.hits[i]._source)
    fs.appendFile('csv.csv', csv, (err) => {
        if (err) throw err
    })
}

var scroll = response.data._scroll_id

var x = 2
while(response.data.hits.hits != null) {
    
    reqOptions = {
        url: "https://imunizacao-es.saude.gov.br/_search/scroll",
        method: "POST",
        headers: { "Authorization": "Basic aW11bml6YWNhb19wdWJsaWM6cWx0bzV0JjdyX0ArI1Rsc3RpZ2k=", "Content-Type": "application/json" },
        data: JSON.stringify({ "scroll_id": scroll, "scroll": "100m" })
    }
    
    response = await axios.request(reqOptions)

    for(var i = 0 ; i < size; i++) {
        var csv = parse(response.data.hits.hits[i]._source)
        fs.appendFile('csv.csv', csv, (err) => {
            if (err) throw err
        })
    }

    scroll = response.data._scroll_id
    
    console.log('Página: ' + x)
    x++
}