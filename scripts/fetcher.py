import urllib2
from xml.dom.minidom import parse
import json
from collections import OrderedDict
from pymongo import MongoClient

client = MongoClient('localhost', 27017)
db = client['currency']
db_prices = db['prices']

u1 = urllib2.urlopen('http://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml')
dom = parse(u1)

itemlist = dom.getElementsByTagName('Cube')
cur = []
rates = []
for s in itemlist:
    try:
        cur.append(str(s.attributes['currency'].value))
        rates.append(float(s.attributes['rate'].value))
    except:
        try:
            rates.remove(float(s.attributes['currency'].value))
        except:
            pass

for s in itemlist:
    try:
        date = (str(s.attributes['time'].value))
    except:
        pass


def my_price(source, target):
    my = float(target) / float(source)
    return float("{0:.4f}".format(my))


def dict_gen(row, currency, currency_codes, date):
    d = OrderedDict()

    d['base'] = currency
    d['date'] = date
    rates = OrderedDict()
    i = 0

    if currency == "EUR":
        for code in currency_codes:
            rates[code] = float(row[i])
            i += 1

    else:
        currency_index = currency_codes.index(currency)
        rates['EUR'] = my_price(row[currency_index], 1)
        for code in currency_codes:

            if code == currency:
                i += 1
                continue
            rates[code] = my_price(row[currency_index], row[i])
            i += 1

    rates = OrderedDict(sorted(rates.iteritems()))
    d['rates'] = rates
    return d


if not db_prices.find({"date": date}).count():

    new_line, new_codes = rates[:], cur[:]

    #  for EUR
    eur_new_line, eur_new_codes = rates[:], cur[:]

    eur_ = dict_gen(eur_new_line, currency="EUR", currency_codes=eur_new_codes, date=date)
    print (json.dumps(eur_))
    db_prices.insert_one(eur_)
    #  end EUR block

    for code in new_codes:
        temp_row = new_line[:]
        record = dict_gen(temp_row, currency=code, currency_codes=new_codes, date=date)
        db_prices.insert_one(record)
