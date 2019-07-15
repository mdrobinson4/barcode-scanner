from imutils.video import VideoStream
from pyzbar import pyzbar
import argparse
import datetime
import imutils
import time
import cv2
import info
import threading

def getInfo(barcodeData, email, password):
        # get the dell device's name
        name = info.name(barcodeData)
        # get the dell device's ship date
        shipDate = info.shipDate(barcodeData)
        if name == True and shipDate == True:
                print("got {} -- {} -- {}".format(barcodeData, name, shipDate))
                # uploadDate
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
        vs = VideoStream(usePiCamera=True).start()
        time.sleep(2.0)
        scan(vs)
        print("[INFO] cleaning up...")
        csv.close()
        cv2.destroyAllWindows()
        vs.stop()

        
        
