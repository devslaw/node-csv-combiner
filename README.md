[![Build Status](https://travis-ci.org/devslaw/node-csv-combiner.svg?branch=master)](https://travis-ci.org/devslaw/node-csv-combiner)

## Combines multiple CSV files merging chosen columns

#### Instalation

    npm install csv-combiner


#### Test

    npm test

#### Example: combine two CSV files
#### Dataset_1.csv:
    City,State,Country,
    Yerevan,Yerevan,Armenia
    Yerevan,Yerevan,Armenia
    Yerevan,Yerevan,Armenia
#### Dataset_2.csv:
    First Name,Last Name,Age
    Arthur,Arakelyan,25
    Sipan,Margaryan,26
    Davit,Tovmasyan,25

#### usage:
    const combiner = new csvCombiner('/exportDir');
        combiner.combine([{filePath: '/files/Dataset_1.csv',columns: [0,1,2]},
                          {filePath: '/files/Dataset_2.csv',columns: [0,1,2]}
            ]).subscribe(
                filePath => {
                   //do whatever you want
                },
                error => {
                   //do whatever you want
                }
            )

#### combined_dataset.csv
    City,State,Country,First Name,Last Name,Age
    Yerevan,Yerevan,Armenia,Arthur,Arakelyan,25
    Yerevan,Yerevan,Armenia,Sipan,Margaryan,26
    Yerevan,Yerevan,Armenia,Davit,Tovmasyan,25
