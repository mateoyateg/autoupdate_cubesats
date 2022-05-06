# App. para obtener los TLE actuales de CubeSats específicos 🛰️

Aplicación desarrollada en Java con el fin de obtener de internet los códigos TLE para satélites CubeSats preseleccionados previamente en un archivo CSV. El archivo de texto resultante cumple con el formato del software Orbitrón para predecir en qué momento un CubeSat transitará una zona del mundo en específico.

## Comenzando 🚀

Para obtener una copia de este proyecto en su máquina local de click al botón **Code** y seleccione *Download ZIP* o ejecute el siguiente comando en la consola de Git.

```
$ git clone https://github.com/mateoyateg/autoupdate_cubesats.git
```
### Pre-requisitos 📋

Este programa fue desarrollado en Java, por lo cual para ejecutarlo debe contar con la máquina virtual de Java la cual puede descargar [aquí](https://www.java.com/es/download/ie_manual.jsp).

Si desea revisa el proyecto puede abrirlo directamente en Apache Netbeans (12.2 o mayor) el cual puedes descargar [aquí](https://netbeans.apache.org/download/index.html).

### Ejecución ✅

_La ejecución del aplicativo se basa en **4** sencillos pasos a seguir para el usuario final descritos a continuación._

1. En la misma carpeta donde se encuentra el archivo _autoupdate_cubesats.jar_ se debe encontrar el archivo CSV (_cubesats_csv.csv_) con la lista e información de cada uno de los CubeSats cuyos TLE se desean actualizar. En este repositorio encontrará un archivo guía con algunos CubeSats con el fin de realizar una demostración del funcionamiento del aplicativo. El formato del archivo CSV en cuestión está dado por: 

```
[Nombre,Frecuencia (MHz),Enlace a TLE,Enlace al tracking,Información adicional]

Por ejemplo: "DICE 2,460,https://www.n2yo.com/satellite/?s=37852,https://www.n2yo.com/?s=37852,"

- Nota: Los campos que obligatoriamente no deben dejarse en blanco son el _Enlace a TLE_ y el _Enlace al Tracking_ puesto que en ellos se basa el funcionamiento del aplicativo. 
```

2. Se procede a ejecutar el archivo _autoupdate_cubesats.jar_ el cual inicialmente cargará la lista de CubeSats y las direcciones web de sus TLE actualizados notificandole de la carga exitosa.

![Carga Cubesats](https://github.com/mateoyateg/autoupdate_cubesats/blob/main/img/img1.jpg)

3. De manera interna, el aplicativo empezará a realizar el proceso de web scrapping con el fin de obtener las líneas TLE de cada uno de los satélites en cuestión. En caso de que exista algún problema con la obtención de algún TLE de un satélite el programa notifica al usuario acerca del problema. 

![Obtención exitosa](https://github.com/mateoyateg/autoupdate_cubesats/blob/main/img/img2.jpg)

4. Finalmente, el aplicativo notifica al usuario de la generación del archivo txt listo para su carga en Orbitrón por medio de la ventana descrita a continuación.

![Generacion de Archivo](https://github.com/mateoyateg/autoupdate_cubesats/blob/main/img/img3.jpg)

![Archivo txt resultante](https://github.com/mateoyateg/autoupdate_cubesats/blob/main/img/img4.jpg)

### Carga en Orbitron 🛰️

Para el uso del archivo generado, es necesario contar con el software Orbitrón el cual puede descargarse de manera gratuita [aquí](http://www.stoff.pl/downloads.php).

Una vez instalado el software, debe darse click en el botón de **Abrir TLE** y seleccionar el archivo generado por el aplicativo.

![Carga Orbitron](https://github.com/mateoyateg/autoupdate_cubesats/blob/main/img/img5.jpg)

De esta manera, en el panel derecho de Orbitron se encontrará la lista de satélites cargados y al dar click en alguno de ellos será posible ser su trayectoria estimada con las líneas TLE actualizadas.

![Pantalla Orbitron](https://github.com/mateoyateg/autoupdate_cubesats/blob/main/img/img6.jpg)

## Desarrollo del Aplicativo 🛠️

Para el desarrollo de este aplicativo se optó por emplear la libreria JSoup que permite realizar web scrapping empleando el lenguaje Java de una manera sencilla. Esta se encuentra alojada en este repositorio o puede ser descargada [aquí](https://jsoup.org/download).

A manera de resúmen, el aplicativo funciona en las fases descritas a continuación:

### 1. Carga de los CubeSats dispuestos en el archivo CSV

En esta fase se carga el archivo CSV empleando el Buffer Reader de Java apuntando directamente al archivo en cuestión. Este procedimiento se encuentra almacenado en la clase autoupdate_cubesats.java dentro del método _cargarSatsTLE()_ que almacena la información de cada uno de los CubeSats en un _ArrayList_ global para ser utilizado posteriormente.


### 2. Proceso de Web Scrapping 🕵🏻

Empleando la librería JSoup, se realiza la apertura de cada uno de los enlaces a las líneas TLE actualizadas en internet y allí se extrae el elemento HTML con la etiqueta "tle" el cual almacena este valor que es actualizado de manera periódica por el sitio web.

```
Document document = getHtmlDocument(urlTle);
Element tle = document.getElementById("tle");
String tleString = tle.toString();
String[] tleSeparated = tleString.split("\n");
```

Posteriormente, se ordenan las líneas TLE y se guardan provisionalmente en una variable de tipo _ArrayList_.

### 3. Escritura del archivo txt resultante 🗒️

Finalmente, por medio de la clase File Util se realiza la escritura de todas las líneas TLE obtenidas del procedimiento de Web Scrapping en un archivo que tiene como nombre "cubesats_fecha del dia de generacion.txt".

## Construido con 🛠️

* [Java](https://www.java.com/es/download/ie_manual.jsp) - Lenguaje empleado
* [JSoup](https://jsoup.org/download) - Librería para realizar Web Scrapping.

## Autores ✒️

* **Mateo Yate Gonzalez**
* **Arley Esteban Quintero Amaya**

## Uso 📄

Este proyecto fue realizado con fines netamente académicos y no debería ser utilizado para fines comerciales.

---
_Proyecto realizado bajo el Semillero ATL 🚀 adscrito al Grupo de Investigación LIDER de la Universidad Distrital._