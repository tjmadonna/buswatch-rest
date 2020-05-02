# Bus Watch REST API

## Routes

Note: All requests require an API key `key` as a query parameter

### Get Predictions For Stop Id

Provides upcoming transit arrivals time for the given stop

```
GET /predictions/:stopId
```

#### Reponse
```json
{
  "predictions": [
    {
      "vehicleId": "6540",
      "routeId": "64",
      "routeTitle": "Lawrenceville Via Sq Hill-Shadyside-Bloomfield-Inbound",
      "arrivalTime": 1588455780
    }
  ]
}
```

**stopId**<br>
&ensp;&ensp;*string* the unique id of the stop<br>
**vehicleId**<br>
&ensp;&ensp;*string* the unique id of the bus or train<br>
**route**<br>
&ensp;&ensp;*string* the route identifier<br>
**routeTitle**<br>
&ensp;&ensp;*string* the route title<br>
**arrivalTime**<br>
&ensp;&ensp;*int* the unix timestamp of the predicted arrival time<br>
