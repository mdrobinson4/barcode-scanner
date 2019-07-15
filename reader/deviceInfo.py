from bs4 import BeautifulSoup
import pandas as pd
import os
import time
import requests
import openpyxl
from datetime import datetime
import argparse
import math
import numpy as np


# excel sheet that we are reading
df = pd.read_csv('sample.csv', na_values = ['', '.'])
# url to the dell warrenty information
shipDateUrl = "https://www.dell.com/support/components/dashboard/us/en/04/Warranty/GetWarrantyDetails"
# url to get the device name
deviceNameUrl = "https://www.dell.com/support/home/us/en/04/product-support/servicetag/9ybvsy1/events"

# New csv with new info
# store the model names and the ship dates
modelNames = []
shipDates = []

# dictionary to store the old and new excel data
dataToWrite = {}

i = 0
# loop through the provided serial numbers
for serialNum in df['Serial #']:
    r = requests.post(shipDateUrl, data=dict(
        serviceTag=serialNum,
        isSerializedProduct=False
    ))

    if r.status_code == 200:
        soup = BeautifulSoup(r.text, "html.parser")
        tds = soup.find_all("td")
        shipDate = ""
        for dataCell in tds:
            data = str(dataCell.text.strip())
            index = data.find("Ship Date")
            if index != -1:
                shipDate = data[(data.find(": ") + 2):]
                shipDate = datetime.strptime(shipDate, '%d %b %Y').date()
                shipDate = datetime.strftime(shipDate, '%m/%d/%Y')
        shipDates.insert(i, shipDate)
    else:
        shipDates.insert(i, "")

    # get name of device
    r = requests.post("https://www.dell.com/support/home/us/en/04/product-support/servicetag/{}/events".format(serialNum))
    if r.status_code == 200:
        try:
            soup = BeautifulSoup(r.text, "html.parser")
            h1 = soup.find("h1")
            h1 = str(h1.text.strip())
            h1 = h1[h1.index("Support for") + len("Support for") + 1:].split('\n')[0]
            modelNames.insert(i, h1)
        except:
            modelNames.insert(i, "")
    else:
        modelNames.insert(i, "")

    i += 1

# Serial #	Host Name	Purchase date	Cost	Purchase From	Manufacturer
# Model	Status	Date Added	Building	Room	Category	Name	User
# Department	Warranty Info	Warranty Expiration Date (Dell)	Warranty
# Expiration Date (Apple/Microsoft)	Warranty Expiration Date
# Last Audited Date	Last Audited By	Time Since Last Audit	MAC Address	Wireless
# MAC Address	Student Machine	Peripherals attached	Dell Kace	Bomgar
# Replacement Date	Date Requested	Expected Return Date	Notes	Upgrade Date
# System Upgrades	SCCM ID	Images	Archived


i = 0
# add old info to new sheet
for row in df:
    if row == 'Serial #':
        df[row] = [x.upper() for x in df[row]]
    dataToWrite.update({row : df[row]})
for cell in df['Host Name']:
    if (pd.isnull(cell)):
        df['Host Name'][i] = df['Serial #'][i]
    i += 1

# add new info to new sheet
dataToWrite.update( {'Purchase date' : (shipDates)} )
dataToWrite.update({'Model' : modelNames})

# write the data to the new sheet
writeData = pd.DataFrame(dataToWrite)
writeData.to_csv('done.csv', index=False)

print(pd.read_csv('done.csv', na_values = ['', '.']))
