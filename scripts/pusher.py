import csv
import json
from collections import OrderedDict
from pymongo import MongoClient

client = MongoClient('localhost', 27017)
db = client['currency']
db_prices = db['prices']

codes = ['USD', 'JPY', 'BGN', 'CYP', 'CZK', 'DKK', 'EEK', 'GBP', 'HUF', 'LTL', 'LVL', 'MTL', 'PLN', 'ROL', 'RON', 'SEK', 'SIT', 'SKK',
         'CHF', 'ISK', 'NOK', 'HRK', 'RUB', 'TRL', 'TRY', 'AUD', 'BRL', 'CAD', 'CNY', 'HKD', 'IDR', 'ILS', 'INR', 'KRW', 'MXN', 'MYR',
         'NZD', 'PHP', 'SGD', 'THB', 'ZAR']


def get_cleaned(line, codes, date):
    i = 0
    new_line = []
    new_codes = []
    if not date:
        del line[0]
    del line[-1]
    for x in line:
        if x != 'N/A':
            new_codes.append(codes[i])
            new_line.append(line[i])

        i += 1
    return new_line, new_codes


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


with open('eurofxref-hist.csv', 'rb') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')
    x = 0
    for row in spamreader:
        date = row[0]
        new_line, new_codes = get_cleaned(row, codes, '')

        if x == 0:
            x += 1
            continue

        #  for EUR

        eur_new_line, eur_new_codes = get_cleaned(row[:], codes[:], date)
        eur_ = dict_gen(eur_new_line, currency="EUR", currency_codes=eur_new_codes, date=date)

        db_prices.insert_one(eur_)
        #  end EUR block

        for code in new_codes:
            temp_row = new_line[:]
            record = dict_gen(temp_row, currency=code, currency_codes=new_codes, date=date)
            db_prices.insert_one(record)

        x += 1
        # if x == 2:
        #     break
