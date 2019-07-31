# foreign exchange rates api

ratesapi is a free API for present and historical foreign exchange rates. We developed this service by reading public data from [European Central Bank](https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html).

**Note**: The reference rates are usually updated around 16:00 CET on every working day.

## Usage

* Latest Rates based on EUR
```
URL: https://api.ratesapi.io/api/latest

{"base":"EUR","date":"2018-04-20","rates":{"AUD":1.5983,"BGN":1.9558,"BRL":4.1892,"CAD":1.5557,"CHF":1.197,"CNY":7.7449,"CZK":25.34,"DKK":7.4477,"GBP":0.87608,"HKD":9.6568,"HRK":7.411,"HUF":310.52,"IDR":17142.74,"ILS":4.3435,"INR":81.39,"ISK":123.3,"JPY":132.41,"KRW":1316.26,"MXN":22.7424,"MYR":4.7924,"NOK":9.605,"NZD":1.7032,"PHP":64.179,"PLN":4.1677,"RON":4.6586,"RUB":75.7375,"SEK":10.3703,"SGD":1.6172,"THB":38.552,"TRY":4.9803,"USD":1.2309,"ZAR":14.8008}}%                       
```

* Latest Rates based on USD
```
URL: https://api.ratesapi.io/api/latest?base=USD

{"base":"USD","date":"2018-04-20","rates":{"AUD":1.2985,"BGN":1.5889,"BRL":3.4034,"CAD":1.2639,"CHF":0.9725,"CNY":6.2921,"CZK":20.5866,"DKK":6.0506,"EUR":0.8124,"GBP":0.7117,"HKD":7.8453,"HRK":6.0208,"HUF":252.2707,"IDR":13926.9965,"ILS":3.5287,"INR":66.1223,"ISK":100.1706,"JPY":107.5717,"KRW":1069.3476,"MXN":18.4762,"MYR":3.8934,"NOK":7.8032,"NZD":1.3837,"PHP":52.1399,"PLN":3.3859,"RON":3.7847,"RUB":61.5302,"SEK":8.425,"SGD":1.3138,"THB":31.3202,"TRY":4.0461,"ZAR":12.0244}}
```

* Get Rates based on Date
```
URL https://api.ratesapi.io/api/2008-12-10

{"base":"EUR","date":"2008-12-10","rates":{"AUD":3.2406,"BRL":1.6295,"CAD":8.8708,"CNY":10.0171,"CYP":25.9,"CZK":7.4499,"DKK":15.6466,"EEK":0.87325,"GBP":263.75,"HKD":14185.19,"HRK":36.0941,"HUF":3.4528,"INR":1790.76,"ISK":9.1285,"JPY":1.9558,"KRW":17.4681,"LTL":0.7092,"MTL":3.9566,"MXN":4.6724,"MYR":2.3696,"NOK":7.1923,"NZD":62.47,"PHP":1.9393,"ROL":3.878,"RON":10.567,"SGD":45.748,"SIT":30.189,"SKK":1.5587,"TRL":2.028,"TRY":1.9665,"USD":119.77}}
```

* Get Rates using base and symbol

```
https://api.ratesapi.io/api/latest?base=USD&symbols=INR,GBP

{"base":"USD","date":"2018-04-20","rates":{"GBP":0.7117,"INR":66.1223}}
```

# Support and feature requests:

We welcome your feedback and support, raise [github ticket](https://github.com/MicroPyramid/ratesapi/issues) if you want to report a bug. Need new features? Contact us [here](https://micropyramid.com/contact-usa/)
