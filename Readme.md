## City risks map 🗺

### Descripcion

Aplicacion web que marca los barrios de Montevideo,Uruguay con zonas rojas segun la frecuencia de un delito,actualmente cuenta con llamadas a la api de google maps place para que el usuario busque e indique al lugar donde desea ir,incluira navegacion con gps para verificar las rutas mas seguras dependiendo 
por cuales barrios crucen estas. 

Los datos de los crimenes fueron obtenidos de documentos del Ministerio del interior.


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
* [react-cookie](https://github.com/bendotcodes/cookies)
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


  ![](/frontend/src/assets/Captures/screenApp1.PNG)
    

  ![](/frontend/src/assets/Captures/screenApp2.PNG)


  ![](/frontend/src/assets/Captures/screenApp3.PNG)


  ![](/frontend/src/assets/Captures/screenApp4.PNG)


  ![](/frontend/src/assets/Captures/screenApp5.PNG)








