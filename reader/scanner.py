from imutils.video import VideoStream
from pyzbar import pyzbar
import argparse
import datetime
import imutils
import time
import cv2
import info
import threading
import requests

email = ""
password = ""
# servo url
url = ""

def uploadInfo(email, password, name, shipDate, barcode):
    r = requests.post(url + '/barcode', data=dict(
        email=email,
        password=password,
        shipDate=shipDate,
        name=name,
        barcode=barcode
        )
    )

    if r.status_code == 200:
        print("Uploaded to {}".format(email))
    else:
        print("error: {},{}".format(status_code, r))



def getInfo(barcodeData, email, password):
        print("Getting Info")
        # get the dell device's name
        name = info.name(barcodeData)
        # get the dell device's ship date
        shipDate = info.shipDate(barcodeData)
        if name != False and shipDate != False:
            print("Name: {}\nShip Date: {}\nSerial Number:{}".format(name, shipDate, barcodeData))
                # uploadInfo(email, password, name, shipDate, barcodeData)
                # uploadDate
        else:
            print("Error: {}".format(barcodeData))
        return
        

def scan(vs):
        found = set()
        while True:
            frame = vs.read()
            frame = imutils.resize(frame, width=400)

            # find the barcodes and decode
            barcodes = pyzbar.decode(frame)

            for barcode in barcodes:
                (x, y, w, h) = barcode.rect
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 0, 255), 2)
                barcodeData = barcode.data.decode("utf-8")
                barcodeType = barcode.type
                # if barcode is unique add it to the found set
                # and get warrenty info / upload it to the server in a thread
                if barcodeData not in found:
                        found.add(barcodeData)
                        # get warrenty info / upload to server
                        deviceInfoThread = threading.Thread(target=getInfo, args=(barcodeData, email, password))
                        deviceInfoThread.start()
                # write barcode data and type to image
                text = "{} ({})".format(barcodeType, barcodeData)
                cv2.putText(frame, text, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)

            cv2.imshow("Barcode Scanner", frame)
            key = cv2.waitKey(1) & 0xFF
            if key == ord("q"):
                break



if __name__ == '__main__':
        # initialize video stream
        print("[INFO] starting video stream...")
        vs = VideoStream(usePiCamera=False, resolution=(1920,1080)).start()
        time.sleep(2.0)
        scan(vs)
        print("[INFO] cleaning up...")
        cv2.destroyAllWindows()
        vs.stop()

        
        
