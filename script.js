window.onload = () => {

buscador();
// informe();

document.getElementById("informe").addEventListener("click", function() {
    obtenerTop5BoxOfficeYDibujarGrafica();
});

}

var cont = 1;
var pelis= [];
var pelisinfor=[];


// google.charts.load("current", { packages: ['corechart'] });
// var dataImdbRating = [["Película", "imdbRating"]];
// var optionsImdbRating = {
//     title: "Películas por imdbRating",
//     width: 600,
//     height: 400,
//     bar: { groupWidth: "95%" },
//     legend: { position: "none" },
// };

// var dataBoxOffice = [["Película", "BoxOffice"]];
// var optionsBoxOffice = {
//     title: "Películas por BoxOffice",
//     width: 600,
//     height: 400,
//     bar: { groupWidth: "95%" },
//     legend: { position: "none" },
// };

// var dataImdbVotes = [["Película", "imdbVotes"]];
// var optionsImdbVotes = {
//     title: "Películas por imdbVotes",
//     width: 600,
//     height: 400,
//     bar: { groupWidth: "95%" },
//     legend: { position: "none" },
// };



        // Obtener el elemento select
        const selectElem = document.getElementById("tipob");




        var tipo= "movie"
        // Hacer algo con el valor seleccionado (por ejemplo, imprimirlo en la consola)








function deseleccionar(checkbox) {
    var checkboxes = document.getElementsByName("opcion");
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i] !== checkbox) {
        checkboxes[i].checked = false;
      }
    }
  }

function buscador() {
    var buscador = document.getElementById("searchInput");
  
    buscador.addEventListener("keyup", function() {
      var valor = buscador.value.trim(); // Obtener el valor del input y eliminar espacios en blanco al principio y al final
  
      if (valor.length > 2) {
        searchvermas();
      }
    });
  }

  function searchvermas() {
    cont=1
    
    searchMovies();
}
function searchMovies() {
    document.getElementById("loader").style.display="block"
    const apiKey = "af595243";
    const searchInput = document.getElementById("searchInput").value;
    const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${searchInput}&type=${tipo}&page=${cont}`;
    

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayResults(data.Search);
            
            
        })
        .catch(error => {
            console.log("Error:", error);
        });
}

function displayResults(results) {
    const resultsContainer = document.getElementById("resultsContainer");
    document.getElementById("loader").style.display="none"
    if (cont == 1) {
        resultsContainer.innerHTML = "";
        pelis.splice(0, pelis.length);
    }

    if (results) {
        results.forEach(movie => {
            const movieElement = document.createElement("div");
            
            movieElement.addEventListener("click", function () {
                peliculainfo(movie.imdbID);
            })

            // Check if movie.Poster is available, otherwise use a default image
            const posterSrc = movie.Poster !== "N/A" && movie.Poster !== "" ? movie.Poster : "defecto.jpg";

            movieElement.innerHTML = `
                <img src="${posterSrc}" alt="${movie.Title}">
                <p><strong>${movie.Title}</strong></p>
            `;
            resultsContainer.appendChild(movieElement);
            pelis.push(movie.imdbID);
        })
        cont++;
    } else {
        resultsContainer.innerHTML = "No se encontraron resultados";
    }
}

function displayinfo(results) {
    console.log("entra en funcion");
    const resultsContainer = document.getElementById("info");

    resultsContainer.innerHTML = "";

    resultsContainer.style.display="flex";

    if (results) {
        
            const movieElement = document.createElement("div");
            const posterSrc = results.Poster !== "N/A" && results.Poster !== "" ? results.Poster : "defecto.jpg";
            
            movieElement.innerHTML = `

                <img id="quitar" src="quitar.png">
                <div>
                <img src="${posterSrc}" alt="${results.Title}">
                <div>
                <h3><strong>${results.Title}</strong></h3>
                <p><strong>Año:</strong> ${results.Year}</p>
                <p>${results.Released}</p>
                <p><strong>Genero:</strong> ${results.Genre}</p>
                <br>
                <p><strong>Director:</strong> ${results.Director}</p>
                <p><strong>Escritor:</strong> ${results.Writer}</p>
                <p><strong>Actores:</strong> ${results.Actors}</p>
                <p><strong>Sinposis:</strong> ${results.Plot}</p>
                </div>
                </div>
            `;
            resultsContainer.appendChild(movieElement);

            var quita=document.getElementById("quitar")

            quita.addEventListener("click", function() {
                resultsContainer.style.display="none";
            })
            
        }

    else {
        resultsContainer.innerHTML = "No se encontraron resultados";
    }
}

function peliculainfo(id){
    const apiKey = "af595243";

    const url = `https://www.omdbapi.com/?apikey=${apiKey}&i=${id}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayinfo(data);
            
            
        })
        .catch(error => {
            console.log("Error:", error);
        });
}

//into
function obtenerTop5BoxOfficeYDibujarGrafica() {
    var graficas=document.getElementById("informes")
    const boxOfficePeliculas = [];
    const ratingPeliculas = [];
    const votesPeliculas = [];
    graficas.style.display="flex";
    // Obtener los datos de las películas
    const peliculasPromises = pelis.map(peli =>
      fetch("https://www.omdbapi.com/?apikey=9fce6812&i=" + peli)
        .then(response => response.json())
    );
  
    // Esperar a que todas las promesas se completen
    Promise.all(peliculasPromises)
      .then(peliculas => {
        peliculas.forEach(pelicula => {
          const boxOffice = pelicula.BoxOffice;
          const titulo = pelicula.Title;
          const rating=pelicula.imdbRating;
          const votes=pelicula.imdbVotes;
          if (boxOffice !== "N/A" && titulo) {
            boxOfficePeliculas.push([titulo, parseFloat(boxOffice.replace(/[^0-9.]+/g, ''))]);
          }if (rating!== "N/A" && titulo) {
            ratingPeliculas.push([titulo, parseFloat(rating.replace(/[^0-9.]+/g, ''))]);
          }if (votes!== "N/A" && titulo) {
            votesPeliculas.push([titulo, parseFloat(votes.replace(/[^0-9.]+/g, ''))]);
          }
        });
  
        // Ordenar el array de películas de mayor a menor
        boxOfficePeliculas.sort((a, b) => b[1] - a[1]);
        ratingPeliculas.sort((a, b) => b[1] - a[1]);
        votesPeliculas.sort((a, b) => b[1] - a[1]);
  
        console.log(boxOfficePeliculas);
        console.log(ratingPeliculas);
        console.log(votesPeliculas);
        // Llamar a la función para dibujar la gráfica
        drawChart(boxOfficePeliculas,1);
        drawChart(ratingPeliculas,2);
        drawChart(votesPeliculas,3);
      })
      .catch(error => {
        console.log('Error al obtener información de las películas:', error);
      });
  }
  
  function drawChart(datos, numero) {
    google.charts.load("current", { packages: ["corechart"] });

    // Definir un color de fondo para el área del gráfico
    var backgroundColor = '#f9f9f9';

    if (numero == 1) {
        google.charts.setOnLoadCallback(() => {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Título');
            data.addColumn('number', 'Box Office');
            data.addRows(datos);

            var options = {
                title: "Ranking de películas con mayor box office",
                width: 500,
                height: 300,
                bar: { groupWidth: "95%" },
                legend: { position: "none" },
                colors: ['#5554FA'],
                // Personalizar estilo
                backgroundColor: backgroundColor,
                hAxis: {
                    textStyle: {
                        color: '#333', // Color del texto en el eje horizontal
                    }
                },
                vAxis: {
                    textStyle: {
                        color: '#333', // Color del texto en el eje vertical
                    }
                },
            };

            var chart = new google.visualization.BarChart(document.getElementById("todaslaspelis"));
            chart.draw(data, options);
    });
  }if(numero==2){
    google.charts.setOnLoadCallback(() => {
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Título');
      data.addColumn('number', 'ImdbRating');
      data.addRows(datos.slice(0, 5));
  
      var options = {
        title: "Top 5 de películas con más ranking",
        width: 500,
        height: 300,
        bar: { groupWidth: "95%" },
        legend: { position: "none" },
        colors: ['#9A6BFA'],
      };
  
      var chart = new google.visualization.BarChart(document.getElementById("top5rating"));
      chart.draw(data, options);
    });
  }if(numero==3){
    google.charts.setOnLoadCallback(() => {
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Título');
      data.addColumn('number', 'ImdbVotes');
      data.addRows(datos.slice(0, 5));
  
      var options = {
        title: "Top 5 de películas con más votos",
        width: 500,
        height: 300,
        bar: { groupWidth: "95%" },
        legend: { position: "none" },
        colors: ['#FA38A3'],
      };
  
      var chart = new google.visualization.BarChart(document.getElementById("top5votos"));
      chart.draw(data, options);
    });
  }
  }
  

// function informe(){

//     document.getElementById("informe").addEventListener("click", function() {
//         const apiKey = "af595243";
//     pelis.forEach(ids => {

    

//     const url = `https://www.omdbapi.com/?apikey=${apiKey}&i=${ids}`;
//     fetch(url)
//         .then(response => response.json())
//         .then(data => {
           
//             displayinforme(data);
            
            
//         })
//         .catch(error => {
//             console.log("Error:", error);
//         });

//     })
//     })
    
// }

// function displayinforme(results) {
//     if (results) {

//         pelis.push(results.id);
        
        // var pelicula = {
        //     titulo: results.Title,
        //     imdbRating: parseFloat(results.imdbRating),
        //     BoxOffice: parseFloat(results.BoxOffice.replace(/[^\d.]/g, '')),
        //     imdbVotes: parseInt(results.imdbVotes.replace(/,/g, ''), 10)
        // };

        // pelisinfor.push(pelicula);

        // // Agregar datos para imdbRating
        // dataImdbRating.push([results.Title, pelicula.imdbRating]);

        // // Agregar datos para BoxOffice
        // dataBoxOffice.push([results.Title, pelicula.BoxOffice]);

        // // Agregar datos para imdbVotes
        // dataImdbVotes.push([results.Title, pelicula.imdbVotes]);

        // console.log(results.Title);
//     }
// }

// function muestrainfor() {
//     var chartImdbRating = new google.visualization.ColumnChart(document.getElementById("columnchart_imdbRating"));
//     var chartBoxOffice = new google.visualization.ColumnChart(document.getElementById("columnchart_BoxOffice"));
//     var chartImdbVotes = new google.visualization.ColumnChart(document.getElementById("columnchart_imdbVotes"));

//     var datarImdbRating = google.visualization.arrayToDataTable(dataImdbRating);
//     var datarBoxOffice = google.visualization.arrayToDataTable(dataBoxOffice);
//     var datarImdbVotes = google.visualization.arrayToDataTable(dataImdbVotes);

//     chartImdbRating.draw(datarImdbRating, optionsImdbRating);
//     chartBoxOffice.draw(datarBoxOffice, optionsBoxOffice);
//     chartImdbVotes.draw(datarImdbVotes, optionsImdbVotes);
// }