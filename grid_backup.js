// type Cell = {
//     // stores the adjacent cell: TODO identify how to make this work using references
//     left?: Cell | null,
//     right?: Cell | null,
//     up?: Cell | null,
//     down?: Cell | null,
//     object?: any,
//     // data storage. note that some optional stores are for adapting to different algorithms
//     // all data points are optional and adapted to the particular usage of the cell object
//     data?: any,
//     explored?: boolean,
//     closed?: boolean,
//     open?: boolean
//     value?: number
// }
// class Grid {
//     constructor(width:number, height:number, grid:any) {
//         this.width = width;
//         this.height = height;
//         this.grid_object = grid;
//         this.init();
//     }
//     init() {
//         this.clear();
//         for(var i = 0; i < this.height; i++) {
//             let arr:any = [];
//             for(var j = 0; j < this.width; j++) {
//                 arr[j] = {
//                     left: null,
//                     right: null,
//                     up: null,
//                     down: null
//                 }
//             }
//             this.data[i] = arr;
//         }
//         for(var i = 0; i < this.height; i++) {
//             let row = document.createElement("tr");
//             for(var j = 0; j < this.width; j++) {
//                 let cell = document.createElement("td");
//                 row.appendChild(cell);
//                 console.log("i: " + i + " j: " + j);
//                 this.data[i][j] = {
//                     left: (j > 0) ? this.data[i][j - 1] : null,
//                     right: (j < this.width - 1) ? this.data[i][j + 1] : null,
//                     up: (i > 0) ? this.data[i - 1][j]: null,
//                     down: (i < this.height - 1) ? this.data[i + 1][j] : null,
//                     object: cell
//                 };
//             }
//             this.grid_object.appendChild(row);
//         }
//     }
//     clear() {
//         this.grid_object.innerHTML = "";
//     }
//     add_row() {
//         this.height++;
//         let row = document.createElement("tr");
//         for(var j = 0; j < this.width; j++) {
//             let cell = document.createElement("td");
//             row.appendChild(cell);
//             this.data[this.height - 1][j] = {
//                 object: cell
//             };
//         }
//         this.grid_object.appendChild(row);
//     }
//     remove_row() {
//         if(this.height > this.min_dim) {
//             this.height--;
//         }
//     }
//     add_column() {
//         this.width++;
//     }
//     remove_column() {
//         if(this.width > this.min_dim) {
//             this.width--;
//         }
//     }
//     data: Cell[][] = [];
//     height: number;
//     width:number;
//     grid_object:any;
//     min_dim:number = 5;
// }
