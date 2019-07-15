from pyzbar import pyzbar
import argparse
import cv2

ap = argparse.ArgumentParser()
ap.add_argument("-i", "--image", required=True,
        help="path to input image")
args = vars(ap.parse_args())

# load the imput image
image = cv2.imread(args["image"])

# find the barcodes in the image and decode
barcodes = pyzbar.decode(image)

# loop over the barcodes
for barcode in barcodes:
    # extract the bounding box location of the barcode box
    (x, y, w, h) = barcode.rect
    cv2.rectangle(image, (x, y), (x + w, y + h), (0, 0, 255), 2)

    # convert barcode to text from bytes
    barcodeData = barcode.data.decode("utf-8")
    barcodeType = barcode.type

    # draw the barcode data and barcode type on the image
    text = "{} ({})".format(barcodeData, barcodeType)
    cv2.putText(image, text, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)

    # print the barcode type and data to the terminal 
    print("[INFO] Found {} barcode: {}".format(barcodeType, barcodeData))

cv2.imshow("Image", image)
cv2.waitKey(0)
