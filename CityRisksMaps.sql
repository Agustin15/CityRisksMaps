CREATE DATABASE CityRiskMap;

USE CityRiskMap;

CREATE TABLE Departments(
idDepartment INT IDENTITY(1,1) Primary key, 
name VARCHAR(30) NOT NULL UNIQUE,
);

CREATE TABLE Neighborhoods(
name VARCHAR(30) Primary key,
department INT NOT NULL FOREIGN KEY REFERENCES Departments(idDepartment) ON UPDATE CASCADE ON DELETE CASCADE
);


CREATE TABLE Population (
idPopulation INT IDENTITY (1,1) Primary key,
neighborhood VARCHAR(30) NOT NULL FOREIGN KEY REFERENCES Neighborhoods(name) ON UPDATE CASCADE ON DELETE CASCADE,
quantity INT NOT NULL CHECK(quantity>=0),
year INT NOT NULL CHECK(year<=YEAR(GETDATE()))
);


CREATE TABLE Crimes(
category VARCHAR(20) Primary key,
description VARCHAR(700) NOT NULL
);


CREATE TABLE Neighborhoods_Crimes(
neighborhood VARCHAR(30) FOREIGN KEY REFERENCES Neighborhoods(name) ON UPDATE CASCADE ON DELETE CASCADE,
crime VARCHAR(20) FOREIGN KEY REFERENCES Crimes(category) ON UPDATE CASCADE ON DELETE CASCADE,
quantity INT CHECK(quantity>=0),
year INT NOT NULL CHECK(year<=YEAR(GETDATE())),
Primary key(neighborhood,crime,year)
);


CREATE TABLE Participants(
email VARCHAR(30) PRIMARY KEY CHECK(PATINDEX('%@[a-zA-Z]%.com%%',email)>0),
created DATETIME NOT NULL DEFAULT GETDATE(),
lastIncome DATETIME DEFAULT GETDATE(),
);


CREATE TABLE Verifications_Codes(
code VARCHAR(60) PRIMARY KEY,
participant VARCHAR(30) NOT NULL FOREIGN KEY REFERENCES Participants(email) ON UPDATE CASCADE ON DELETE CASCADE,
expiration DATETIME NOT NULL CHECK(expiration>GETDATE()),
);


CREATE TABLE Quizes(
idQuiz INT IDENTITY(1,1) PRIMARY KEY,
participant VARCHAR(30) NOT NULL FOREIGN KEY REFERENCES Participants(email) ON UPDATE CASCADE ON DELETE CASCADE,
neighborhood VARCHAR(30) NOT NULL FOREIGN KEY REFERENCES  Neighborhoods(name) ON UPDATE CASCADE ON DELETE CASCADE,
secure bit NOT NULL,
quizDate DATE NOT NULL CHECK(quizDate<=GETDATE())
);


CREATE TABLE Quizes_Crimes(
quiz INT FOREIGN KEY REFERENCES Quizes(idQuiz) ON UPDATE CASCADE ON DELETE CASCADE,
crime VARCHAR(20) FOREIGN KEY REFERENCES Crimes(category) ON UPDATE CASCADE ON DELETE CASCADE,
Primary key(quiz,crime),
);

GO

--------------------------------------------------------------------------------------------------------------
--Department PROCEDURES

CREATE OR ALTER PROCEDURE AddDepartment @name VARCHAR(30) AS
BEGIN

IF EXISTS (select * from Departments where name=@name)
RETURN -1

INSERT INTO Departments VALUES(@name);

IF(@@ERROR<>0)
RETURN -2

RETURN 1

END
GO



CREATE OR ALTER PROCEDURE UpdateDepartment @idDepartment INT ,@name VARCHAR(30) AS
BEGIN

IF NOT EXISTS (select * from Departments where idDepartment=@idDepartment)
RETURN -1

IF EXISTS (select * from Departments where name=@name and idDepartment!=@idDepartment)
RETURN -2

UPDATE Departments set name=@name where idDepartment=@idDepartment;

IF(@@ERROR<>0)
RETURN -3

RETURN 1

END
GO


CREATE OR ALTER PROCEDURE DeleteDepartment @idDepartment INT AS
BEGIN
IF NOT EXISTS(select * from Departments where idDepartment=@idDepartment)
RETURN -1

DELETE from Departments where idDepartment=@idDepartment;

IF(@@ERROR<>0)
RETURN -2

RETURN 1

END
GO

CREATE OR ALTER PROCEDURE AllDepartments AS
BEGIN
select * from Departments;
END
GO

CREATE OR ALTER PROCEDURE DepartmentByName @name INT AS
BEGIN
select * from Departments where name=@name
END
GO

CREATE OR ALTER PROCEDURE DepartmentById @idDepartment INT AS
BEGIN
select * from Departments where idDepartment=@idDepartment
END

GO
------------------------------------------------------------------------------------------------------------------
--Crimes  PROCEDURES

CREATE OR ALTER PROCEDURE AddCrime @category VARCHAR(20),@description VARCHAR(700) AS

BEGIN

IF EXISTS (select * from Crimes where category=@category)
RETURN -1

INSERT INTO Crimes VALUES(@category,@description);

IF(@@ERROR<>0)
RETURN -2

RETURN 1

END

GO

CREATE OR ALTER PROCEDURE UpdateCrime @category VARCHAR(20),@description VARCHAR(700) AS

BEGIN

IF NOT EXISTS (select * from Crimes where category=@category)
RETURN -1

UPDATE Crimes set description=@description where category=@category;

IF(@@ERROR<>0)
RETURN -2

RETURN 1

END

GO

CREATE OR ALTER PROCEDURE DeleteCrime @category VARCHAR(20) AS
BEGIN

IF NOT EXISTS(select * from Crimes where category=@category)
RETURN -1

DELETE from Crimes where category=@category;

IF(@@ERROR<>0)
RETURN -2

RETURN 1

END
GO

CREATE OR ALTER PROCEDURE CrimesTypeOptions AS
BEGIN

select * from Crimes where category ='Asesinato' or category ='Hurto' or category ='Rapiña';
END
GO

CREATE OR ALTER PROCEDURE GetAllTypeCrimes AS
BEGIN

select * from Crimes;
END

GO

CREATE OR ALTER PROCEDURE CrimeByCategory @category VARCHAR(30) AS
BEGIN

select * from Crimes where category=@category;
END

GO

------------------------------------------------------------------------------------------------------------------
--Neighborhoods PROCEDURES

CREATE OR ALTER PROCEDURE AddNeighborhood @name VARCHAR(30), @idDepartment INT AS

BEGIN

IF EXISTS (select * from Neighborhoods where name=@name)
RETURN -1


IF NOT EXISTS (select * from Departments where idDepartment=@idDepartment)
RETURN -2

INSERT INTO Neighborhoods VALUES(@name,@idDepartment);

IF(@@ERROR<>0)
RETURN -3

RETURN 1

END

GO

CREATE OR ALTER PROCEDURE UpdateNeighborhood @name VARCHAR(30),@idDepartment INT AS
BEGIN

IF NOT EXISTS (select * from Departments where idDepartment=@idDepartment)
RETURN -1

UPDATE Neighborhoods set department=@idDepartment where name=@name;

IF(@@ERROR<>0)
RETURN -2

RETURN 1

END
GO

CREATE OR ALTER PROCEDURE DeleteNeighborhood @neighborhood VARCHAR(30) AS
BEGIN

IF NOT EXISTS(select * from Neighborhood where name=@neighborhood)
RETURN -1
DELETE from Neighborhood where name=@neighborhood;

IF(@@ERROR<>0)
RETURN -2

RETURN 1

END
GO

CREATE OR ALTER PROCEDURE AllNeighborhoods AS
BEGIN
select * from Neighborhoods;
END
GO

CREATE OR ALTER PROCEDURE NeighborhoodByName @name VARCHAR(30) AS
BEGIN
select * from Neighborhoods where name=@name;
END
GO

------------------------------------------------------------------------------------------------------------------
--Population PROCEDURES

CREATE OR ALTER PROCEDURE AddPopulation @neighbordhood VARCHAR(30), @quantity INT,@year INT AS

BEGIN
IF(@quantity<0)
RETURN -1

IF(@year>YEAR(GETDATE()))
RETURN -2

IF NOT EXISTS (select * from Neighborhoods where name=@neighbordhood) 
RETURN -3

IF EXISTS (select * from Population where neighborhood=@neighbordhood and year=@year) 
RETURN -4

INSERT INTO Population VALUES(@neighbordhood,@quantity,@year);

IF(@@ERROR<>0)
RETURN -5

RETURN 1

END

GO


CREATE OR ALTER PROCEDURE UpdatePopulation @idPopulation INT,@quantity INT,@year INT, @neighborhood VARCHAR(30) AS
BEGIN

IF (@quantity<0)
RETURN -1

IF(@year>YEAR(GETDATE()))
RETURN -2

IF NOT EXISTS (select * from Population where @idPopulation=idPopulation)
RETURN -3

IF NOT EXISTS (select * from Neighborhoods where name=@neighborhood)
RETURN -4

IF EXISTS (select * from Population where neighborhood=@neighborhood and year=@year and idPopulation!=@idPopulation)
RETURN -5

UPDATE Population set quantity=@quantity,year=@year,neighborhood=@neighborhood where @idPopulation=idPopulation;

IF(@@ERROR<>0)
RETURN -6

RETURN 1

END
GO


CREATE OR ALTER PROCEDURE DeletePopulation @idPopulation INT AS
BEGIN

IF NOT EXISTS(select * from Population where @idPopulation=idPopulation )
RETURN -1

DELETE from Population where idPopulation=@idPopulation ;

IF(@@ERROR<>0)
RETURN -2

RETURN 1

END
GO



------------------------------------------------------------------------------------------------------------------
--NeighborhoodCrimes PROCEDURES

CREATE OR ALTER PROCEDURE AddNeighborhoodCrime @neighborhood VARCHAR(30),@crime VARCHAR(20),@quantity INT,@year INT AS

BEGIN

IF @quantity<0
RETURN -1

IF @year>YEAR(GETDATE())
RETURN -2
IF NOT EXISTS (select * from Neighborhoods where name=@neighborhood)
RETURN -3

IF NOT EXISTS (select * from Crimes where category=@crime)
RETURN -4

IF EXISTS (select * from Neighborhoods_Crimes where neighborhood=@neighborhood and crime=@crime and year=@year)
RETURN -5

INSERT INTO Neighborhoods_Crimes VALUES(@neighborhood,@crime,@quantity,@year)

IF(@@ERROR<>0)
RETURN -6

RETURN 1
END
GO


CREATE OR ALTER PROCEDURE UpdateNeighborhoodCrime @neighborhood VARCHAR(30),@crime VARCHAR(20),@quantity INT,@year INT AS

BEGIN

IF @quantity<0
RETURN -1

IF @year>YEAR(GETDATE())
RETURN -2

IF NOT EXISTS (select * from Neighborhoods_Crimes  where neighborhood=@neighborhood and crime=@crime and year=@year)
RETURN -3

UPDATE Neighborhoods_Crimes set quantity=@quantity where neighborhood=@neighborhood and crime=@crime and year=@year

IF(@@ERROR<>0)
RETURN -4

RETURN 1

END
GO

CREATE OR ALTER PROCEDURE DeleteNeighborhoodCrime @crime VARCHAR(20),@neighborhood VARCHAR(30),@year INT AS
BEGIN

IF NOT EXISTS(select * from Neighborhoods_Crimes where crime=@crime and neighborhood=@neighborhood and @year=year)
RETURN -1

DELETE from Neighborhoods_Crimes where crime=@crime and neighborhood=@neighborhood and @year=year;

IF(@@ERROR<>0)
RETURN -2

RETURN 1

END
GO



CREATE OR ALTER PROCEDURE NeighborhoodsCrimeByYear @crime VARCHAR(20),@year INT AS
BEGIN


select name,P.quantity as 'quantiyPopulation',P.year as 'yearPopulation',NC.quantity as 'quantiyCrime',NC.year as 'yearCrime'
from Neighborhoods N LEFT JOIN Neighborhoods_Crimes NC on N.name=NC.neighborhood INNER JOIN 
(select * from Population where (CASE when @year>=year THEN (@year-year)WHEN year>=@year THEN(year-@year)END)=
(select TOP 1 (CASE when @year>=year THEN (@year-year)WHEN year>=@year THEN(year-@year)END)  as 'diferencia' 
from Population ORDER BY 'diferencia' asc)) P on P.neighborhood=NC.neighborhood 
where crime=@crime and NC.year=@year ORDER BY (CASE when NC.quantity is null then null WHEN NC.quantity is not null 
THEN((CAST (NC.quantity AS DECIMAL(7,2))/P.quantity)*100000) END) desc;

END

GO

CREATE OR ALTER PROCEDURE QuantityCategoryCrimeInNeighborhood @neighborhood VARCHAR(30),@crime VARCHAR(20) AS
BEGIN 

select * from Neighborhoods_Crimes where neighborhood=@neighborhood and crime=@crime ORDER BY YEAR;
END

GO


------------------------------------------------------------------------------------------------------------------
--Participants PROCEDURES


CREATE OR ALTER PROCEDURE AddParticipant @email VARCHAR(30) AS

BEGIN

IF (PATINDEX('%@[a-zA-Z]%.com%%',@email)=0)
RETURN -1

IF EXISTS (select * from Participants where email=@email)
RETURN -2

INSERT INTO Participants(email,lastIncome) VALUES(@email,NULL)

IF(@@ERROR<>0)
RETURN -3

RETURN 1
END
GO

CREATE OR ALTER PROCEDURE DeleteParticipant @email VARCHAR(30) AS
BEGIN 

IF NOT EXISTS(select * from Participants where email=@email)
RETURN -1

delete from Participants where email=@email
IF(@@ERROR<>0)
RETURN -2

END

GO

CREATE OR ALTER PROCEDURE ParticipantByEmail @email VARCHAR(30) AS
BEGIN 
select * from Participants where email=@email
END

GO

--EXEC  DeleteParticipant  'agus20m05@gmail.com'

------------------------------------------------------------------------------------------------------------------
--VerificationsCodes PROCEDURES


CREATE OR ALTER PROCEDURE AddVerificationCode @code VARCHAR(60),@participant VARCHAR(30),@expiration DATETIME AS

BEGIN

IF @expiration<GETDATE()
RETURN -1

IF NOT EXISTS (select * from Participants where email=@participant)
RETURN -2

IF EXISTS (select * from Verifications_Codes where code=@code)
RETURN -3

INSERT INTO Verifications_Codes VALUES(@code,@participant,@expiration)

IF(@@ERROR<>0)
RETURN -4

RETURN 1
END
GO


CREATE OR ALTER PROCEDURE VerificationCodeMostRecentlyByEmail @email VARCHAR(30) AS
BEGIN 

select TOP 1 *  from Verifications_Codes where participant=@email ORDER BY expiration DESC
END

GO

------------------------------------------------------------------------------------------------------------------
--Quizes PROCEDURES


CREATE OR ALTER PROCEDURE AddQuiz @participant VARCHAR(30),@neighborhood VARCHAR(30),@secure BIT AS
BEGIN


IF NOT EXISTS (select * from  Participants where email=@participant)
RETURN -1

IF NOT EXISTS (select * from Neighborhoods where name=@neighborhood)
RETURN -2

IF EXISTS (select * from Quizes where participant=@participant and YEAR(quizDate)=YEAR(GETDATE()) and neighborhood=@neighborhood)
RETURN -3

INSERT INTO Quizes VALUES(@participant,@neighborhood,@secure,GETDATE());
IF(@@ERROR<>0)
RETURN -4

RETURN IDENT_CURRENT('Quizes');

END
GO



CREATE OR ALTER PROCEDURE UpdateQuiz @idQuiz INT,@secure BIT AS
BEGIN

IF NOT EXISTS(select * from Quizes where idQuiz=@idQuiz)
RETURN -1

UPDATE Quizes set secure=@secure where idQuiz=@idQuiz;

IF(@@ERROR<>0)
RETURN -2

RETURN 1

END
GO


CREATE OR ALTER PROCEDURE DeleteQuiz @idQuiz INT AS
BEGIN

IF NOT EXISTS(select * from Quizes where idQuiz=@idQuiz)
RETURN -1

DELETE from Quizes where idQuiz=@idQuiz;

IF(@@ERROR<>0)
RETURN -2

RETURN 1

END
GO

CREATE OR ALTER PROCEDURE QuizesNeighbordhoodByYear @year INT AS
BEGIN 

select Neighborhoods.name,t1.secure,t2.insecure from Neighborhoods LEFT JOIN (select neighborhood,COUNT(*) as 'secure' 
from Quizes where YEAR(quizDate)=@year and secure=1 GROUP BY neighborhood) as t1 on t1.neighborhood=Neighborhoods.name 
LEFT JOIN (select neighborhood,COUNT(*) as 'insecure' 
from Quizes where YEAR(quizDate)=@year and secure=0 GROUP BY neighborhood) as t2 on t2.neighborhood=Neighborhoods.name;

END

GO

CREATE OR ALTER PROCEDURE QuizNeighborhoodParticipant @participant VARCHAR(30),@neighborhood VARCHAR(30) AS
BEGIN 

select * from Quizes where participant=@participant and neighborhood=@neighborhood and YEAR(GETDATE())=YEAR(quizDate)
END

GO


------------------------------------------------------------------------------------------------------------------
--QuizesCrimes PROCEDURES

CREATE OR ALTER PROCEDURE AddQuizCrime @idQuiz INT,@crime VARCHAR(20)AS
BEGIN

IF NOT EXISTS (select * from Quizes where idQuiz=@idQuiz)
RETURN -1

IF NOT EXISTS (select * from Crimes where category=@crime)
RETURN -2

IF EXISTS(select * from Quizes_Crimes where quiz=@idQuiz and crime=@crime)
RETURN -3

INSERT INTO Quizes_Crimes VALUES(@idQuiz,@crime);
IF(@@ERROR<>0)
RETURN -4

RETURN 1

END
GO


CREATE OR ALTER PROCEDURE DeleteQuizCrime @idQuiz INT,@category VARCHAR(20) AS
BEGIN

IF NOT EXISTS(select * from Quizes_Crimes where quiz=@idQuiz and crime=@category)
RETURN -1

DELETE from Quizes_Crimes where quiz=@idQuiz and crime=@category;

IF(@@ERROR<>0)
RETURN -2

RETURN 1

END
GO


CREATE OR ALTER PROCEDURE CrimesQuiz @idQuiz INT AS
BEGIN 

select * from Quizes_Crimes where quiz=@idQuiz
END

GO

------------------------------------------------------------------------------------------------------------------

EXEC AddDepartment 'Montevideo';

EXEC AddNeighborhood 'Aguada',1;
EXEC AddNeighborhood 'Aires Puros',1;
EXEC AddNeighborhood 'Atahualpa',1;
EXEC AddNeighborhood 'Bañados de Carrasco',1;
EXEC AddNeighborhood 'Barrio Sur',1;
EXEC AddNeighborhood 'Belvedere',1;
EXEC AddNeighborhood 'Brazo Oriental',1
EXEC AddNeighborhood 'Buceo',1;
EXEC AddNeighborhood 'Capurro - Bella Vista',1;
EXEC AddNeighborhood 'Carrasco',1;
EXEC AddNeighborhood 'Carrasco Norte',1;
EXEC AddNeighborhood 'Casabó - Pajas Blancas',1;
EXEC AddNeighborhood 'Casavalle',1;
EXEC AddNeighborhood 'Castro - Pérez Castellanos',1;
EXEC AddNeighborhood 'Centro',1;
EXEC AddNeighborhood 'Cerrito',1;
EXEC AddNeighborhood 'Ciudad Vieja',1;
EXEC AddNeighborhood 'Colón Centro y Noroeste',1;
EXEC AddNeighborhood 'Colón Sureste - Abayubá',1;
EXEC AddNeighborhood 'Conciliación',1;
EXEC AddNeighborhood 'Cordón',1;
EXEC AddNeighborhood 'Flor de Maroñas',1;
EXEC AddNeighborhood 'Ituzaingó',1;
EXEC AddNeighborhood 'Jacinto Vera',1;
EXEC AddNeighborhood 'Jardines del Hipódromo',1;
EXEC AddNeighborhood 'La Blanqueada',1
EXEC AddNeighborhood 'La Comercial',1;
EXEC AddNeighborhood 'Las Canteras',1;
EXEC AddNeighborhood 'La Figurita',1;
EXEC AddNeighborhood 'Larrañaga',1;
EXEC AddNeighborhood 'La Paloma - Tomkinson',1;
EXEC AddNeighborhood 'Las Acacias',1;
EXEC AddNeighborhood 'La Teja',1;
EXEC AddNeighborhood 'Lezica - Melilla',1;
EXEC AddNeighborhood 'Malvín',1;
EXEC AddNeighborhood 'Malvín Norte',1;
EXEC AddNeighborhood 'Manga',1;
EXEC AddNeighborhood 'Manga, Toledo Chico',1;
EXEC AddNeighborhood 'Maroñas - Parque Guaraní',1;
EXEC AddNeighborhood 'Mercado Modelo y Bolívar',1;
EXEC AddNeighborhood 'Nuevo París',1;
EXEC AddNeighborhood 'Palermo',1;
EXEC AddNeighborhood 'Parque Batlle - Villa Dolores',1;
EXEC AddNeighborhood 'Parque Rodó',1;
EXEC AddNeighborhood 'Paso de la Arena',1;
EXEC AddNeighborhood 'Paso de las Duranas',1;
EXEC AddNeighborhood 'Peñarol - Lavalleja',1;
EXEC AddNeighborhood 'Piedras Blancas',1;
EXEC AddNeighborhood 'Pocitos',1;
EXEC AddNeighborhood 'Prado - Nueva Savona',1;
EXEC AddNeighborhood 'Punta Carretas',1;
EXEC AddNeighborhood 'Punta Gorda',1;
EXEC AddNeighborhood 'Punta Rieles - Bella Italia',1;
EXEC AddNeighborhood 'Reducto',1;
EXEC AddNeighborhood 'Sayago',1;
EXEC AddNeighborhood 'Tres Cruces',1;
EXEC AddNeighborhood 'Tres Ombúes - Pueblo Victoria',1;
EXEC AddNeighborhood 'Unión',1;
EXEC AddNeighborhood 'Villa del Cerro',1;
EXEC AddNeighborhood 'Villa Española',1;
EXEC AddNeighborhood 'Villa García - Manga Rural',1;
EXEC AddNeighborhood 'Villa Muñoz - Retiro',1;



EXEC AddPopulation 'Aguada',19038,2023;
EXEC AddPopulation 'Aires Puros',14657,2023;
EXEC AddPopulation 'Atahualpa',7864,2023;
EXEC AddPopulation 'Bañados de Carrasco',13924,2023;
EXEC AddPopulation 'Barrio Sur',13953,2023;
EXEC AddPopulation 'Belvedere',20120,2023;
EXEC AddPopulation 'Brazo Oriental',16096,2023;
EXEC AddPopulation 'Buceo',36320,2023;
EXEC AddPopulation 'Capurro - Bella Vista',16336,2023;
EXEC AddPopulation 'Carrasco',14792,2023;
EXEC AddPopulation 'Carrasco Norte',13020,2023;
EXEC AddPopulation 'Casabó - Pajas Blancas',29314,2023;
EXEC AddPopulation 'Casavalle',29851,2023;
EXEC AddPopulation 'Castro - Pérez Castellanos',13245,2023;
EXEC AddPopulation 'Centro',23335,2023;
EXEC AddPopulation 'Cerrito',15718,2023;
EXEC AddPopulation 'Ciudad Vieja',13598,2023;
EXEC AddPopulation 'Colón Centro y Noroeste',26855,2023;
EXEC AddPopulation 'Colón Sureste - Abayubá',14354,2023;
EXEC AddPopulation 'Conciliación',19510,2023;
EXEC AddPopulation 'Cordón',44172,2023;
EXEC AddPopulation 'Flor de Maroñas',16873,2023;
EXEC AddPopulation 'Ituzaingó',12525,2023;
EXEC AddPopulation 'Jacinto Vera',8204,2023;
EXEC AddPopulation 'Jardines del Hipódromo',19098,2023;
EXEC AddPopulation 'La Blanqueada', 9585,2023;
EXEC AddPopulation 'La Comercial',11110,2023;
EXEC AddPopulation 'La Figurita',9990,2023;
EXEC AddPopulation 'Larrañaga',18509,2023;
EXEC AddPopulation 'Las Canteras',21448,2023;
EXEC AddPopulation 'La Paloma - Tomkinson',38189,2023;
EXEC AddPopulation 'Las Acacias',19339,2023;
EXEC AddPopulation 'La Teja',18308,2023;
EXEC AddPopulation 'Lezica - Melilla',16929,2023;
EXEC AddPopulation 'Malvín',29085,2023;
EXEC AddPopulation 'Malvín Norte',17045,2023;
EXEC AddPopulation 'Manga',19124,2023;
EXEC AddPopulation 'Manga, Toledo Chico',26746,2023;
EXEC AddPopulation 'Maroñas - Parque Guaraní',20401,2023
EXEC AddPopulation 'Mercado Modelo y Bolívar',15374,2023;
EXEC AddPopulation 'Nuevo París',29405,2023;
EXEC AddPopulation 'Palermo',12611,2023;
EXEC AddPopulation 'Parque Batlle - Villa Dolores',29474,2023;
EXEC AddPopulation 'Parque Rodó',12809,2023;
EXEC AddPopulation 'Paso de la Arena',26081,2023;
EXEC AddPopulation 'Paso de las Duranas',11972,2023;
EXEC AddPopulation 'Peñarol - Lavalleja',31748,2023;
EXEC AddPopulation 'Piedras Blancas',20668,2023
EXEC AddPopulation 'Pocitos',69107,2023
EXEC AddPopulation 'Prado - Nueva Savona',19125,2023
EXEC AddPopulation 'Punta Carretas',24654,2023
EXEC AddPopulation 'Punta Gorda',13596,2023
EXEC AddPopulation 'Punta Rieles - Bella Italia',23596,2023
EXEC AddPopulation 'Reducto',13214,2023
EXEC AddPopulation 'Sayago',13756,2023
EXEC AddPopulation 'Tres Cruces',16668,2023
EXEC AddPopulation 'Tres Ombúes - Pueblo Victoria',17700,2023
EXEC AddPopulation 'Unión',37488,2023
EXEC AddPopulation 'Villa del Cerro',26730,2023
EXEC AddPopulation 'Villa Española',20792,2023
EXEC AddPopulation 'Villa García - Manga Rural',31166,2023
EXEC AddPopulation 'Villa Muñoz - Retiro',13095,2023



EXEC AddCrime 'Asesinato','Por homicidio se entiende la muerte infligida a
una persona en forma intencional e ilegal, por otra u otras. Se excluyen, pues,
las muertes causadas por negligencia, suicidio o accidente, así como los decesos que son fruto de actos de funcionarios policiales en 
cumplimiento de la ley o de acciones realizadas por civiles en legítima defensa.'

EXEC AddCrime 'Hurto','Se entiende por hurto cualquier acto que implique sustraer, tomar o
apartar ilegalmente cualquier propiedad o bien mueble de la posesión, control
o custodia legítimos de cualquier persona. A modo de ejemplo, incluye delitos
como el hurto de vehículos de motor, el hurto de piezas de vehículos, el hurto
de efectos depositados en el interior de viviendas y vehículos, el hurto de
artículos comerciales del interior de tiendas, el “arrebato” de carteras o
teléfonos celulares, el hurto de bicicletas, etc.siempre y cuando ninguno de
estos hechos impliquen violencia abierta, la amenaza de violencia o el fraude.'

EXEC AddCrime 'Rapiña','Se clasifican como Rapiñas todos los incidentes en que se sustrajo o
intentó sustraer, por medio de la fuerza o amenaza de uso de la fuerza,
cualquier objeto o propiedad, al cuidado o bajo la custodia de otra o varias
personas.'


EXEC AddCrime 'Tráfico de drogas','El delito de tráfico de drogas se define como un delito contra la salud pública que se 
comete al ejecutar actos de cultivo, elaboración o tráfico, o al promover, favorecer o facilitar el 
consumo ilegal de drogas tóxicas, estupefacientes o sustancias psicotrópicas, o cuando se poseen con los fines mencionados.'



EXEC AddNeighborhoodCrime 'Aguada','Asesinato',0,2024;
EXEC AddNeighborhoodCrime 'Atahualpa','Asesinato',0,2024;
EXEC AddNeighborhoodCrime 'Aires Puros','Asesinato',1,2024
EXEC AddNeighborhoodCrime 'Barrio Sur','Asesinato',1,2024
EXEC AddNeighborhoodCrime 'Bañados de Carrasco','Asesinato',7,2024
EXEC AddNeighborhoodCrime 'Belvedere','Asesinato',1,2024
EXEC AddNeighborhoodCrime 'Buceo','Asesinato',4,2024
EXEC AddNeighborhoodCrime 'Brazo Oriental','Asesinato',0,2024;
EXEC AddNeighborhoodCrime 'Casavalle','Asesinato',22,2024
EXEC AddNeighborhoodCrime 'Carrasco','Asesinato',0,2024
EXEC AddNeighborhoodCrime 'Carrasco Norte','Asesinato',0,2024
EXEC AddNeighborhoodCrime 'Casabó - Pajas Blancas','Asesinato',12,2024
EXEC AddNeighborhoodCrime 'Castro - Pérez Castellanos','Asesinato',1,2024
EXEC AddNeighborhoodCrime 'Capurro - Bella Vista','Asesinato',3,2024
EXEC AddNeighborhoodCrime 'Centro','Asesinato',1,2024
EXEC AddNeighborhoodCrime 'Cerrito','Asesinato',1,2024
EXEC AddNeighborhoodCrime 'Ciudad Vieja','Asesinato',0,2024
EXEC AddNeighborhoodCrime 'Colón Centro y Noroeste','Asesinato',0,2024
EXEC AddNeighborhoodCrime 'Colón Sureste - Abayubá','Asesinato',3,2024
EXEC AddNeighborhoodCrime 'Conciliación','Asesinato',5,2024
EXEC AddNeighborhoodCrime 'Cordón','Asesinato',1,2024
EXEC AddNeighborhoodCrime 'Flor de Maroñas','Asesinato',6,2024
EXEC AddNeighborhoodCrime 'Ituzaingó','Asesinato',1,2024
EXEC AddNeighborhoodCrime 'Jacinto Vera','Asesinato',0,2024
EXEC AddNeighborhoodCrime 'Jardines del Hipódromo','Asesinato',8,2024
EXEC AddNeighborhoodCrime 'La Blanqueada','Asesinato',0,2024
EXEC AddNeighborhoodCrime 'La Comercial','Asesinato',0,2024
EXEC AddNeighborhoodCrime 'La Figurita','Asesinato',0,2024
EXEC AddNeighborhoodCrime 'Larrañaga','Asesinato',1,2024
EXEC AddNeighborhoodCrime 'Las Canteras','Asesinato',4,2024
EXEC AddNeighborhoodCrime 'La Paloma - Tomkinson','Asesinato',36,2024
EXEC AddNeighborhoodCrime 'Las Acacias','Asesinato',7,2024
EXEC AddNeighborhoodCrime 'La Teja','Asesinato',1,2024
EXEC AddNeighborhoodCrime 'Lezica - Melilla','Asesinato',3,2024
EXEC AddNeighborhoodCrime 'Malvín','Asesinato',2,2024
EXEC AddNeighborhoodCrime 'Malvín Norte','Asesinato',7,2024
EXEC AddNeighborhoodCrime 'Manga','Asesinato',2,2024
EXEC AddNeighborhoodCrime 'Manga, Toledo Chico','Asesinato',6,2024
EXEC AddNeighborhoodCrime 'Maroñas - Parque Guaraní','Asesinato',2,2024
EXEC AddNeighborhoodCrime 'Mercado Modelo y Bolívar','Asesinato',0,2024
EXEC AddNeighborhoodCrime 'Nuevo París','Asesinato',9,2024 
EXEC AddNeighborhoodCrime 'Palermo','Asesinato',0,2024 
EXEC AddNeighborhoodCrime 'Parque Batlle - Villa Dolores','Asesinato',1,2024
EXEC AddNeighborhoodCrime 'Parque Rodó','Asesinato',0,2024
EXEC AddNeighborhoodCrime 'Paso de la Arena','Asesinato',1,2024
EXEC AddNeighborhoodCrime 'Paso de las Duranas','Asesinato',1,2024
EXEC AddNeighborhoodCrime 'Peñarol - Lavalleja','Asesinato',2,2024
EXEC AddNeighborhoodCrime 'Piedras Blancas','Asesinato',7,2024
EXEC AddNeighborhoodCrime 'Pocitos','Asesinato',0,2024 
EXEC AddNeighborhoodCrime 'Prado - Nueva Savona','Asesinato',3,2024
EXEC AddNeighborhoodCrime 'Punta Carretas','Asesinato',0,2024 
EXEC AddNeighborhoodCrime 'Punta Gorda','Asesinato',0,2024 
EXEC AddNeighborhoodCrime 'Punta Rieles - Bella Italia','Asesinato',7,2024 
EXEC AddNeighborhoodCrime 'Reducto','Asesinato',0,2024 
EXEC AddNeighborhoodCrime 'Sayago','Asesinato',4,2024
EXEC AddNeighborhoodCrime 'Tres Cruces','Asesinato',0,2024 
EXEC AddNeighborhoodCrime 'Tres Ombúes - Pueblo Victoria','Asesinato',4,2024
EXEC AddNeighborhoodCrime 'Unión','Asesinato',4,2024 
EXEC AddNeighborhoodCrime 'Villa del Cerro','Asesinato',12,2024
EXEC AddNeighborhoodCrime 'Villa Española','Asesinato',8,2024
EXEC AddNeighborhoodCrime 'Villa García - Manga Rural','Asesinato',9,2024
EXEC AddNeighborhoodCrime 'Villa Muñoz - Retiro','Asesinato',3,2024



EXEC AddNeighborhoodCrime 'Aguada','Hurto',1190,2024
EXEC AddNeighborhoodCrime 'Atahualpa','Hurto',null,2024;
EXEC AddNeighborhoodCrime 'Aires Puros','Hurto',null,2024
EXEC AddNeighborhoodCrime 'Barrio Sur','Hurto',null,2024
EXEC AddNeighborhoodCrime 'Bañados de Carrasco','Hurto',null,2024
EXEC AddNeighborhoodCrime 'Belvedere','Hurto',1014,2024
EXEC AddNeighborhoodCrime 'Buceo','Hurto',2376,2024
EXEC AddNeighborhoodCrime 'Brazo Oriental','Hurto',745,2024
EXEC AddNeighborhoodCrime 'Casavalle','Hurto',701,2024
EXEC AddNeighborhoodCrime 'Carrasco','Hurto',null,2024
EXEC AddNeighborhoodCrime 'Carrasco Norte','Hurto',null,2024
EXEC AddNeighborhoodCrime 'Casabó - Pajas Blancas','Hurto',null,2024
EXEC AddNeighborhoodCrime 'Castro - Pérez Castellanos','Hurto',null,2024
EXEC AddNeighborhoodCrime 'Capurro - Bella Vista','Hurto',null,2024
EXEC AddNeighborhoodCrime 'Centro','Hurto',2493,2024
EXEC AddNeighborhoodCrime 'Cerrito','Hurto',611,2024
EXEC AddNeighborhoodCrime 'Ciudad Vieja','Hurto',1022,2024
EXEC AddNeighborhoodCrime 'Colón Centro y Noroeste','Hurto',null,2024
EXEC AddNeighborhoodCrime 'Colón Sureste - Abayubá','Hurto',1299,2024
EXEC AddNeighborhoodCrime 'Conciliación','Hurto',null,2024
EXEC AddNeighborhoodCrime 'Cordón','Hurto',2943,2024
EXEC AddNeighborhoodCrime 'Flor de Maroñas','Hurto',818,2024
EXEC AddNeighborhoodCrime 'Ituzaingó','Hurto',691,2024
EXEC AddNeighborhoodCrime 'Jacinto Vera','Hurto',null,2024
EXEC AddNeighborhoodCrime 'Jardines del Hipódromo','Hurto',null,2024
EXEC AddNeighborhoodCrime 'La Blanqueada','Hurto',832,2024
EXEC AddNeighborhoodCrime 'La Comercial','Hurto',null,2024
EXEC AddNeighborhoodCrime 'La Figurita','Hurto',null,2024
EXEC AddNeighborhoodCrime 'Larrañaga','Hurto',983,2024
EXEC AddNeighborhoodCrime 'Las Canteras','Hurto',633,2024
EXEC AddNeighborhoodCrime 'La Paloma - Tomkinson','Hurto',679,2024
EXEC AddNeighborhoodCrime 'Las Acacias','Hurto',null,2024
EXEC AddNeighborhoodCrime 'La Teja','Hurto',743,2024
EXEC AddNeighborhoodCrime 'Lezica - Melilla','Hurto',665,2024
EXEC AddNeighborhoodCrime 'Malvín','Hurto',1272,2024
EXEC AddNeighborhoodCrime 'Malvín Norte','Hurto',null,2024
EXEC AddNeighborhoodCrime 'Manga','Hurto',null,2024
EXEC AddNeighborhoodCrime 'Manga, Toledo Chico','Hurto',null,2024
EXEC AddNeighborhoodCrime 'Maroñas - Parque Guaraní','Hurto',694,2024
EXEC AddNeighborhoodCrime 'Mercado Modelo y Bolívar','Hurto',1227,2024
EXEC AddNeighborhoodCrime 'Nuevo París','Hurto',849,2024
EXEC AddNeighborhoodCrime 'Palermo','Hurto',null,2024 
EXEC AddNeighborhoodCrime 'Parque Batlle - Villa Dolores','Hurto',2063,2024
EXEC AddNeighborhoodCrime 'Parque Rodó','Hurto',643,2024
EXEC AddNeighborhoodCrime 'Paso de la Arena','Hurto',741,2024
EXEC AddNeighborhoodCrime 'Paso de las Duranas','Hurto',null,2024
EXEC AddNeighborhoodCrime 'Peñarol - Lavalleja','Hurto',791,2024
EXEC AddNeighborhoodCrime 'Piedras Blancas','Hurto',718,2024
EXEC AddNeighborhoodCrime 'Pocitos','Hurto',2252,2024
EXEC AddNeighborhoodCrime 'Prado - Nueva Savona','Hurto',1296,2024
EXEC AddNeighborhoodCrime 'Punta Carretas','Hurto',1164,2024 
EXEC AddNeighborhoodCrime 'Punta Gorda','Hurto',null,2024 
EXEC AddNeighborhoodCrime 'Punta Rieles - Bella Italia','Hurto',832,2024
EXEC AddNeighborhoodCrime 'Reducto','Hurto',null,2024 
EXEC AddNeighborhoodCrime 'Sayago','Hurto',null,2024
EXEC AddNeighborhoodCrime 'Tres Cruces','Hurto',1494,2024
EXEC AddNeighborhoodCrime 'Tres Ombúes - Pueblo Victoria','Hurto',null,2024
EXEC AddNeighborhoodCrime 'Unión','Hurto',3113,2024
EXEC AddNeighborhoodCrime 'Villa del Cerro','Hurto',857,2024
EXEC AddNeighborhoodCrime 'Villa Española','Hurto',630,2024
EXEC AddNeighborhoodCrime 'Villa García - Manga Rural','Hurto',307,2024
EXEC AddNeighborhoodCrime 'Villa Muñoz - Retiro','Hurto',null,2024


EXEC AddNeighborhoodCrime 'Aguada','Rapiña',null,2024
EXEC AddNeighborhoodCrime 'Atahualpa','Rapiña',null,2024;
EXEC AddNeighborhoodCrime 'Aires Puros','Rapiña',null,2024
EXEC AddNeighborhoodCrime 'Barrio Sur','Rapiña',null,2024
EXEC AddNeighborhoodCrime 'Bañados de Carrasco','Rapiña',null,2024
EXEC AddNeighborhoodCrime 'Belvedere','Rapiña',293,2024
EXEC AddNeighborhoodCrime 'Buceo','Rapiña',352,2024
EXEC AddNeighborhoodCrime 'Brazo Oriental','Rapiña',null,2024
EXEC AddNeighborhoodCrime 'Casavalle','Rapiña',635,2024
EXEC AddNeighborhoodCrime 'Carrasco','Rapiña',null,2024
EXEC AddNeighborhoodCrime 'Carrasco Norte','Rapiña',null,2024
EXEC AddNeighborhoodCrime 'Casabó - Pajas Blancas','Rapiña',281,2024
EXEC AddNeighborhoodCrime 'Castro - Pérez Castellanos','Rapiña',null,2024
EXEC AddNeighborhoodCrime 'Capurro - Bella Vista','Rapiña',null,2024
EXEC AddNeighborhoodCrime 'Centro','Rapiña',288,2024
EXEC AddNeighborhoodCrime 'Cerrito','Rapiña',null,2024
EXEC AddNeighborhoodCrime 'Ciudad Vieja','Rapiña',null,2024
EXEC AddNeighborhoodCrime 'Colón Centro y Noroeste','Rapiña',521,2024
EXEC AddNeighborhoodCrime 'Colón Sureste - Abayubá','Rapiña',null,2024
EXEC AddNeighborhoodCrime 'Conciliación','Rapiña',243,2024
EXEC AddNeighborhoodCrime 'Cordón','Rapiña',285,2024
EXEC AddNeighborhoodCrime 'Flor de Maroñas','Rapiña',324,2024
EXEC AddNeighborhoodCrime 'Ituzaingó','Rapiña',215,2024
EXEC AddNeighborhoodCrime 'Jacinto Vera','Rapiña',null,2024
EXEC AddNeighborhoodCrime 'Jardines del Hipódromo','Rapiña',369,2024
EXEC AddNeighborhoodCrime 'La Blanqueada','Rapiña',null,2024
EXEC AddNeighborhoodCrime 'La Comercial','Rapiña',null,2024
EXEC AddNeighborhoodCrime 'La Figurita','Rapiña',null,2024
EXEC AddNeighborhoodCrime 'Larrañaga','Rapiña',null,2024
EXEC AddNeighborhoodCrime 'Las Canteras','Rapiña',207,2024
EXEC AddNeighborhoodCrime 'La Paloma - Tomkinson','Rapiña',362,2024
EXEC AddNeighborhoodCrime 'Las Acacias','Rapiña',272,2024
EXEC AddNeighborhoodCrime 'La Teja','Rapiña',193,2024
EXEC AddNeighborhoodCrime 'Lezica - Melilla','Rapiña',242,2024
EXEC AddNeighborhoodCrime 'Malvín','Rapiña',239,2024
EXEC AddNeighborhoodCrime 'Malvín Norte','Rapiña',730,2024
EXEC AddNeighborhoodCrime 'Manga','Rapiña',190,2024
EXEC AddNeighborhoodCrime 'Manga, Toledo Chico','Rapiña',306,2024
EXEC AddNeighborhoodCrime 'Maroñas - Parque Guaraní','Rapiña',331,2024
EXEC AddNeighborhoodCrime 'Mercado Modelo y Bolívar','Rapiña',192,2024
EXEC AddNeighborhoodCrime 'Nuevo París','Rapiña',317,2024
EXEC AddNeighborhoodCrime 'Palermo','Rapiña',null,2024 
EXEC AddNeighborhoodCrime 'Parque Batlle - Villa Dolores','Rapiña',207,2024
EXEC AddNeighborhoodCrime 'Parque Rodó','Rapiña',643,2024
EXEC AddNeighborhoodCrime 'Paso de la Arena','Rapiña',446,2024
EXEC AddNeighborhoodCrime 'Paso de las Duranas','Rapiña',null,2024
EXEC AddNeighborhoodCrime 'Peñarol - Lavalleja','Rapiña',491,2024
EXEC AddNeighborhoodCrime 'Piedras Blancas','Rapiña',385,2024
EXEC AddNeighborhoodCrime 'Pocitos','Rapiña',null,2024
EXEC AddNeighborhoodCrime 'Prado - Nueva Savona','Rapiña',265,2024
EXEC AddNeighborhoodCrime 'Punta Carretas','Rapiña',null,2024 
EXEC AddNeighborhoodCrime 'Punta Gorda','Rapiña',null,2024 
EXEC AddNeighborhoodCrime 'Punta Rieles - Bella Italia','Rapiña',375,2024
EXEC AddNeighborhoodCrime 'Reducto','Rapiña',null,2024 
EXEC AddNeighborhoodCrime 'Sayago','Rapiña',null,2024
EXEC AddNeighborhoodCrime 'Tres Cruces','Rapiña',null,2024
EXEC AddNeighborhoodCrime 'Tres Ombúes - Pueblo Victoria','Rapiña',null,2024
EXEC AddNeighborhoodCrime 'Unión','Rapiña',522,2024
EXEC AddNeighborhoodCrime 'Villa del Cerro','Rapiña',468,2024
EXEC AddNeighborhoodCrime 'Villa Española','Rapiña',null,2024
EXEC AddNeighborhoodCrime 'Villa García - Manga Rural','Rapiña',341,2024
EXEC AddNeighborhoodCrime 'Villa Muñoz - Retiro','Rapiña',null,2024

GO


EXEC AddNeighborhoodCrime 'Aguada','Asesinato',1,2023;
EXEC AddNeighborhoodCrime 'Atahualpa','Asesinato',0,2023;
EXEC AddNeighborhoodCrime 'Aires Puros','Asesinato',0,2023
EXEC AddNeighborhoodCrime 'Barrio Sur','Asesinato',0,2023
EXEC AddNeighborhoodCrime 'Bañados de Carrasco','Asesinato',1,2023
EXEC AddNeighborhoodCrime 'Belvedere','Asesinato',4,2023
EXEC AddNeighborhoodCrime 'Buceo','Asesinato',0,2023
EXEC AddNeighborhoodCrime 'Brazo Oriental','Asesinato',0,2023;
EXEC AddNeighborhoodCrime 'Casavalle','Asesinato',13,2023
EXEC AddNeighborhoodCrime 'Carrasco','Asesinato',0,2023
EXEC AddNeighborhoodCrime 'Carrasco Norte','Asesinato',1,2023
EXEC AddNeighborhoodCrime 'Casabó - Pajas Blancas','Asesinato',11,2023
EXEC AddNeighborhoodCrime 'Castro - Pérez Castellanos','Asesinato',3,2023
EXEC AddNeighborhoodCrime 'Capurro - Bella Vista','Asesinato',0,2023
EXEC AddNeighborhoodCrime 'Centro','Asesinato',0,2023
EXEC AddNeighborhoodCrime 'Cerrito','Asesinato',7,2023
EXEC AddNeighborhoodCrime 'Ciudad Vieja','Asesinato',2,2023
EXEC AddNeighborhoodCrime 'Colón Centro y Noroeste','Asesinato',3,2023
EXEC AddNeighborhoodCrime 'Colón Sureste - Abayubá','Asesinato',5,2023
EXEC AddNeighborhoodCrime 'Conciliación','Asesinato',5,2023
EXEC AddNeighborhoodCrime 'Cordón','Asesinato',0,2023
EXEC AddNeighborhoodCrime 'Flor de Maroñas','Asesinato',6,2023
EXEC AddNeighborhoodCrime 'Ituzaingó','Asesinato',3,2023
EXEC AddNeighborhoodCrime 'Jacinto Vera','Asesinato',0,2023
EXEC AddNeighborhoodCrime 'Jardines del Hipódromo','Asesinato',1,2023
EXEC AddNeighborhoodCrime 'La Blanqueada','Asesinato',1,2023
EXEC AddNeighborhoodCrime 'La Comercial','Asesinato',1,2023
EXEC AddNeighborhoodCrime 'La Figurita','Asesinato',2,2023
EXEC AddNeighborhoodCrime 'Larrañaga','Asesinato',0,2023
EXEC AddNeighborhoodCrime 'Las Canteras','Asesinato',11,2023
EXEC AddNeighborhoodCrime 'La Paloma - Tomkinson','Asesinato',10,2023
EXEC AddNeighborhoodCrime 'Las Acacias','Asesinato',10,2023
EXEC AddNeighborhoodCrime 'La Teja','Asesinato',0,2023
EXEC AddNeighborhoodCrime 'Lezica - Melilla','Asesinato',2,2023
EXEC AddNeighborhoodCrime 'Malvín','Asesinato',0,2023
EXEC AddNeighborhoodCrime 'Malvín Norte','Asesinato',2,2023
EXEC AddNeighborhoodCrime 'Manga','Asesinato',4,2023
EXEC AddNeighborhoodCrime 'Manga, Toledo Chico','Asesinato',14,2023
EXEC AddNeighborhoodCrime 'Maroñas - Parque Guaraní','Asesinato',2,2023
EXEC AddNeighborhoodCrime 'Mercado Modelo y Bolívar','Asesinato',2,2023
EXEC AddNeighborhoodCrime 'Nuevo París','Asesinato',7,2023
EXEC AddNeighborhoodCrime 'Palermo','Asesinato',0,2023
EXEC AddNeighborhoodCrime 'Parque Batlle - Villa Dolores','Asesinato',0,2023
EXEC AddNeighborhoodCrime 'Parque Rodó','Asesinato',1,2023
EXEC AddNeighborhoodCrime 'Paso de la Arena','Asesinato',7,2023
EXEC AddNeighborhoodCrime 'Paso de las Duranas','Asesinato',1,2023
EXEC AddNeighborhoodCrime 'Peñarol - Lavalleja','Asesinato',4,2023
EXEC AddNeighborhoodCrime 'Piedras Blancas','Asesinato',8,2023
EXEC AddNeighborhoodCrime 'Pocitos','Asesinato',1,2023
EXEC AddNeighborhoodCrime 'Prado - Nueva Savona','Asesinato',0,2023
EXEC AddNeighborhoodCrime 'Punta Carretas','Asesinato',2,2023
EXEC AddNeighborhoodCrime 'Punta Gorda','Asesinato',0,2023
EXEC AddNeighborhoodCrime 'Punta Rieles - Bella Italia','Asesinato',5,2023 
EXEC AddNeighborhoodCrime 'Reducto','Asesinato',2,2023 
EXEC AddNeighborhoodCrime 'Sayago','Asesinato',1,2023
EXEC AddNeighborhoodCrime 'Tres Cruces','Asesinato',1,2023 
EXEC AddNeighborhoodCrime 'Tres Ombúes - Pueblo Victoria','Asesinato',8,2023
EXEC AddNeighborhoodCrime 'Unión','Asesinato',6,2023 
EXEC AddNeighborhoodCrime 'Villa del Cerro','Asesinato',9,2023
EXEC AddNeighborhoodCrime 'Villa Española','Asesinato',7,2023
EXEC AddNeighborhoodCrime 'Villa García - Manga Rural','Asesinato',8,2023
EXEC AddNeighborhoodCrime 'Villa Muñoz - Retiro','Asesinato',0,2023

GO


EXEC AddNeighborhoodCrime 'Aguada','Hurto',1190,2023
EXEC AddNeighborhoodCrime 'Atahualpa','Hurto',null,2023;
EXEC AddNeighborhoodCrime 'Aires Puros','Hurto',null,2023
EXEC AddNeighborhoodCrime 'Barrio Sur','Hurto',null,2023
EXEC AddNeighborhoodCrime 'Bañados de Carrasco','Hurto',null,2023
EXEC AddNeighborhoodCrime 'Belvedere','Hurto',917,2023
EXEC AddNeighborhoodCrime 'Buceo','Hurto',1914,2023
EXEC AddNeighborhoodCrime 'Brazo Oriental','Hurto',752,2023
EXEC AddNeighborhoodCrime 'Casavalle','Hurto',781,2023
EXEC AddNeighborhoodCrime 'Carrasco','Hurto',null,2023
EXEC AddNeighborhoodCrime 'Carrasco Norte','Hurto',null,2023
EXEC AddNeighborhoodCrime 'Casabó - Pajas Blancas','Hurto',null,2023
EXEC AddNeighborhoodCrime 'Castro - Pérez Castellanos','Hurto',null,2023
EXEC AddNeighborhoodCrime 'Capurro - Bella Vista','Hurto',599,2023
EXEC AddNeighborhoodCrime 'Centro','Hurto',2647,2023
EXEC AddNeighborhoodCrime 'Cerrito','Hurto',611,2023
EXEC AddNeighborhoodCrime 'Ciudad Vieja','Hurto',1220,2023
EXEC AddNeighborhoodCrime 'Colón Centro y Noroeste','Hurto',1170,2023
EXEC AddNeighborhoodCrime 'Colón Sureste - Abayubá','Hurto',1299,2023
EXEC AddNeighborhoodCrime 'Conciliación','Hurto',null,2023
EXEC AddNeighborhoodCrime 'Cordón','Hurto',3288 ,2023
EXEC AddNeighborhoodCrime 'Flor de Maroñas','Hurto',837,2023
EXEC AddNeighborhoodCrime 'Ituzaingó','Hurto',856,2023
EXEC AddNeighborhoodCrime 'Jacinto Vera','Hurto',null,2023
EXEC AddNeighborhoodCrime 'Jardines del Hipódromo','Hurto',null,2023
EXEC AddNeighborhoodCrime 'La Blanqueada','Hurto',816,2023
EXEC AddNeighborhoodCrime 'La Comercial','Hurto',null,2023
EXEC AddNeighborhoodCrime 'La Figurita','Hurto',null,2023
EXEC AddNeighborhoodCrime 'Larrañaga','Hurto',1078 ,2023
EXEC AddNeighborhoodCrime 'Las Canteras','Hurto',633,2023
EXEC AddNeighborhoodCrime 'La Paloma - Tomkinson','Hurto',697,2023
EXEC AddNeighborhoodCrime 'Las Acacias','Hurto',null,2023
EXEC AddNeighborhoodCrime 'La Teja','Hurto',727,2023
EXEC AddNeighborhoodCrime 'Lezica - Melilla','Hurto',871,2023
EXEC AddNeighborhoodCrime 'Malvín','Hurto',1123 ,2023
EXEC AddNeighborhoodCrime 'Malvín Norte','Hurto',null,2023
EXEC AddNeighborhoodCrime 'Manga','Hurto',null,2023
EXEC AddNeighborhoodCrime 'Manga, Toledo Chico','Hurto',null,2023
EXEC AddNeighborhoodCrime 'Maroñas - Parque Guaraní','Hurto',714,2023
EXEC AddNeighborhoodCrime 'Mercado Modelo y Bolívar','Hurto',1038 ,2023
EXEC AddNeighborhoodCrime 'Nuevo París','Hurto',1011,2023
EXEC AddNeighborhoodCrime 'Palermo','Hurto',null,2023
EXEC AddNeighborhoodCrime 'Parque Batlle - Villa Dolores','Hurto',1966,2023
EXEC AddNeighborhoodCrime 'Parque Rodó','Hurto',643,2023
EXEC AddNeighborhoodCrime 'Paso de la Arena','Hurto',807,2023
EXEC AddNeighborhoodCrime 'Paso de las Duranas','Hurto',null,2023
EXEC AddNeighborhoodCrime 'Peñarol - Lavalleja','Hurto',909,2023
EXEC AddNeighborhoodCrime 'Piedras Blancas','Hurto',711,2023
EXEC AddNeighborhoodCrime 'Pocitos','Hurto',1994,2023
EXEC AddNeighborhoodCrime 'Prado - Nueva Savona','Hurto',1482 ,2023
EXEC AddNeighborhoodCrime 'Punta Carretas','Hurto',1150 ,2023
EXEC AddNeighborhoodCrime 'Punta Gorda','Hurto',null,2023 
EXEC AddNeighborhoodCrime 'Punta Rieles - Bella Italia','Hurto',844,2023
EXEC AddNeighborhoodCrime 'Reducto','Hurto',null,2023 
EXEC AddNeighborhoodCrime 'Sayago','Hurto',623,2023
EXEC AddNeighborhoodCrime 'Tres Cruces','Hurto',1852,2023
EXEC AddNeighborhoodCrime 'Tres Ombúes - Pueblo Victoria','Hurto',null,2023
EXEC AddNeighborhoodCrime 'Unión','Hurto',3524,2023
EXEC AddNeighborhoodCrime 'Villa del Cerro','Hurto',931,2023
EXEC AddNeighborhoodCrime 'Villa Española','Hurto',770,2023
EXEC AddNeighborhoodCrime 'Villa García - Manga Rural','Hurto',641,2023
EXEC AddNeighborhoodCrime 'Villa Muñoz - Retiro','Hurto',null,2023

GO

EXEC AddNeighborhoodCrime 'Aguada','Rapiña',null,2023
EXEC AddNeighborhoodCrime 'Atahualpa','Rapiña',null,2023;
EXEC AddNeighborhoodCrime 'Aires Puros','Rapiña',null,2023
EXEC AddNeighborhoodCrime 'Barrio Sur','Rapiña',null,2023
EXEC AddNeighborhoodCrime 'Bañados de Carrasco','Rapiña',null,2023
EXEC AddNeighborhoodCrime 'Belvedere','Rapiña',397,2023
EXEC AddNeighborhoodCrime 'Buceo','Rapiña',362,2023
EXEC AddNeighborhoodCrime 'Brazo Oriental','Rapiña',null,2023
EXEC AddNeighborhoodCrime 'Casavalle','Rapiña',916,2023
EXEC AddNeighborhoodCrime 'Carrasco','Rapiña',null,2023
EXEC AddNeighborhoodCrime 'Carrasco Norte','Rapiña',null,2023
EXEC AddNeighborhoodCrime 'Casabó - Pajas Blancas','Rapiña',405,2023
EXEC AddNeighborhoodCrime 'Castro - Pérez Castellanos','Rapiña',null,2023
EXEC AddNeighborhoodCrime 'Capurro - Bella Vista','Rapiña',null,2023
EXEC AddNeighborhoodCrime 'Centro','Rapiña',336,2023
EXEC AddNeighborhoodCrime 'Cerrito','Rapiña',249,2023
EXEC AddNeighborhoodCrime 'Ciudad Vieja','Rapiña',null,2023
EXEC AddNeighborhoodCrime 'Colón Centro y Noroeste','Rapiña',650,2023
EXEC AddNeighborhoodCrime 'Colón Sureste - Abayubá','Rapiña',257,2023
EXEC AddNeighborhoodCrime 'Conciliación','Rapiña',366,2023
EXEC AddNeighborhoodCrime 'Cordón','Rapiña',342,2023
EXEC AddNeighborhoodCrime 'Flor de Maroñas','Rapiña',427,2023
EXEC AddNeighborhoodCrime 'Ituzaingó','Rapiña',304,2023
EXEC AddNeighborhoodCrime 'Jacinto Vera','Rapiña',null,2023
EXEC AddNeighborhoodCrime 'Jardines del Hipódromo','Rapiña',472,2023
EXEC AddNeighborhoodCrime 'La Blanqueada','Rapiña',null,2023
EXEC AddNeighborhoodCrime 'La Comercial','Rapiña',null,2023
EXEC AddNeighborhoodCrime 'La Figurita','Rapiña',null,2023
EXEC AddNeighborhoodCrime 'Larrañaga','Rapiña',null,2023
EXEC AddNeighborhoodCrime 'Las Canteras','Rapiña',350,2023
EXEC AddNeighborhoodCrime 'La Paloma - Tomkinson','Rapiña',609,2023
EXEC AddNeighborhoodCrime 'Las Acacias','Rapiña',450,2023
EXEC AddNeighborhoodCrime 'La Teja','Rapiña',257,2023
EXEC AddNeighborhoodCrime 'Lezica - Melilla','Rapiña',431,2023
EXEC AddNeighborhoodCrime 'Malvín','Rapiña',242,2023
EXEC AddNeighborhoodCrime 'Malvín Norte','Rapiña',689,2023
EXEC AddNeighborhoodCrime 'Manga','Rapiña',305,2023
EXEC AddNeighborhoodCrime 'Manga, Toledo Chico','Rapiña',478,2023
EXEC AddNeighborhoodCrime 'Maroñas - Parque Guaraní','Rapiña',439,2023
EXEC AddNeighborhoodCrime 'Mercado Modelo y Bolívar','Rapiña',192,2023
EXEC AddNeighborhoodCrime 'Nuevo París','Rapiña',549,2023
EXEC AddNeighborhoodCrime 'Palermo','Rapiña',null,2023 
EXEC AddNeighborhoodCrime 'Parque Batlle - Villa Dolores','Rapiña',207,2023
EXEC AddNeighborhoodCrime 'Parque Rodó','Rapiña',643,2023
EXEC AddNeighborhoodCrime 'Paso de la Arena','Rapiña',518,2023
EXEC AddNeighborhoodCrime 'Paso de las Duranas','Rapiña',null,2023
EXEC AddNeighborhoodCrime 'Peñarol - Lavalleja','Rapiña',579,2023
EXEC AddNeighborhoodCrime 'Piedras Blancas','Rapiña',400,2023
EXEC AddNeighborhoodCrime 'Pocitos','Rapiña',null,2023
EXEC AddNeighborhoodCrime 'Prado - Nueva Savona','Rapiña',327,2023
EXEC AddNeighborhoodCrime 'Punta Carretas','Rapiña',null,2023 
EXEC AddNeighborhoodCrime 'Punta Gorda','Rapiña',null,2023 
EXEC AddNeighborhoodCrime 'Punta Rieles - Bella Italia','Rapiña',454,2023
EXEC AddNeighborhoodCrime 'Reducto','Rapiña',null,2023 
EXEC AddNeighborhoodCrime 'Sayago','Rapiña',null,2023
EXEC AddNeighborhoodCrime 'Tres Cruces','Rapiña',null,2023
EXEC AddNeighborhoodCrime 'Tres Ombúes - Pueblo Victoria','Rapiña',246,2023
EXEC AddNeighborhoodCrime 'Unión','Rapiña',701,2023
EXEC AddNeighborhoodCrime 'Villa del Cerro','Rapiña',516,2023
EXEC AddNeighborhoodCrime 'Villa Española','Rapiña',null,2023
EXEC AddNeighborhoodCrime 'Villa García - Manga Rural','Rapiña',437,2023
EXEC AddNeighborhoodCrime 'Villa Muñoz - Retiro','Rapiña',null,2023





