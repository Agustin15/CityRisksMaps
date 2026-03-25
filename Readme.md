## Indice Delitos Montevideo  <img src="https://i.postimg.cc/ZR5nq6Pt/logo.png" style="width:50px; height:50px;">

### Descripcion

Aplicacion web que marca los barrios de Montevideo,Uruguay con zonas de color segun la frecuencia de denuncias de un delito,actualmente cuenta con llamadas a la API de Google Maps, para que el usuario busque e indique al lugar donde desea ir,tambien incluira navegacion con gps,en la cual el usuario podra visualizar por donde pasaran las rutas que se calcularon para llegar a su destino,y al elegir una de estas tendra la opcion de editarla para desviarla de 
barrio con altos indices de denuncias de un determinado delito. 

Los datos de las cantidad de denuncias fueron obtenidos de [Datos abiertos del Ministerio del interior.](https://catalogodatos.gub.uy/dataset/?tags=Homicidios+dolosos+consumados)

### Desarrollado con

* <img src="https://img.shields.io/badge/React.js--0c979c?style=flat&labelColor=0c979c&logo=react&logoColor=white&logoSize=auto" alt="React.js">
* <img src="https://img.shields.io/badge/Javascript--f5ff0e?style=flat&labelColor=f5ff0e&logo=javascript&logoColor=black&logoSize=auto" alt="Javascript">
* <img src="https://img.shields.io/badge/CSS--0c379c?style=flat&labelColor=0c379c&logo=css3&logoColor=white&logoSize=auto" alt="CSS">
* <img src="https://img.shields.io/badge/Node.js--48a543?style=flat&labelColor=48a543&logo=nodedotjs&logoColor=white&logoSize=auto" alt="Node.js">
* <img src="https://img.shields.io/badge/Microsoft_SQL_Server-CC2927" alt="SQL Server">
* <img src="https://img.shields.io/badge/Google_Maps-API-4285F4?style=flat-square&logo=googlemaps" alt="Google Maps Api">


### Clonar repositorio

     git clone https://github.com/Agustin15/CityRisksMaps.git


### Requisitos

* NPM(version 11.5.2)
* Vite(version>=7.0.0)
* Node.js(version>=20)
* SQL SERVER (version>=2019) 
* Cuenta de Google Cloud Console para conseguir Api key de google maps

### Instalacion ⚙

#### Frontend
> Navegar a frontend
    
    cd frontend
> Instalar dependencias
   
    npm install


#### Dependencias

* [canvasjs/react-charts](https://canvasjs.com/react-charts/)
* [vis.gl/react-google-maps](https://visgl.github.io/react-google-maps/)
* [react-switch](https://github.com/markusenglund/react-switch)
* [sweetalert2](https://github.com/sweetalert2/sweetalert2-react-content)
 
 
### Variables de entorno

    VITE_MAPS_API_KEY=<GOOGLE MAPS API KEY>
    VITE_LOCALHOST_FRONTEND=<URL LOCALHOST FRONTEND>
    VITE_LOCALHOST_BACKEND=<URL LOCALHOST BACKEND>
    VITE_MAP_ID=<MAP ID OF GOOGLE MAPS API>

#### Backend
> Navegar a backend
    
    cd backend
> Instalar dependencias
   
    npm install

#### Dependencias

* [nodemon](https://github.com/remy/nodemon)
* [dotenv](https://github.com/motdotla/dotenv)
* [cors](https://github.com/expressjs/cors)
* [express](https://github.com/expressjs/express)
* [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit)
* [cookie-parser](https://github.com/expressjs/cookie-parser)
* [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
* [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
* [mssql](https://tediousjs.github.io/node-mssql/)
* [nodemailer](https://nodemailer.com/)


### Variables de entorno

     PORT=<PORT>
     LOCALHOST_FRONTEND=<URL LOCALHOST FRONTEND>
     DATABASE_LOCALHOST=<SERVER DATABASE>
     DATABASE_USER=<USER DATABASE>
     DATABASE_PASSWORD=<PASSWORD DATABASE>
     DATABASE_NAME=<NAME DATABASE>
     EMAIL_FROM=<TRANSMITTER EMAIL FOR NODEMAILER>
     APP_PASSWORD=<PASSWORD APP EMAIL FOR NODEMAILER>
     SECRET_KEY_TOKEN=<SECRET KEY FOR JSONWEBTOKEN>
     SECRET_KEY_REFRESH_TOKEN=<SECRET REFRESH KEY FOR JSONWEBTOKEN>


  ![](/frontend/src/assets/Captures/screenApp1.PNG)
    

  ![](/frontend/src/assets/Captures/screenApp2.PNG)


  ![](/frontend/src/assets/Captures/screenApp3.PNG)


  ![](/frontend/src/assets/Captures/screenApp4.PNG)


  ![](/frontend/src/assets/Captures/screenApp5.PNG)

  
  ![](/frontend/src/assets/Captures/screenApp6.PNG)








