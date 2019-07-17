from bs4 import BeautifulSoup
import time
import requests
from datetime import datetime

# get the device's ship date
def shipDate(serial):
    url = "https://www.dell.com/support/components/dashboard/us/en/04/Warranty/GetWarrantyDetails"
    # make a post request to dell warrenty site
    r = requests.post(url, data=dict(
        serviceTag=str(serial),
        isSerializedProduct=False
    ))
    # successful extract the name of the device
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
        return shipDate
    # could not get the ship date
    else:
        return False

# get the device's name
def name(serial):
    url = "https://www.dell.com/support/home/us/en/04/product-support/servicetag/{}/events".format(serial)
    name = ""
    r = requests.post(url)
    if r.status_code == 200:
        try:
            soup = BeautifulSoup(r.text, "html.parser")
            h1 = soup.find("h1")
            h1 = str(h1.text.strip())
            name = h1[h1.index("Support for") + len("Support for") + 1:].split('\n')[0]
            return name
        except:
            pass
    return False
