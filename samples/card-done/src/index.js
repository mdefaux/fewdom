/**
 * STARTS WITH:
 * 
        cd samples/card-done/
        npx webpack serve --open
        
 * 
 * https://webpack.js.org/guides/getting-started/
    npm install webpack webpack-cli --save-dev
 * 
 * html-webpack-plugin:
    npm install --save-dev html-webpack-plugin

 * 
    npm install --save-dev webpack-dev-server
 * replace:
    "start": "node --use_strict index.js",
 * with:
    "start": "webpack serve --open",
 * https://webpack.js.org/guides/development/
    
 * 
 * @returns 
 */
// const FlodNode = require( './FlodNode' );


// function component() {
//     const element = document.createElement('div');
//     const nd = new FlodNode();

//    // Lodash, now imported by this script
//     element.innerHTML = 'Hello' + 'webpack' + nd.toString();
 
//     return element;
//   }
 
//   document.body.appendChild(component());

/**This sample draws 3 columns container for cards.
 * Card list are defined by an array of objects, each containing
 * a title and a nested array of cards.
 * 
 */

const { Component, attach, div } = require("../../../src/few");
const notifierProxy = require("./notifierProxy");
const { CardList$ } = require( './CardList' );

// colors of card lists
const colors = ["#FFEFEF", "#FFFFEF", "#EFFFEF"];

class AppRoot extends Component {
    /**Called when component is created
     * 
     */
    onInit() {
        this.proxy = notifierProxy( this.attrs );
    }
    /**
     * 
     * @returns structure of virtual nodes.
     */
    draw() {
        // e$() is an empty node to start with
        // opens the root 'div' tag and defines its attributes
        return div( { style: { 
                display: "inline-flex", 
                minHeight: 'calc( 100% - 20px )',
                padding: "10px" 
        } } )
            // repeats for each element in array list
            .child$( this.proxy.list
                .map((entry, index) =>
                    // it can use CardList$ function as CardList class was registered
                    // 
                    CardList$({
                        key: `${entry.title}`,
                        list: entry,
                        color: colors[index]
                    })
                )
            )
        .$div;        // closes the main UI div
    }
}


window.onload = async function () {
    // Initializes the AppRoot gui attaching its node to document body root
    attach(document.body)
        .child$(AppRoot, { 
            name: "Basic component example", 
            list: [ 
                // {
                //     title: "Incoming", 
                //     cards: [ 
                //         { name: "first", description: "Few Dom Component can be used to build a structure over a state. Click on header to toggle card collapse. The line setState() will cause the component to redraw." },
                //         { name: "second", description: "Component can be iterable with repeat$ method" } 
                //     ] 
                // }, 
                // {title: "Work in progress", cards: [ 
                //     { name: "thrird", description: "Few Dom Component can be used to build a structure over a state. Click on header to toggle card collapse. The line setState() will cause the component to redraw." },
                //     { name: "fourth", description: "Component can be iterable with repeat$ method" } 
                // ]  }, 
                // {title: "Done", cards: [ 
                //     { name: "firstB", description: "Few Dom Component can be used to build a structure over a state. Click on header to toggle card collapse. The line setState() will cause the component to redraw." },
                //     { name: "secondB", description: "Component can be iterable with repeat$ method" } 
                // ]  }
                
                {title: "Incoming", cards: [ 
                    { name: "Asset Inventory", points: 5, description: "Come Contract e UT vorrei avere un asset inventory integrato su applicativo" },
                    { name: "Asset Inventory", points: 8, description: "Come C/UT vorrei che quando il KAM dichiara 'offerta vinta', gli apparati nel preventivo vengano copiati in asset inventory" },
                    { name: "Asset Inventory", points: 8, description: "Come C/UT vorrei importare un excel su asset inventory CSI" },
                    { name: "Asset Inventory", description: "Come UT vorrei avere lo storico delle modifiche fatte su asset inventory" },
                    { name: "Asset Inventory", description: "Come UT vorrei poter fare modifiche ad una versione non ancora effettiva e decidere quando applicare la versione allo stato attuale e inviare le modifiche agli altri sistemi (as400, HDA)" },

                ]  }, 
                {title: "Backlog", cards: [ 
                    { name: "PPM", points: 13, description: "Come Focal Point per i progetti “complessi” e in carico al gruppo PMN. Il focal point dovrà vedere un progetto come “union” di due progetti di BU distinte" },
                    { name: "PPM", points: 8, description: "Come KAM vorrei considerare i casi in cui una BU possa mandare il suo progetto singolarmente al KAM, e i casi differenti in cui il KAM debba vedere solo il progetto aggregato unione di più progetti di BU differenti." },
                    { name: "PPM", points: 13, description: "Come KAM/Progettista vorrei visualizzare i progetti del CRM" },
                    { name: "Refactory", points: 20, description: "Infrastruttura Docker/Container" },
                    { name: "PPM", points: 3, description: "Come SA vorrei visualizzare i progetti." },
                    { name: "PPM", description: "Come Solution Design voglio rivedere tutto il processo di gestione degli stati delle versioni." },

                ]  }, 
                {title: "Work in progress", cards: [
                    { name: "Acquisti", points: 13, description: "Come ufficio acquisti vorrei modificare le date di arrivo merce dal CSI per ottimizzare tempo." },
                    { name: "PPM", points: 8, description: "Come KAM o Solution Design voglio poter modificare solo i preventivi di mia pertinenza" },
                    { name: "PPM", points: 8, description: "Come utente del PPM vorrei un manuale utente online che mi accompagni nelle operazioni sul preventivo." } 
                ]  }, 
                {title: "Done", cards: [ 
                    { name: "CRM-HDA", description: "Come C/UT vorrei l'integrazione CRM.Ordini - HDA.Ticket." },
                    { name: "Refactory", description: "Schedulare il dump del DB di produzione" },
                    { name: "Contratti", description: "Come C/UT  per la parte di PPM Contratti voglio modificare le condizioni di estrazione delle varie viste (contratti/contratti in scadenza/storico venduto/asset contratti)" },
                    { name: "PPM", description: "Come KAM  voglio la possibilità di creare un progetto in modalità di 'Offerta Rapida' con meno passaggi di stato  e senza intervento dei progettisti." },
                    { name: "Refactory", description: "Schedulare il dump del DB di produzione" },
                    { name: "PPM", description: "Come SA vorrei visualizzare i progetti." },
                    { name: "Contratti", description: "Come KAM vorrei che il Canone Mensile è ora da intendersi come Mensile Totale e il canone annuo sia semplicemente il canone mensile x 12." },

                    
                ]  }, 
            ]
        } )
    .$attach;
}
   
