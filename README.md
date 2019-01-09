# trust-printer
Script for printing the data of the thermalstuff


## Test printer

`node printer-tester.js`. If any weird characters, check the baud rate(you can get the machine's baud rate by having it print its configuration)

## Run without printer

`MOCK=1 node index.js`. This will print the content to the console rather than send over the serial port