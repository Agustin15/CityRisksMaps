CREATE DATABASE CityRisksMap;

USE CityRisksMap;

CREATE TABLE Rols(
idRol INT IDENTITY(1,1) Primary key,
name VARCHAR(10) UNIQUE
);

CREATE TABLE Users(
idUser INT IDENTITY(1,1) Primary key ,
email VARCHAR(50) UNIQUE CHECK(PATINDEX('%@[a-zA-Z]%.com%%',email)>0), 
name VARCHAR(20) NOT NULL,
lastname VARCHAR(20) NOT NULL,
password VARCHAR(60) NOT NULL,
created DATETIME NOT NULL DEFAULT GETDATE(),
lastModified DATETIME NOT NULL DEFAULT GETDATE(),
rol INT NOT NULL FOREIGN KEY REFERENCES Rols(idRol) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE Verifications_Codes(
code VARCHAR(60) PRIMARY KEY,
expiration DATETIME NOT NULL CHECK(expiration>GETDATE()),
idUser INT NOT NULL FOREIGN KEY REFERENCES Users(idUser) ON UPDATE CASCADE ON DELETE CASCADE,
);


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
increase DECIMAL(5,1),
rate DECIMAL(6,1) CHECK(rate>=0),
year INT NOT NULL CHECK(year<=YEAR(GETDATE())),
Primary key(neighborhood,crime,year)
);


CREATE TABLE Zones(
idZone INT Primary key,
description VARCHAR(250) NOT NULL,
coordinates NVARCHAR(MAX) NOT NULL,
created DATETIME NOT NULL DEFAULT GETDATE(),
lastModified DATETIME DEFAULT GETDATE(),
enable bit NOT NULL

);

CREATE TABLE Zones_Neighborhoods(
zone INT FOREIGN KEY REFERENCES Zones(idZone)ON UPDATE CASCADE ON DELETE CASCADE,
neighborhood VARCHAR(30) FOREIGN KEY REFERENCES Neighborhoods(name) ON UPDATE CASCADE ON DELETE CASCADE 
Primary key(zone,neighborhood)
);


GO
--------------------------------------------------------------------------------------------------------------

--Rols PROCEDURES

CREATE OR ALTER PROCEDURE AddRol @name VARCHAR(10)  AS
BEGIN

IF (LEN(@name)>10)
RETURN -1

IF EXISTS (select * from Rols where name=@name)
RETURN -2

INSERT INTO Rols VALUES(@name);

IF(@@ERROR<>0)
RETURN -3

RETURN 1

END
GO

CREATE OR ALTER PROCEDURE UpdateRol @idRol INT,@name VARCHAR(10) AS
BEGIN

IF (LEN(@name)>10)
RETURN -1

IF NOT EXISTS (select * from Rols where idRol=@idRol)
RETURN -2

IF EXISTS (select * from Rols where idRol!=@idRol and name=@name)
RETURN -3

UPDATE Rols set name=@name where idRol=@idRol;

IF(@@ERROR<>0)
RETURN -4

RETURN 1

END
GO


CREATE OR ALTER PROCEDURE DeleteRol @idRol INT AS
BEGIN

IF NOT EXISTS (select * from Rols where idRol=@idRol)
RETURN -1

DELETE FROM Rols where idRol=@idRol

IF(@@ERROR<>0)
RETURN -2

RETURN 1

END
GO

CREATE OR ALTER PROCEDURE AllRols AS
BEGIN

SELECT * FROM Rols;

END
GO

--------------------------------------------------------------------------------------------------------------
--Users PROCEDURES

CREATE OR ALTER PROCEDURE AddUser @email VARCHAR(50),@name VARCHAR(20),@lastname VARCHAR(20),@password VARCHAR(60),
@rol INT AS

BEGIN

IF (LEN(@name)>20)
RETURN -1

IF (LEN(@lastname)>20)
RETURN -2

IF (LEN(@email)>50)
RETURN -3

IF (PATINDEX('%@[a-zA-Z]%.com%%',@email)=0)
RETURN -4

IF NOT EXISTS (select * from Rols where idRol=@rol)
RETURN -5

IF EXISTS (select * from Users where email=@email)
RETURN -6

INSERT INTO Users(email,name,lastname,password,rol) VALUES(@email,@name,@lastname,@password,@rol);

IF(@@ERROR<>0)
RETURN -7

RETURN 1

END
GO


CREATE OR ALTER PROCEDURE UpdateUser @idUser INT,@email VARCHAR(20),@name VARCHAR(20),@lastname VARCHAR(30),@password VARCHAR(60),
@rol INT AS

BEGIN

IF (LEN(@name)>20)
RETURN -1

IF (LEN(@lastname)>20)
RETURN -2

IF (LEN(@email)>50)
RETURN -3

IF (PATINDEX('%@[a-zA-Z]%.com%%',@email)=0)
RETURN -4

IF NOT EXISTS (select * from Users where idUser=@idUser)
RETURN -5

IF NOT EXISTS (select * from Rols where idRol=@rol)
RETURN -6

IF EXISTS (select * from Users where idUser!=@idUser and email=@email)
RETURN -7

UPDATE Users set email=@email,name=@name,password=@password,lastname=@lastname,@rol=rol where idUser=@idUser;

IF(@@ERROR<>0)
RETURN -8

RETURN 1

END
GO

CREATE OR ALTER PROCEDURE DeleteUser @idUser INT AS

BEGIN

IF NOT EXISTS (select * from Users where idUser=@idUser)
RETURN -1

DELETE FROM Users where idUser=@idUser;

IF(@@ERROR<>0)
RETURN -2

RETURN 1

END
GO

CREATE OR ALTER PROCEDURE AllUsers AS
BEGIN
SELECT * FROM Users;
END
GO

CREATE OR ALTER PROCEDURE UsersOffset @offset INT AS
BEGIN
SELECT * FROM Users ORDER BY created OFFSET @offset ROWS FETCH NEXT 10 ROWS ONLY;
END
GO

CREATE OR ALTER PROCEDURE UserById @idUser INT AS

BEGIN
SELECT * FROM Users where idUser=@idUser;
END

GO

CREATE OR ALTER PROCEDURE UserById @idUser INT AS

BEGIN
SELECT * FROM Users where idUser=@idUser;
END



GO

--------------------------------------------------------------------------------------------------------------
--Department PROCEDURES

CREATE OR ALTER PROCEDURE AddDepartment @name VARCHAR(30) AS
BEGIN

IF (LEN(@name)>30)
RETURN -1

IF EXISTS (select * from Departments where name=@name)
RETURN -2

INSERT INTO Departments VALUES(@name);

IF(@@ERROR<>0)
RETURN -3

RETURN 1

END
GO

CREATE OR ALTER PROCEDURE UpdateDepartment @idDepartment INT ,@name VARCHAR(30) AS
BEGIN

IF (LEN(@name)>30)
RETURN -1

IF NOT EXISTS (select * from Departments where idDepartment=@idDepartment)
RETURN -2

IF EXISTS (select * from Departments where name=@name and idDepartment!=@idDepartment)
RETURN -3

UPDATE Departments set name=@name where idDepartment=@idDepartment;

IF(@@ERROR<>0)
RETURN -4

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
--Crimes PROCEDURES

CREATE OR ALTER PROCEDURE AddCrime @category VARCHAR(20),@description VARCHAR(700) AS

BEGIN

IF (LEN(@category)>20)
RETURN -1

IF (LEN(@description)>700)
RETURN -2

IF EXISTS (select * from Crimes where category=@category)
RETURN -3

INSERT INTO Crimes VALUES(@category,@description);

IF(@@ERROR<>0)
RETURN -4

RETURN 1

END

GO

CREATE OR ALTER PROCEDURE UpdateCrime @category VARCHAR(20),@description VARCHAR(700) AS

BEGIN


IF (LEN(@category)>20)
RETURN -1

IF (LEN(@description)>700)
RETURN -2

IF NOT EXISTS (select * from Crimes where category=@category)
RETURN -3

UPDATE Crimes set description=@description where category=@category;

IF(@@ERROR<>0)
RETURN -4

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

select * from Crimes where category ='Homicidio' or category ='Hurto' or category ='Rapiña';
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

IF (LEN(@name)>30)
RETURN -1

IF EXISTS (select * from Neighborhoods where name=@name)
RETURN -2

IF NOT EXISTS (select * from Departments where idDepartment=@idDepartment)
RETURN -3

INSERT INTO Neighborhoods VALUES(@name,@idDepartment);

IF(@@ERROR<>0)
RETURN -4

RETURN 1

END

GO

CREATE OR ALTER PROCEDURE UpdateNeighborhood @name VARCHAR(30),@idDepartment INT AS
BEGIN


IF (LEN(@name)>30)
RETURN -1

IF NOT EXISTS (select * from Departments where idDepartment=@idDepartment)
RETURN -2

UPDATE Neighborhoods set department=@idDepartment where name=@name;

IF(@@ERROR<>0)
RETURN -3

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

CREATE OR ALTER PROCEDURE NeighborhoodsOffset @offset INT AS
BEGIN
select * from Neighborhoods ORDER BY name OFFSET @offset ROWS FETCH NEXT 10 ROWS ONLY;
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

DELETE from Population where idPopulation=@idPopulation;

IF(@@ERROR<>0)
RETURN -2

RETURN 1

END
GO

CREATE OR ALTER PROCEDURE PopulationById @idPopulation INT AS
BEGIN

select * from Population where @idPopulation=idPopulation;
END
GO

CREATE OR ALTER PROCEDURE AllPopulations AS
BEGIN

select * from Population;
END
GO

CREATE OR ALTER PROCEDURE PopulationsOffset @offset INT AS
BEGIN

select * from Population ORDER BY neighborhood OFFSET @offset ROWS FETCH NEXT 10 ROWS ONLY;
END
GO

CREATE OR ALTER PROCEDURE PopulationsByNeighborhood @neighborhood VARCHAR(30) AS
BEGIN
select * from population where neighborhood=@neighborhood;
END
GO

CREATE OR ALTER PROCEDURE PopulationByNeighborhoodAndYear @neighborhood VARCHAR(30),@year INT AS
BEGIN
select * from population where neighborhood=@neighborhood and year=@year;
END
GO


------------------------------------------------------------------------------------------------------------------
--NeighborhoodCrimes PROCEDURES

CREATE OR ALTER PROCEDURE AddNeighborhoodCrime @neighborhood VARCHAR(30),@crime VARCHAR(20),@quantity INT,@year INT AS

BEGIN

DECLARE @population INT;
DECLARE @increase DECIMAL(5,1);
DECLARE @rate DECIMAL(6,1);
DECLARE @quantityCrimesPrevYear INT

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

select @population=P.quantity from Population P INNER JOIN Neighborhoods N ON P.neighborhood=N.name where N.name=@neighborhood and
(CASE when @year>=year THEN (@year-year)WHEN year>=@year THEN(year-@year)END)=
(select TOP 1 (CASE when @year>=year THEN (@year-year)WHEN year>=@year THEN(year-@year)END) as 'diferencia' from Population) 

IF(@population IS NULL) 
RETURN -6

select @quantityCrimesPrevYear=quantity from Neighborhoods_Crimes where neighborhood=@neighborhood and crime=@crime and year=@year-1;

IF(@quantity IS NOT NULL) SET @rate=(CAST(@quantity as decimal)/@population)*100000

IF(@quantity IS NOT NULL AND @quantityCrimesPrevYear IS NOT NULL)
BEGIN
SET @increase=(
CASE 
WHEN (@quantity-@quantityCrimesPrevYear)=0 THEN 0
WHEN @quantityCrimesPrevYear=0 and @quantity>@quantityCrimesPrevYear THEN 100
WHEN @quantity=0 and @quantityCrimesPrevYear>@quantity THEN -100
ELSE 
((@quantity-@quantityCrimesPrevYear)/CAST(@quantityCrimesPrevYear as decimal))*100

END
)
END


INSERT INTO Neighborhoods_Crimes VALUES(@neighborhood,@crime,@quantity,@increase,@rate,@year)

IF(@@ERROR<>0)
RETURN -7

RETURN 1
END
GO

CREATE OR ALTER PROCEDURE UpdateNeighborhoodCrime @neighborhood VARCHAR(30),@crime VARCHAR(20),@quantity INT,@year INT AS

BEGIN

DECLARE @population INT;
DECLARE @increase DECIMAL(5,1);
DECLARE @rate DECIMAL(6,1);
DECLARE @quantityCrimesPrevYear INT

IF @quantity<0
RETURN -1

IF @year>YEAR(GETDATE())
RETURN -2

IF NOT EXISTS (select * from Neighborhoods_Crimes  where neighborhood=@neighborhood and crime=@crime and year=@year)
RETURN -3

select @population=P.quantity from Population P INNER JOIN Neighborhoods N ON P.neighborhood=N.name where N.name=@neighborhood and 
(CASE when @year>=year THEN (@year-year)WHEN year>=@year THEN(year-@year)END)=
(select TOP 1 (CASE when @year>=year THEN (@year-year)WHEN year>=@year THEN(year-@year)END) as 'diferencia' from Population)

IF(@population IS NULL) 
RETURN -4

select @quantityCrimesPrevYear=quantity from Neighborhoods_Crimes where neighborhood=@neighborhood and crime=@crime and year=@year-1;

IF(@quantity IS NOT NULL) SET @rate=(CAST(@quantity as decimal)/@population)*100000

IF(@quantity IS NOT NULL AND @quantityCrimesPrevYear IS NOT NULL)
BEGIN
SET @increase=(
CASE 
WHEN @quantity-@quantityCrimesPrevYear=0 THEN 0
WHEN @quantityCrimesPrevYear=0 and @quantity>@quantityCrimesPrevYear THEN 100
WHEN @quantity=0 and @quantityCrimesPrevYear>@quantity THEN -100
ELSE 
((@quantity-@quantityCrimesPrevYear)/CAST(@quantityCrimesPrevYear as decimal))*100
END
)
END

UPDATE Neighborhoods_Crimes set quantity=@quantity,increase=@increase,rate=@rate where neighborhood=@neighborhood and crime=@crime and year=@year

IF(@@ERROR<>0)
RETURN -5

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

CREATE OR ALTER  PROCEDURE YearsNeighborhoodsCrime @crime VARCHAR(20) AS 

BEGIN 
select DISTINCT year from Neighborhoods_Crimes where crime=@crime ORDER BY year desc
END

GO

CREATE OR ALTER PROCEDURE NeighborhoodsCrimeByYear @crime VARCHAR(20),@year INT AS
BEGIN

DECLARE @populationYear INT

select @populationYear=P.year from Population P INNER JOIN Neighborhoods N ON P.neighborhood=N.name where(CASE when @year>=year THEN (@year-year)WHEN year>=@year 
THEN(year-@year)END)=(select TOP 1 (CASE when @year>=year THEN (@year-year)WHEN year>=@year THEN(year-@year)END) as 'diferencia' from Population)

select name,P.quantity as 'quantityPopulation',P.year as 'yearPopulation',NC.quantity as 'quantityCrime',NC.year as 'yearCrime',
increase,rate from  Neighborhoods_Crimes NC INNER JOIN  Neighborhoods N on N.name=NC.neighborhood INNER JOIN
Population P ON P.neighborhood=N.name where crime=@crime and NC.year=@year and P.year=@populationYear ORDER BY rate desc;

END

GO

CREATE OR ALTER PROCEDURE QuantityCategoryCrimeInNeighborhood @neighborhood VARCHAR(30),@crime VARCHAR(20) AS
BEGIN 

select * from Neighborhoods_Crimes where neighborhood=@neighborhood and crime=@crime ORDER BY YEAR;
END

GO

CREATE OR ALTER  PROCEDURE NeighborhoodsCrimeByYearSecondVersion @crime VARCHAR(20), @year INT AS 

BEGIN 
select * from Neighborhoods_Crimes where crime=@crime and year=@year;
END

GO


CREATE OR ALTER  PROCEDURE NeighborhoodsCrimeByYearOffset @crime VARCHAR(20), @year INT,@offset INT AS 

BEGIN 
select * from Neighborhoods_Crimes where crime=@crime and year=@year ORDER BY rate desc OFFSET @offset ROWS FETCH NEXT 10 ROWS ONLY;
END

GO

------------------------------------------------------------------------------------------------------------------
--Zones PROCEDURES

CREATE OR ALTER PROCEDURE AddZone @description VARCHAR(250),@coordinates NVARCHAR(MAX),@enable bit,
@neighborhood VARCHAR(30) AS
BEGIN 

IF(LEN(@description)>250)
RETURN -1


IF(@enable!=0 or @enable!=1)
RETURN -2

BEGIN TRANSACTION

INSERT INTO Zones(description,coordinates,enable) VALUES(@description,@coordinates,@enable);
IF(@@ERROR<>0)
RETURN -3

INSERT INTO Zones_Neighborhoods VALUES(IDENT_CURRENT('zones'),@neighborhood);
IF(@@ERROR<>0)
BEGIN
ROLLBACK TRANSACTION
RETURN -4
END

COMMIT TRANSACTION

END

GO

CREATE OR ALTER PROCEDURE DeleteZone @idZone INT AS
BEGIN 

IF NOT EXISTS(select * from Zones where idZone=@idZone)
RETURN -1

DELETE FROM Zones where idZone=@idZone
IF(@@ERROR<>0)
RETURN -2

END

GO

CREATE OR ALTER PROCEDURE UpdateZone @idZone INT,@description VARCHAR(250),@coordinates NVARCHAR(MAX),@enable bit AS
BEGIN 

IF(LEN(@description)>250)
RETURN -1

IF(@enable!=0 or @enable!=1)
RETURN -2

IF NOT EXISTS(select * from Zones where idZone=@idZone)
RETURN -3

Update Zones set description=@description,coordinates=@coordinates,enable=@enable where idZone=@idZone

IF(@@ERROR<>0)
RETURN -4

END

GO

CREATE OR ALTER PROCEDURE AllZones AS
BEGIN 

select * from Zones ORDER BY created;
END
GO

CREATE OR ALTER PROCEDURE ZonesOffset @offset INT AS
BEGIN 

select * from Zones ORDER BY created OFFSET @offset ROWS FETCH NEXT 10 ROWS ONLY;
END
GO

CREATE OR ALTER PROCEDURE ZoneById @idZone INT AS
BEGIN 

select * from Zones where idZone=@idZone;
END

GO

------------------------------------------------------------------------------------------------------------------
--Zones_Neighborhoods PROCEDURES



CREATE OR ALTER PROCEDURE DeleteZoneNeighborhood @idZone INT,@neighborhood VARCHAR(30) AS
BEGIN 

IF NOT EXISTS(select * from Zones_Neighborhoods where zone=@idZone and neighborhood=@neighborhood)
RETURN -1

DELETE FROM Zones_Neighborhoods where zone=@idZone and neighborhood=@neighborhood;

IF(@@ERROR<>0)
RETURN -2

END

GO

CREATE OR ALTER PROCEDURE ZoneNeighborhoodByNeighborhood @neighborhood VARCHAR(30) AS
BEGIN 

select * from Zones_Neighborhoods where neighborhood=@neighborhood;
END

GO

CREATE OR ALTER PROCEDURE ZoneNeighborhoodByZone @idZone INT AS
BEGIN 

select * from Zones_Neighborhoods where zone=@idZone;
END

GO

------------------------------------------------------------------------------------------------------------------
--VerificationsCodes PROCEDURES


CREATE OR ALTER PROCEDURE AddVerificationCode @code VARCHAR(60),@idUser INT,@expiration DATETIME AS

BEGIN

IF @expiration<GETDATE()
RETURN -1

IF NOT EXISTS (select * from Users where idUser=@idUser)
RETURN -2

IF EXISTS (select * from Verifications_Codes where code=@code)
RETURN -3

INSERT INTO Verifications_Codes VALUES(@code,@expiration,@idUser)

IF(@@ERROR<>0)
RETURN -4

RETURN 1
END
GO


CREATE OR ALTER PROCEDURE UpdateVerificationCode @code VARCHAR(60),@idUser INT,@expiration DATETIME AS

BEGIN

IF @expiration<GETDATE()
RETURN -1

IF NOT EXISTS (select * from Verifications_Codes where code=@code)
RETURN -2

IF NOT EXISTS (select * from Users where idUser=@idUser)
RETURN -3

Update Verifications_Codes set idUser=@idUser,expiration=@expiration where code=@code

IF(@@ERROR<>0)
RETURN -4

RETURN 1
END
GO


CREATE OR ALTER PROCEDURE DeleteVerificationCode @code VARCHAR(60) AS

BEGIN

IF NOT EXISTS (select * from Verifications_Codes where code=@code)
RETURN -1

delete from Verifications_Codes where code=@code

IF(@@ERROR<>0)
RETURN -2

RETURN 1
END
GO

CREATE OR ALTER PROCEDURE AllVerificationCodes  AS
BEGIN 
select * from Verifications_Codes;
END
GO

CREATE OR ALTER PROCEDURE VerificationCodesOffset @offset INT AS
BEGIN 
select * from Verifications_Codes ORDER BY expiration OFFSET @offset rows FETCH NEXT 10 ROWS ONLY;
END

GO

CREATE OR ALTER PROCEDURE VerificationCodeMostRecentlyByIdUser @idUser INT AS
BEGIN 

select TOP 1 *  from Verifications_Codes where idUser=@idUser;
END

GO


CREATE OR ALTER PROCEDURE VerificationCodesByUser @idUser INT AS
BEGIN 
select * from Verifications_Codes where idUser=@idUser;
END
GO

CREATE OR ALTER PROCEDURE VerificationCodesByUserOffset @idUser INT,@offset INT AS
BEGIN 

select * from Verifications_Codes where idUser=@idUser ORDER BY expiration OFFSET @offset ROWS FETCH NEXT 10 ROWS ONLY;
END

GO

------------------------------------------------------------------------------------------------------------------
EXEC AddRol 'Admin';
EXEC AddRol 'User';

EXEC AddDepartment 'Montevideo';

EXEC AddNeighborhood 'Aguada',1;
EXEC AddNeighborhood 'Aires Puros',1;
EXEC AddNeighborhood 'Atahualpa',1;
EXEC AddNeighborhood 'Bañados de Carrasco',1;
EXEC AddNeighborhood 'Barrio Sur',1;
EXEC AddNeighborhood 'Belvedere',1;
EXEC AddNeighborhood 'Brazo Oriental',1;
EXEC AddNeighborhood 'Buceo',1;
EXEC AddNeighborhood 'Capurro, Bella Vista',1;
EXEC AddNeighborhood 'Carrasco',1;
EXEC AddNeighborhood 'Carrasco Norte',1;
EXEC AddNeighborhood 'Casabó, Pajas Blancas',1;
EXEC AddNeighborhood 'Casavalle',1;
EXEC AddNeighborhood 'Castro, P. Castellanos',1;
EXEC AddNeighborhood 'Centro',1;
EXEC AddNeighborhood 'Cerro',1;
EXEC AddNeighborhood 'Cerrito',1;
EXEC AddNeighborhood 'Ciudad Vieja',1;
EXEC AddNeighborhood 'Colón Centro y Noroeste',1;
EXEC AddNeighborhood 'Colón Sureste, Abayubá',1;
EXEC AddNeighborhood 'Conciliación',1;
EXEC AddNeighborhood 'Cordón',1;
EXEC AddNeighborhood 'Flor de Maroñas',1;
EXEC AddNeighborhood 'Ituzaingó',1;
EXEC AddNeighborhood 'Jacinto Vera',1;
EXEC AddNeighborhood 'Jardines del Hipódromo',1;
EXEC AddNeighborhood 'La Blanqueada',1;
EXEC AddNeighborhood 'La Comercial',1;
EXEC AddNeighborhood 'Las Canteras',1;
EXEC AddNeighborhood 'La Figurita',1;
EXEC AddNeighborhood 'Larrañaga',1;
EXEC AddNeighborhood 'La Paloma, Tomkinson',1;
EXEC AddNeighborhood 'Las Acacias',1;
EXEC AddNeighborhood 'La Teja',1;
EXEC AddNeighborhood 'Lezica, Melilla',1;
EXEC AddNeighborhood 'Malvín',1;
EXEC AddNeighborhood 'Malvín Norte',1;
EXEC AddNeighborhood 'Manga',1;
EXEC AddNeighborhood 'Manga, Toledo Chico',1;
EXEC AddNeighborhood 'Maroñas, Parque Guaraní',1;
EXEC AddNeighborhood 'Mercado Modelo, Bolívar',1;
EXEC AddNeighborhood 'Nuevo París',1;
EXEC AddNeighborhood 'Palermo',1;
EXEC AddNeighborhood 'Pque. Batlle, V. Dolores',1;
EXEC AddNeighborhood 'Parque Rodó',1;
EXEC AddNeighborhood 'Paso de la Arena',1;
EXEC AddNeighborhood 'Paso de las Duranas',1;
EXEC AddNeighborhood 'Peñarol, Lavalleja',1;
EXEC AddNeighborhood 'Piedras Blancas',1;
EXEC AddNeighborhood 'Pocitos',1;
EXEC AddNeighborhood 'Prado, Nueva Savona',1;
EXEC AddNeighborhood 'Punta Carretas',1;
EXEC AddNeighborhood 'Punta Gorda',1;
EXEC AddNeighborhood 'Pta. Rieles, Bella Italia',1;
EXEC AddNeighborhood 'Reducto',1;
EXEC AddNeighborhood 'Sayago',1;
EXEC AddNeighborhood 'Tres Cruces',1;
EXEC AddNeighborhood 'Tres Ombúes, Victoria',1;
EXEC AddNeighborhood 'Unión',1;
EXEC AddNeighborhood 'Villa Española',1;
EXEC AddNeighborhood 'Villa García, Manga Rural',1;
EXEC AddNeighborhood 'Villa Muñoz, Retiro',1;
GO

EXEC AddPopulation 'Aguada',19038,2023;
EXEC AddPopulation 'Aires Puros',14657,2023;
EXEC AddPopulation 'Atahualpa',7864,2023;
EXEC AddPopulation 'Bañados de Carrasco',13924,2023;
EXEC AddPopulation 'Barrio Sur',13953,2023;
EXEC AddPopulation 'Belvedere',20120,2023;
EXEC AddPopulation 'Brazo Oriental',16096,2023;
EXEC AddPopulation 'Buceo',36320,2023;
EXEC AddPopulation 'Capurro, Bella Vista',16336,2023;
EXEC AddPopulation 'Carrasco',14792,2023;
EXEC AddPopulation 'Carrasco Norte',13020,2023;
EXEC AddPopulation 'Casabó, Pajas Blancas',29314,2023;
EXEC AddPopulation 'Casavalle',29851,2023;
EXEC AddPopulation 'Castro, P. Castellanos',13245,2023;
EXEC AddPopulation 'Centro',23335,2023;
EXEC AddPopulation 'Cerro',26730,2023;
EXEC AddPopulation 'Cerrito',15718,2023;
EXEC AddPopulation 'Ciudad Vieja',13598,2023;
EXEC AddPopulation 'Colón Centro y Noroeste',26855,2023;
EXEC AddPopulation 'Colón Sureste, Abayubá',14354,2023;
EXEC AddPopulation 'Conciliación',19510,2023;
EXEC AddPopulation 'Cordón',44172,2023;
EXEC AddPopulation 'Flor de Maroñas',16873,2023;
EXEC AddPopulation 'Ituzaingó',12525,2023;
EXEC AddPopulation 'Jacinto Vera',8204,2023;
EXEC AddPopulation 'Jardines del Hipódromo',19098,2023;
EXEC AddPopulation 'La Blanqueada',9585,2023;
EXEC AddPopulation 'La Comercial',11110,2023;
EXEC AddPopulation 'La Figurita',9990,2023;
EXEC AddPopulation 'Larrañaga',18509,2023;
EXEC AddPopulation 'Las Canteras',21448,2023;
EXEC AddPopulation 'La Paloma, Tomkinson',38189,2023;
EXEC AddPopulation 'Las Acacias',19339,2023;
EXEC AddPopulation 'La Teja',18308,2023;
EXEC AddPopulation 'Lezica, Melilla',16929,2023;
EXEC AddPopulation 'Malvín',29085,2023;
EXEC AddPopulation 'Malvín Norte',17045,2023;
EXEC AddPopulation 'Manga',19124,2023;
EXEC AddPopulation 'Manga, Toledo Chico',26746,2023;
EXEC AddPopulation 'Maroñas, Parque Guaraní',20401,2023;
EXEC AddPopulation 'Mercado Modelo, Bolívar',15374,2023;
EXEC AddPopulation 'Nuevo París',29405,2023;
EXEC AddPopulation 'Palermo',12611,2023;
EXEC AddPopulation 'Pque. Batlle, V. Dolores',29474,2023;
EXEC AddPopulation 'Parque Rodó',12809,2023;
EXEC AddPopulation 'Paso de la Arena',26081,2023;
EXEC AddPopulation 'Paso de las Duranas',11972,2023;
EXEC AddPopulation 'Peñarol, Lavalleja',31748,2023;
EXEC AddPopulation 'Piedras Blancas',20668,2023;
EXEC AddPopulation 'Pocitos',69107,2023;
EXEC AddPopulation 'Prado, Nueva Savona',19125,2023;
EXEC AddPopulation 'Punta Carretas',24654,2023;
EXEC AddPopulation 'Punta Gorda',13596,2023;
EXEC AddPopulation 'Pta. Rieles, Bella Italia',23596,2023;
EXEC AddPopulation 'Reducto',13214,2023;
EXEC AddPopulation 'Sayago',13756,2023;
EXEC AddPopulation 'Tres Cruces',16668,2023;
EXEC AddPopulation 'Tres Ombúes, Victoria',17700,2023;
EXEC AddPopulation 'Unión',37488,2023;
EXEC AddPopulation 'Villa Española',20792,2023;
EXEC AddPopulation 'Villa García, Manga Rural',31166,2023;
EXEC AddPopulation 'Villa Muñoz, Retiro',13095,2023;

EXEC AddCrime 'Homicidio','Por homicidio se entiende la muerte infligida a una persona en forma intencional e ilegal por otra u otras. Se excluyen las muertes causadas por negligencia, suicidio o accidente, así como los decesos que son fruto de actos de funcionarios policiales en cumplimiento de la ley o de acciones realizadas por civiles en legítima defensa.';

EXEC AddCrime 'Hurto','Se entiende por hurto cualquier acto que implique sustraer, tomar o apartar ilegalmente cualquier propiedad o bien mueble de la posesión, control o custodia legítimos de cualquier persona. Incluye delitos como el hurto de vehículos de motor, hurto de piezas de vehículos, hurto de efectos depositados en el interior de viviendas y vehículos, hurto de artículos comerciales del interior de tiendas, el arrebato de carteras o teléfonos celulares, hurto de bicicletas, siempre que no impliquen violencia, amenaza de violencia o fraude.';

EXEC AddCrime 'Rapiña','Se clasifican como rapiñas todos los incidentes en que se sustrajo o intentó sustraer, por medio de la fuerza o amenaza de uso de la fuerza, cualquier objeto o propiedad al cuidado o bajo la custodia de otra u otras personas.';

EXEC AddCrime 'Tráfico de drogas','El delito de tráfico de drogas se define como un delito contra la salud pública que se comete al ejecutar actos de cultivo, elaboración o tráfico, o al promover, favorecer o facilitar el consumo ilegal de drogas tóxicas, estupefacientes o sustancias psicotrópicas, o cuando se poseen con dichos fines.';

-- Homicidios 2022

EXEC AddNeighborhoodCrime 'Aguada','Homicidio',1,2022;
EXEC AddNeighborhoodCrime 'Atahualpa','Homicidio',0,2022;
EXEC AddNeighborhoodCrime 'Aires Puros','Homicidio',3,2022;
EXEC AddNeighborhoodCrime 'Barrio Sur','Homicidio',1,2022;
EXEC AddNeighborhoodCrime 'Bañados de Carrasco','Homicidio',3,2022;
EXEC AddNeighborhoodCrime 'Belvedere','Homicidio',6,2022;
EXEC AddNeighborhoodCrime 'Buceo','Homicidio',2,2022;
EXEC AddNeighborhoodCrime 'Brazo Oriental','Homicidio',0,2022;
EXEC AddNeighborhoodCrime 'Casavalle','Homicidio',13,2022;
EXEC AddNeighborhoodCrime 'Carrasco','Homicidio',0,2022;
EXEC AddNeighborhoodCrime 'Carrasco Norte','Homicidio',2,2022;
EXEC AddNeighborhoodCrime 'Casabó, Pajas Blancas','Homicidio',11,2022;
EXEC AddNeighborhoodCrime 'Castro, P. Castellanos','Homicidio',1,2022;
EXEC AddNeighborhoodCrime 'Capurro, Bella Vista','Homicidio',0,2022;
EXEC AddNeighborhoodCrime 'Centro','Homicidio',2,2022;
EXEC AddNeighborhoodCrime 'Cerro','Homicidio',2,2022;
EXEC AddNeighborhoodCrime 'Cerrito','Homicidio',2,2022;
EXEC AddNeighborhoodCrime 'Ciudad Vieja','Homicidio',1,2022;
EXEC AddNeighborhoodCrime 'Colón Centro y Noroeste','Homicidio',3,2022;
EXEC AddNeighborhoodCrime 'Colón Sureste, Abayubá','Homicidio',3,2022;
EXEC AddNeighborhoodCrime 'Conciliación','Homicidio',5,2022;
EXEC AddNeighborhoodCrime 'Cordón','Homicidio',2,2022;
EXEC AddNeighborhoodCrime 'Flor de Maroñas','Homicidio',6,2022;
EXEC AddNeighborhoodCrime 'Ituzaingó','Homicidio',2,2022;
EXEC AddNeighborhoodCrime 'Jacinto Vera','Homicidio',0,2022;
EXEC AddNeighborhoodCrime 'Jardines del Hipódromo','Homicidio',5,2022;
EXEC AddNeighborhoodCrime 'La Blanqueada','Homicidio',0,2022;
EXEC AddNeighborhoodCrime 'La Comercial','Homicidio',0,2022;
EXEC AddNeighborhoodCrime 'La Figurita','Homicidio',0,2022;
EXEC AddNeighborhoodCrime 'Larrañaga','Homicidio',0,2022;
EXEC AddNeighborhoodCrime 'Las Canteras','Homicidio',4,2022;
EXEC AddNeighborhoodCrime 'La Paloma, Tomkinson','Homicidio',12,2022;
EXEC AddNeighborhoodCrime 'Las Acacias','Homicidio',10,2022;
EXEC AddNeighborhoodCrime 'La Teja','Homicidio',1,2022;
EXEC AddNeighborhoodCrime 'Lezica, Melilla','Homicidio',3,2022;
EXEC AddNeighborhoodCrime 'Malvín','Homicidio',2,2022;
EXEC AddNeighborhoodCrime 'Malvín Norte','Homicidio',4,2022;
EXEC AddNeighborhoodCrime 'Manga','Homicidio',5,2022;
EXEC AddNeighborhoodCrime 'Manga, Toledo Chico','Homicidio',7,2022;
EXEC AddNeighborhoodCrime 'Maroñas, Parque Guaraní','Homicidio',4,2022;
EXEC AddNeighborhoodCrime 'Mercado Modelo, Bolívar','Homicidio',2,2022;
EXEC AddNeighborhoodCrime 'Nuevo París','Homicidio',5,2022;
EXEC AddNeighborhoodCrime 'Palermo','Homicidio',0,2022;
EXEC AddNeighborhoodCrime 'Pque. Batlle, V. Dolores','Homicidio',0,2022;
EXEC AddNeighborhoodCrime 'Parque Rodó','Homicidio',2,2022;
EXEC AddNeighborhoodCrime 'Paso de la Arena','Homicidio',2,2022;
EXEC AddNeighborhoodCrime 'Paso de las Duranas','Homicidio',1,2022;
EXEC AddNeighborhoodCrime 'Peñarol, Lavalleja','Homicidio',21,2022;
EXEC AddNeighborhoodCrime 'Piedras Blancas','Homicidio',7,2022;
EXEC AddNeighborhoodCrime 'Pocitos','Homicidio',0,2022;
EXEC AddNeighborhoodCrime 'Prado, Nueva Savona','Homicidio',0,2022;
EXEC AddNeighborhoodCrime 'Punta Carretas','Homicidio',0,2022;
EXEC AddNeighborhoodCrime 'Punta Gorda','Homicidio',0,2022;
EXEC AddNeighborhoodCrime 'Pta. Rieles, Bella Italia','Homicidio',4,2022;
EXEC AddNeighborhoodCrime 'Reducto','Homicidio',0,2022;
EXEC AddNeighborhoodCrime 'Sayago','Homicidio',3,2022;
EXEC AddNeighborhoodCrime 'Tres Cruces','Homicidio',1,2022;
EXEC AddNeighborhoodCrime 'Tres Ombúes, Victoria','Homicidio',11,2022;
EXEC AddNeighborhoodCrime 'Unión','Homicidio',4,2022;
EXEC AddNeighborhoodCrime 'Villa Española','Homicidio',8,2022;
EXEC AddNeighborhoodCrime 'Villa García, Manga Rural','Homicidio',15,2022;
EXEC AddNeighborhoodCrime 'Villa Muñoz, Retiro','Homicidio',2,2022;
GO

-- Hurtos 2022
EXEC AddNeighborhoodCrime 'Aguada','Hurto',1209,2022
EXEC AddNeighborhoodCrime 'Aires Puros','Hurto',420,2022
EXEC AddNeighborhoodCrime 'Atahualpa','Hurto',392,2022
EXEC AddNeighborhoodCrime 'Barrio Sur','Hurto',593,2022
EXEC AddNeighborhoodCrime 'Bañados de Carrasco','Hurto',410,2022
EXEC AddNeighborhoodCrime 'Belvedere','Hurto',1211,2022
EXEC AddNeighborhoodCrime 'Brazo Oriental','Hurto',777,2022
EXEC AddNeighborhoodCrime 'Buceo','Hurto',1761,2022
EXEC AddNeighborhoodCrime 'Capurro, Bella Vista','Hurto',701,2022
EXEC AddNeighborhoodCrime 'Carrasco Norte','Hurto',517,2022
EXEC AddNeighborhoodCrime 'Carrasco','Hurto',440,2022
EXEC AddNeighborhoodCrime 'Casabó, Pajas Blancas','Hurto',599,2022
EXEC AddNeighborhoodCrime 'Casavalle','Hurto',1112,2022
EXEC AddNeighborhoodCrime 'Castro, P. Castellanos','Hurto',481,2022
EXEC AddNeighborhoodCrime 'Centro','Hurto',2580,2022
EXEC AddNeighborhoodCrime 'Cerrito','Hurto',709,2022
EXEC AddNeighborhoodCrime 'Cerro','Hurto',1100,2022
EXEC AddNeighborhoodCrime 'Ciudad Vieja','Hurto',1247,2022
EXEC AddNeighborhoodCrime 'Colón Centro y Noroeste','Hurto',1254,2022
EXEC AddNeighborhoodCrime 'Colón Sureste, Abayubá','Hurto',360,2022
EXEC AddNeighborhoodCrime 'Conciliación','Hurto',626,2022
EXEC AddNeighborhoodCrime 'Cordón','Hurto',2863,2022
EXEC AddNeighborhoodCrime 'Flor de Maroñas','Hurto',1342,2022
EXEC AddNeighborhoodCrime 'Ituzaingó','Hurto',851,2022
EXEC AddNeighborhoodCrime 'Jacinto Vera','Hurto',408,2022
EXEC AddNeighborhoodCrime 'Jardines del Hipódromo','Hurto',722,2022
EXEC AddNeighborhoodCrime 'La Blanqueada','Hurto',687,2022
EXEC AddNeighborhoodCrime 'La Comercial','Hurto',487,2022
EXEC AddNeighborhoodCrime 'La Figurita','Hurto',454,2022
EXEC AddNeighborhoodCrime 'La Paloma, Tomkinson','Hurto',873,2022
EXEC AddNeighborhoodCrime 'La Teja','Hurto',1015,2022
EXEC AddNeighborhoodCrime 'Larrañaga','Hurto',1040,2022
EXEC AddNeighborhoodCrime 'Las Acacias','Hurto',775,2022
EXEC AddNeighborhoodCrime 'Las Canteras','Hurto',1121,2022
EXEC AddNeighborhoodCrime 'Lezica, Melilla','Hurto',629,2022
EXEC AddNeighborhoodCrime 'Malvín Norte','Hurto',636,2022
EXEC AddNeighborhoodCrime 'Malvín','Hurto',1250,2022
EXEC AddNeighborhoodCrime 'Manga','Hurto',584,2022
EXEC AddNeighborhoodCrime 'Manga, Toledo Chico','Hurto',617,2022
EXEC AddNeighborhoodCrime 'Maroñas, Parque Guaraní','Hurto',1203,2022
EXEC AddNeighborhoodCrime 'Mercado Modelo, Bolívar','Hurto',1148,2022
EXEC AddNeighborhoodCrime 'Nuevo París','Hurto',1263,2022
EXEC AddNeighborhoodCrime 'Palermo','Hurto',379,2022
EXEC AddNeighborhoodCrime 'Parque Rodó','Hurto',710,2022
EXEC AddNeighborhoodCrime 'Paso de la Arena','Hurto',986,2022
EXEC AddNeighborhoodCrime 'Paso de las Duranas','Hurto',458,2022
EXEC AddNeighborhoodCrime 'Peñarol, Lavalleja','Hurto',758,2022
EXEC AddNeighborhoodCrime 'Piedras Blancas','Hurto',838,2022
EXEC AddNeighborhoodCrime 'Pocitos','Hurto',1961,2022
EXEC AddNeighborhoodCrime 'Pque. Batlle, V. Dolores','Hurto',1901,2022
EXEC AddNeighborhoodCrime 'Prado, Nueva Savona','Hurto',1475,2022
EXEC AddNeighborhoodCrime 'Pta. Rieles, Bella Italia','Hurto',684,2022
EXEC AddNeighborhoodCrime 'Puerto','Hurto',0,2022
EXEC AddNeighborhoodCrime 'Punta Carretas','Hurto',1197,2022
EXEC AddNeighborhoodCrime 'Punta Gorda','Hurto',388,2022
EXEC AddNeighborhoodCrime 'Reducto','Hurto',513,2022
EXEC AddNeighborhoodCrime 'Sayago','Hurto',548,2022
EXEC AddNeighborhoodCrime 'Tres Cruces','Hurto',1629,2022
EXEC AddNeighborhoodCrime 'Tres Ombúes, Victoria','Hurto',745,2022
EXEC AddNeighborhoodCrime 'Unión','Hurto',3343,2022
EXEC AddNeighborhoodCrime 'Villa Española','Hurto',1037,2022
EXEC AddNeighborhoodCrime 'Villa García, Manga Rural','Hurto',716,2022
EXEC AddNeighborhoodCrime 'Villa Muñoz, Retiro','Hurto',654,2022
GO

-- Rapiñas 2022
EXEC AddNeighborhoodCrime 'Aguada','Rapiña',214,2022
EXEC AddNeighborhoodCrime 'Aires Puros','Rapiña',132,2022
EXEC AddNeighborhoodCrime 'Atahualpa','Rapiña',69,2022
EXEC AddNeighborhoodCrime 'Barrio Sur','Rapiña',78,2022
EXEC AddNeighborhoodCrime 'Bañados de Carrasco','Rapiña',215,2022
EXEC AddNeighborhoodCrime 'Belvedere','Rapiña',406,2022
EXEC AddNeighborhoodCrime 'Brazo Oriental','Rapiña',206,2022
EXEC AddNeighborhoodCrime 'Buceo','Rapiña',416,2022
EXEC AddNeighborhoodCrime 'Capurro, Bella Vista','Rapiña',142,2022
EXEC AddNeighborhoodCrime 'Carrasco Norte','Rapiña',175,2022
EXEC AddNeighborhoodCrime 'Carrasco','Rapiña',63,2022
EXEC AddNeighborhoodCrime 'Casabó, Pajas Blancas','Rapiña',346,2022
EXEC AddNeighborhoodCrime 'Casavalle','Rapiña',1018,2022
EXEC AddNeighborhoodCrime 'Castro, P. Castellanos','Rapiña',127,2022
EXEC AddNeighborhoodCrime 'Centro','Rapiña',431,2022
EXEC AddNeighborhoodCrime 'Cerrito','Rapiña',220,2022
EXEC AddNeighborhoodCrime 'Cerro','Rapiña',678,2022
EXEC AddNeighborhoodCrime 'Ciudad Vieja','Rapiña',164,2022
EXEC AddNeighborhoodCrime 'Colón Centro y Noroeste','Rapiña',744,2022
EXEC AddNeighborhoodCrime 'Colón Sureste, Abayubá','Rapiña',215,2022
EXEC AddNeighborhoodCrime 'Conciliación','Rapiña',383,2022
EXEC AddNeighborhoodCrime 'Cordón','Rapiña',396,2022
EXEC AddNeighborhoodCrime 'Flor de Maroñas','Rapiña',356,2022
EXEC AddNeighborhoodCrime 'Ituzaingó','Rapiña',361,2022
EXEC AddNeighborhoodCrime 'Jacinto Vera','Rapiña',71,2022
EXEC AddNeighborhoodCrime 'Jardines del Hipódromo','Rapiña',429,2022
EXEC AddNeighborhoodCrime 'La Blanqueada','Rapiña',75,2022
EXEC AddNeighborhoodCrime 'La Comercial','Rapiña',97,2022
EXEC AddNeighborhoodCrime 'La Figurita','Rapiña',62,2022
EXEC AddNeighborhoodCrime 'La Paloma, Tomkinson','Rapiña',623,2022
EXEC AddNeighborhoodCrime 'La Teja','Rapiña',342,2022
EXEC AddNeighborhoodCrime 'Larrañaga','Rapiña',140,2022
EXEC AddNeighborhoodCrime 'Las Acacias','Rapiña',481,2022
EXEC AddNeighborhoodCrime 'Las Canteras','Rapiña',480,2022
EXEC AddNeighborhoodCrime 'Lezica, Melilla','Rapiña',365,2022
EXEC AddNeighborhoodCrime 'Malvín Norte','Rapiña',493,2022
EXEC AddNeighborhoodCrime 'Malvín','Rapiña',262,2022
EXEC AddNeighborhoodCrime 'Manga','Rapiña',297,2022
EXEC AddNeighborhoodCrime 'Manga, Toledo Chico','Rapiña',414,2022
EXEC AddNeighborhoodCrime 'Maroñas, Parque Guaraní','Rapiña',397,2022
EXEC AddNeighborhoodCrime 'Mercado Modelo, Bolívar','Rapiña',196,2022
EXEC AddNeighborhoodCrime 'Nuevo París','Rapiña',464,2022
EXEC AddNeighborhoodCrime 'Palermo','Rapiña',36,2022
EXEC AddNeighborhoodCrime 'Parque Rodó','Rapiña',119,2022
EXEC AddNeighborhoodCrime 'Paso de la Arena','Rapiña',526,2022
EXEC AddNeighborhoodCrime 'Paso de las Duranas','Rapiña',253,2022
EXEC AddNeighborhoodCrime 'Peñarol, Lavalleja','Rapiña',519,2022
EXEC AddNeighborhoodCrime 'Piedras Blancas','Rapiña',408,2022
EXEC AddNeighborhoodCrime 'Pocitos','Rapiña',201,2022
EXEC AddNeighborhoodCrime 'Pque. Batlle, V. Dolores','Rapiña',288,2022
EXEC AddNeighborhoodCrime 'Prado, Nueva Savona','Rapiña',361,2022
EXEC AddNeighborhoodCrime 'Pta. Rieles, Bella Italia','Rapiña',538,2022
EXEC AddNeighborhoodCrime 'Punta Carretas','Rapiña',187,2022
EXEC AddNeighborhoodCrime 'Punta Gorda','Rapiña',114,2022
EXEC AddNeighborhoodCrime 'Reducto','Rapiña',49,2022
EXEC AddNeighborhoodCrime 'Sayago','Rapiña',235,2022
EXEC AddNeighborhoodCrime 'Tres Cruces','Rapiña',163,2022
EXEC AddNeighborhoodCrime 'Tres Ombúes, Victoria','Rapiña',262,2022
EXEC AddNeighborhoodCrime 'Unión','Rapiña',685,2022
EXEC AddNeighborhoodCrime 'Villa Española','Rapiña',258,2022
EXEC AddNeighborhoodCrime 'Villa García, Manga Rural','Rapiña',562,2022
EXEC AddNeighborhoodCrime 'Villa Muñoz, Retiro','Rapiña',102,2022

GO

-- Homicidios 2023
EXEC AddNeighborhoodCrime 'Aguada','Homicidio',1,2023;
EXEC AddNeighborhoodCrime 'Atahualpa','Homicidio',0,2023;
EXEC AddNeighborhoodCrime 'Aires Puros','Homicidio',3,2023;
EXEC AddNeighborhoodCrime 'Barrio Sur','Homicidio',0,2023;
EXEC AddNeighborhoodCrime 'Bañados de Carrasco','Homicidio',1,2023;
EXEC AddNeighborhoodCrime 'Belvedere','Homicidio',4,2023;
EXEC AddNeighborhoodCrime 'Buceo','Homicidio',0,2023;
EXEC AddNeighborhoodCrime 'Brazo Oriental','Homicidio',2,2023;
EXEC AddNeighborhoodCrime 'Casavalle','Homicidio',13,2023;
EXEC AddNeighborhoodCrime 'Carrasco','Homicidio',0,2023;
EXEC AddNeighborhoodCrime 'Carrasco Norte','Homicidio',1,2023;
EXEC AddNeighborhoodCrime 'Casabó, Pajas Blancas','Homicidio',11,2023;
EXEC AddNeighborhoodCrime 'Castro, P. Castellanos','Homicidio',3,2023;
EXEC AddNeighborhoodCrime 'Capurro, Bella Vista','Homicidio',0,2023;
EXEC AddNeighborhoodCrime 'Centro','Homicidio',0,2023;
EXEC AddNeighborhoodCrime 'Cerro','Homicidio',9,2023;
EXEC AddNeighborhoodCrime 'Cerrito','Homicidio',7,2023;
EXEC AddNeighborhoodCrime 'Ciudad Vieja','Homicidio',2,2023;
EXEC AddNeighborhoodCrime 'Colón Centro y Noroeste','Homicidio',3,2023;
EXEC AddNeighborhoodCrime 'Colón Sureste, Abayubá','Homicidio',5,2023;
EXEC AddNeighborhoodCrime 'Conciliación','Homicidio',5,2023;
EXEC AddNeighborhoodCrime 'Cordón','Homicidio',0,2023;
EXEC AddNeighborhoodCrime 'Flor de Maroñas','Homicidio',6,2023;
EXEC AddNeighborhoodCrime 'Ituzaingó','Homicidio',3,2023;
EXEC AddNeighborhoodCrime 'Jacinto Vera','Homicidio',0,2023;
EXEC AddNeighborhoodCrime 'Jardines del Hipódromo','Homicidio',1,2023;
EXEC AddNeighborhoodCrime 'La Blanqueada','Homicidio',1,2023;
EXEC AddNeighborhoodCrime 'La Comercial','Homicidio',1,2023;
EXEC AddNeighborhoodCrime 'La Figurita','Homicidio',2,2023;
EXEC AddNeighborhoodCrime 'Larrañaga','Homicidio',0,2023;
EXEC AddNeighborhoodCrime 'Las Canteras','Homicidio',11,2023;
EXEC AddNeighborhoodCrime 'La Paloma, Tomkinson','Homicidio',10,2023;
EXEC AddNeighborhoodCrime 'Las Acacias','Homicidio',10,2023;
EXEC AddNeighborhoodCrime 'La Teja','Homicidio',0,2023;
EXEC AddNeighborhoodCrime 'Lezica, Melilla','Homicidio',2,2023;
EXEC AddNeighborhoodCrime 'Malvín','Homicidio',0,2023;
EXEC AddNeighborhoodCrime 'Malvín Norte','Homicidio',2,2023;
EXEC AddNeighborhoodCrime 'Manga','Homicidio',4,2023;
EXEC AddNeighborhoodCrime 'Manga, Toledo Chico','Homicidio',14,2023;
EXEC AddNeighborhoodCrime 'Maroñas, Parque Guaraní','Homicidio',2,2023;
EXEC AddNeighborhoodCrime 'Mercado Modelo, Bolívar','Homicidio',2,2023;
EXEC AddNeighborhoodCrime 'Nuevo París','Homicidio',7,2023;
EXEC AddNeighborhoodCrime 'Palermo','Homicidio',0,2023;
EXEC AddNeighborhoodCrime 'Pque. Batlle, V. Dolores','Homicidio',0,2023;
EXEC AddNeighborhoodCrime 'Parque Rodó','Homicidio',1,2023;
EXEC AddNeighborhoodCrime 'Paso de la Arena','Homicidio',7,2023;
EXEC AddNeighborhoodCrime 'Paso de las Duranas','Homicidio',1,2023;
EXEC AddNeighborhoodCrime 'Peñarol, Lavalleja','Homicidio',4,2023;
EXEC AddNeighborhoodCrime 'Piedras Blancas','Homicidio',8,2023;
EXEC AddNeighborhoodCrime 'Pocitos','Homicidio',1,2023;
EXEC AddNeighborhoodCrime 'Prado, Nueva Savona','Homicidio',0,2023;
EXEC AddNeighborhoodCrime 'Punta Carretas','Homicidio',2,2023;
EXEC AddNeighborhoodCrime 'Punta Gorda','Homicidio',0,2023;
EXEC AddNeighborhoodCrime 'Pta. Rieles, Bella Italia','Homicidio',5,2023;
EXEC AddNeighborhoodCrime 'Reducto','Homicidio',2,2023;
EXEC AddNeighborhoodCrime 'Sayago','Homicidio',1,2023;
EXEC AddNeighborhoodCrime 'Tres Cruces','Homicidio',1,2023;
EXEC AddNeighborhoodCrime 'Tres Ombúes, Victoria','Homicidio',8,2023;
EXEC AddNeighborhoodCrime 'Unión','Homicidio',6,2023;
EXEC AddNeighborhoodCrime 'Villa Española','Homicidio',7,2023;
EXEC AddNeighborhoodCrime 'Villa García, Manga Rural','Homicidio',8,2023;
EXEC AddNeighborhoodCrime 'Villa Muñoz, Retiro','Homicidio',0,2023;

-- Hurtos 2023
EXEC AddNeighborhoodCrime 'Aguada','Hurto',1194,2023
EXEC AddNeighborhoodCrime 'Aires Puros','Hurto',544,2023
EXEC AddNeighborhoodCrime 'Atahualpa','Hurto',363,2023
EXEC AddNeighborhoodCrime 'Barrio Sur','Hurto',482,2023
EXEC AddNeighborhoodCrime 'Bañados de Carrasco','Hurto',435,2023
EXEC AddNeighborhoodCrime 'Belvedere','Hurto',933,2023
EXEC AddNeighborhoodCrime 'Brazo Oriental','Hurto',764,2023
EXEC AddNeighborhoodCrime 'Buceo','Hurto',1953,2023
EXEC AddNeighborhoodCrime 'Capurro, Bella Vista','Hurto',604,2023
EXEC AddNeighborhoodCrime 'Carrasco Norte','Hurto',486,2023
EXEC AddNeighborhoodCrime 'Carrasco','Hurto',519,2023
EXEC AddNeighborhoodCrime 'Casabó, Pajas Blancas','Hurto',505,2023
EXEC AddNeighborhoodCrime 'Casavalle','Hurto',807,2023
EXEC AddNeighborhoodCrime 'Castro, P. Castellanos','Hurto',446,2023
EXEC AddNeighborhoodCrime 'Centro','Hurto',2651,2023
EXEC AddNeighborhoodCrime 'Cerrito','Hurto',605,2023
EXEC AddNeighborhoodCrime 'Cerro','Hurto',946,2023
EXEC AddNeighborhoodCrime 'Ciudad Vieja','Hurto',1222,2023
EXEC AddNeighborhoodCrime 'Colón Centro y Noroeste','Hurto',1180,2023
EXEC AddNeighborhoodCrime 'Colón Sureste, Abayubá','Hurto',354,2023
EXEC AddNeighborhoodCrime 'Conciliación','Hurto',587,2023
EXEC AddNeighborhoodCrime 'Cordón','Hurto',3293,2023
EXEC AddNeighborhoodCrime 'Flor de Maroñas','Hurto',961,2023
EXEC AddNeighborhoodCrime 'Ituzaingó','Hurto',901,2023
EXEC AddNeighborhoodCrime 'Jacinto Vera','Hurto',402,2023
EXEC AddNeighborhoodCrime 'Jardines del Hipódromo','Hurto',572,2023
EXEC AddNeighborhoodCrime 'La Blanqueada','Hurto',832,2023
EXEC AddNeighborhoodCrime 'La Comercial','Hurto',568,2023
EXEC AddNeighborhoodCrime 'La Figurita','Hurto',349,2023
EXEC AddNeighborhoodCrime 'La Paloma, Tomkinson','Hurto',721,2023
EXEC AddNeighborhoodCrime 'La Teja','Hurto',738,2023
EXEC AddNeighborhoodCrime 'Larrañaga','Hurto',1081,2023
EXEC AddNeighborhoodCrime 'Las Acacias','Hurto',604,2023
EXEC AddNeighborhoodCrime 'Las Canteras','Hurto',610,2023
EXEC AddNeighborhoodCrime 'Lezica, Melilla','Hurto',895,2023
EXEC AddNeighborhoodCrime 'Malvín Norte','Hurto',582,2023
EXEC AddNeighborhoodCrime 'Malvín','Hurto',1133,2023
EXEC AddNeighborhoodCrime 'Manga','Hurto',446,2023
EXEC AddNeighborhoodCrime 'Manga, Toledo Chico','Hurto',540,2023
EXEC AddNeighborhoodCrime 'Maroñas, Parque Guaraní','Hurto',838,2023
EXEC AddNeighborhoodCrime 'Mercado Modelo, Bolívar','Hurto',1047,2023
EXEC AddNeighborhoodCrime 'Nuevo París','Hurto',1042,2023
EXEC AddNeighborhoodCrime 'Palermo','Hurto',349,2023
EXEC AddNeighborhoodCrime 'Parque Rodó','Hurto',597,2023
EXEC AddNeighborhoodCrime 'Paso de la Arena','Hurto',829,2023
EXEC AddNeighborhoodCrime 'Paso de las Duranas','Hurto',514,2023
EXEC AddNeighborhoodCrime 'Peñarol, Lavalleja','Hurto',927,2023
EXEC AddNeighborhoodCrime 'Piedras Blancas','Hurto',797,2023
EXEC AddNeighborhoodCrime 'Pocitos','Hurto',2020,2023
EXEC AddNeighborhoodCrime 'Pque. Batlle, V. Dolores','Hurto',1987,2023
EXEC AddNeighborhoodCrime 'Prado, Nueva Savona','Hurto',1489,2023
EXEC AddNeighborhoodCrime 'Pta. Rieles, Bella Italia','Hurto',891,2023
EXEC AddNeighborhoodCrime 'Punta Carretas','Hurto',1159,2023
EXEC AddNeighborhoodCrime 'Punta Gorda','Hurto',404,2023
EXEC AddNeighborhoodCrime 'Reducto','Hurto',433,2023
EXEC AddNeighborhoodCrime 'Sayago','Hurto',636,2023
EXEC AddNeighborhoodCrime 'Tres Cruces','Hurto',1858,2023
EXEC AddNeighborhoodCrime 'Tres Ombúes, Victoria','Hurto',502,2023
EXEC AddNeighborhoodCrime 'Unión','Hurto',3560,2023
EXEC AddNeighborhoodCrime 'Villa Española','Hurto',784,2023
EXEC AddNeighborhoodCrime 'Villa García, Manga Rural','Hurto',666,2023
EXEC AddNeighborhoodCrime 'Villa Muñoz, Retiro','Hurto',542,2023

-- Rapiñas 2023
EXEC AddNeighborhoodCrime 'Aguada','Rapiña',172,2023
EXEC AddNeighborhoodCrime 'Aires Puros','Rapiña',161,2023
EXEC AddNeighborhoodCrime 'Atahualpa','Rapiña',79,2023
EXEC AddNeighborhoodCrime 'Barrio Sur','Rapiña',55,2023
EXEC AddNeighborhoodCrime 'Bañados de Carrasco','Rapiña',204,2023
EXEC AddNeighborhoodCrime 'Belvedere','Rapiña',397,2023
EXEC AddNeighborhoodCrime 'Brazo Oriental','Rapiña',211,2023
EXEC AddNeighborhoodCrime 'Buceo','Rapiña',363,2023
EXEC AddNeighborhoodCrime 'Capurro, Bella Vista','Rapiña',120,2023
EXEC AddNeighborhoodCrime 'Carrasco Norte','Rapiña',126,2023
EXEC AddNeighborhoodCrime 'Carrasco','Rapiña',68,2023
EXEC AddNeighborhoodCrime 'Casabó, Pajas Blancas','Rapiña',405,2023
EXEC AddNeighborhoodCrime 'Casavalle','Rapiña',915,2023
EXEC AddNeighborhoodCrime 'Castro, P. Castellanos','Rapiña',165,2023
EXEC AddNeighborhoodCrime 'Centro','Rapiña',336,2023
EXEC AddNeighborhoodCrime 'Cerrito','Rapiña',249,2023
EXEC AddNeighborhoodCrime 'Cerro','Rapiña',516,2023
EXEC AddNeighborhoodCrime 'Ciudad Vieja','Rapiña',126,2023
EXEC AddNeighborhoodCrime 'Colón Centro y Noroeste','Rapiña',650,2023
EXEC AddNeighborhoodCrime 'Colón Sureste, Abayubá','Rapiña',257,2023
EXEC AddNeighborhoodCrime 'Conciliación','Rapiña',367,2023
EXEC AddNeighborhoodCrime 'Cordón','Rapiña',341,2023
EXEC AddNeighborhoodCrime 'Flor de Maroñas','Rapiña',425,2023
EXEC AddNeighborhoodCrime 'Ituzaingó','Rapiña',305,2023
EXEC AddNeighborhoodCrime 'Jacinto Vera','Rapiña',94,2023
EXEC AddNeighborhoodCrime 'Jardines del Hipódromo','Rapiña',472,2023
EXEC AddNeighborhoodCrime 'La Blanqueada','Rapiña',66,2023
EXEC AddNeighborhoodCrime 'La Comercial','Rapiña',71,2023
EXEC AddNeighborhoodCrime 'La Figurita','Rapiña',49,2023
EXEC AddNeighborhoodCrime 'La Paloma, Tomkinson','Rapiña',609,2023
EXEC AddNeighborhoodCrime 'La Teja','Rapiña',257,2023
EXEC AddNeighborhoodCrime 'Larrañaga','Rapiña',154,2023
EXEC AddNeighborhoodCrime 'Las Acacias','Rapiña',450,2023
EXEC AddNeighborhoodCrime 'Las Canteras','Rapiña',351,2023
EXEC AddNeighborhoodCrime 'Lezica, Melilla','Rapiña',432,2023
EXEC AddNeighborhoodCrime 'Malvín Norte','Rapiña',689,2023
EXEC AddNeighborhoodCrime 'Malvín','Rapiña',244,2023
EXEC AddNeighborhoodCrime 'Manga','Rapiña',306,2023
EXEC AddNeighborhoodCrime 'Manga, Toledo Chico','Rapiña',478,2023
EXEC AddNeighborhoodCrime 'Maroñas, Parque Guaraní','Rapiña',439,2023
EXEC AddNeighborhoodCrime 'Mercado Modelo, Bolívar','Rapiña',219,2023
EXEC AddNeighborhoodCrime 'Nuevo París','Rapiña',549,2023
EXEC AddNeighborhoodCrime 'Palermo','Rapiña',36,2023
EXEC AddNeighborhoodCrime 'Parque Rodó','Rapiña',90,2023
EXEC AddNeighborhoodCrime 'Paso de la Arena','Rapiña',519,2023
EXEC AddNeighborhoodCrime 'Paso de las Duranas','Rapiña',217,2023
EXEC AddNeighborhoodCrime 'Peñarol, Lavalleja','Rapiña',579,2023
EXEC AddNeighborhoodCrime 'Piedras Blancas','Rapiña',400,2023
EXEC AddNeighborhoodCrime 'Pocitos','Rapiña',165,2023
EXEC AddNeighborhoodCrime 'Pque. Batlle, V. Dolores','Rapiña',236,2023
EXEC AddNeighborhoodCrime 'Prado, Nueva Savona','Rapiña',329,2023
EXEC AddNeighborhoodCrime 'Pta. Rieles, Bella Italia','Rapiña',454,2023
EXEC AddNeighborhoodCrime 'Punta Carretas','Rapiña',168,2023
EXEC AddNeighborhoodCrime 'Punta Gorda','Rapiña',95,2023
EXEC AddNeighborhoodCrime 'Reducto','Rapiña',80,2023
EXEC AddNeighborhoodCrime 'Sayago','Rapiña',179,2023
EXEC AddNeighborhoodCrime 'Tres Cruces','Rapiña',168,2023
EXEC AddNeighborhoodCrime 'Tres Ombúes, Victoria','Rapiña',246,2023
EXEC AddNeighborhoodCrime 'Unión','Rapiña',703,2023
EXEC AddNeighborhoodCrime 'Villa Española','Rapiña',228,2023
EXEC AddNeighborhoodCrime 'Villa García, Manga Rural','Rapiña',438,2023
EXEC AddNeighborhoodCrime 'Villa Muñoz, Retiro','Rapiña',63,2023

GO

-- Homicidios 2024
EXEC AddNeighborhoodCrime 'Aguada','Homicidio',0,2024;
EXEC AddNeighborhoodCrime 'Atahualpa','Homicidio',0,2024;
EXEC AddNeighborhoodCrime 'Aires Puros','Homicidio',1,2024;
EXEC AddNeighborhoodCrime 'Barrio Sur','Homicidio',1,2024;
EXEC AddNeighborhoodCrime 'Bañados de Carrasco','Homicidio',7,2024;
EXEC AddNeighborhoodCrime 'Belvedere','Homicidio',1,2024;
EXEC AddNeighborhoodCrime 'Buceo','Homicidio',4,2024;
EXEC AddNeighborhoodCrime 'Brazo Oriental','Homicidio',0,2024;
EXEC AddNeighborhoodCrime 'Casavalle','Homicidio',22,2024;
EXEC AddNeighborhoodCrime 'Carrasco','Homicidio',0,2024;
EXEC AddNeighborhoodCrime 'Carrasco Norte','Homicidio',0,2024;
EXEC AddNeighborhoodCrime 'Casabó, Pajas Blancas','Homicidio',12,2024;
EXEC AddNeighborhoodCrime 'Castro, P. Castellanos','Homicidio',1,2024;
EXEC AddNeighborhoodCrime 'Capurro, Bella Vista','Homicidio',3,2024;
EXEC AddNeighborhoodCrime 'Centro','Homicidio',1,2024;
EXEC AddNeighborhoodCrime 'Cerro','Homicidio',12,2024;
EXEC AddNeighborhoodCrime 'Cerrito','Homicidio',1,2024;
EXEC AddNeighborhoodCrime 'Ciudad Vieja','Homicidio',0,2024;
EXEC AddNeighborhoodCrime 'Colón Centro y Noroeste','Homicidio',7,2024; 
EXEC AddNeighborhoodCrime 'Colón Sureste, Abayubá','Homicidio',3,2024;
EXEC AddNeighborhoodCrime 'Conciliación','Homicidio',5,2024;
EXEC AddNeighborhoodCrime 'Cordón','Homicidio',1,2024;
EXEC AddNeighborhoodCrime 'Flor de Maroñas','Homicidio',6,2024;
EXEC AddNeighborhoodCrime 'Ituzaingó','Homicidio',1,2024;
EXEC AddNeighborhoodCrime 'Jacinto Vera','Homicidio',0,2024;
EXEC AddNeighborhoodCrime 'Jardines del Hipódromo','Homicidio',8,2024;
EXEC AddNeighborhoodCrime 'La Blanqueada','Homicidio',0,2024;
EXEC AddNeighborhoodCrime 'La Comercial','Homicidio',0,2024;
EXEC AddNeighborhoodCrime 'La Figurita','Homicidio',0,2024;
EXEC AddNeighborhoodCrime 'Larrañaga','Homicidio',1,2024;
EXEC AddNeighborhoodCrime 'Las Canteras','Homicidio',4,2024;
EXEC AddNeighborhoodCrime 'La Paloma, Tomkinson','Homicidio',36,2024;
EXEC AddNeighborhoodCrime 'Las Acacias','Homicidio',7,2024;
EXEC AddNeighborhoodCrime 'La Teja','Homicidio',1,2024;
EXEC AddNeighborhoodCrime 'Lezica, Melilla','Homicidio',3,2024;
EXEC AddNeighborhoodCrime 'Malvín','Homicidio',2,2024;
EXEC AddNeighborhoodCrime 'Malvín Norte','Homicidio',7,2024;
EXEC AddNeighborhoodCrime 'Manga','Homicidio',2,2024;
EXEC AddNeighborhoodCrime 'Manga, Toledo Chico','Homicidio',6,2024;
EXEC AddNeighborhoodCrime 'Maroñas, Parque Guaraní','Homicidio',2,2024;
EXEC AddNeighborhoodCrime 'Mercado Modelo, Bolívar','Homicidio',0,2024;
EXEC AddNeighborhoodCrime 'Nuevo París','Homicidio',9,2024;
EXEC AddNeighborhoodCrime 'Palermo','Homicidio',0,2024; 
EXEC AddNeighborhoodCrime 'Pque. Batlle, V. Dolores','Homicidio',1,2024;
EXEC AddNeighborhoodCrime 'Parque Rodó','Homicidio',0,2024;
EXEC AddNeighborhoodCrime 'Paso de la Arena','Homicidio',1,2024;
EXEC AddNeighborhoodCrime 'Paso de las Duranas','Homicidio',1,2024;
EXEC AddNeighborhoodCrime 'Peñarol, Lavalleja','Homicidio',2,2024;
EXEC AddNeighborhoodCrime 'Piedras Blancas','Homicidio',7,2024;
EXEC AddNeighborhoodCrime 'Pocitos','Homicidio',0,2024;
EXEC AddNeighborhoodCrime 'Prado, Nueva Savona','Homicidio',3,2024;
EXEC AddNeighborhoodCrime 'Punta Carretas','Homicidio',0,2024;
EXEC AddNeighborhoodCrime 'Punta Gorda','Homicidio',0,2024; 
EXEC AddNeighborhoodCrime 'Pta. Rieles, Bella Italia','Homicidio',7,2024; 
EXEC AddNeighborhoodCrime 'Reducto','Homicidio',0,2024; 
EXEC AddNeighborhoodCrime 'Sayago','Homicidio',4,2024;
EXEC AddNeighborhoodCrime 'Tres Cruces','Homicidio',0,2024; 
EXEC AddNeighborhoodCrime 'Tres Ombúes, Victoria','Homicidio',4,2024;
EXEC AddNeighborhoodCrime 'Unión','Homicidio',4,2024;
EXEC AddNeighborhoodCrime 'Villa Española','Homicidio',8,2024;
EXEC AddNeighborhoodCrime 'Villa García, Manga Rural','Homicidio',9,2024;
EXEC AddNeighborhoodCrime 'Villa Muñoz, Retiro','Homicidio',3,2024;

GO

-- Hurtos 2024
EXEC AddNeighborhoodCrime 'Aguada','Hurto',1194,2024
EXEC AddNeighborhoodCrime 'Aires Puros','Hurto',493,2024
EXEC AddNeighborhoodCrime 'Atahualpa','Hurto',372,2024
EXEC AddNeighborhoodCrime 'Barrio Sur','Hurto',482,2024
EXEC AddNeighborhoodCrime 'Bañados de Carrasco','Hurto',412,2024
EXEC AddNeighborhoodCrime 'Belvedere','Hurto',1031,2024
EXEC AddNeighborhoodCrime 'Brazo Oriental','Hurto',763,2024
EXEC AddNeighborhoodCrime 'Buceo','Hurto',2403,2024
EXEC AddNeighborhoodCrime 'Capurro, Bella Vista','Hurto',616,2024
EXEC AddNeighborhoodCrime 'Carrasco Norte','Hurto',560,2024
EXEC AddNeighborhoodCrime 'Carrasco','Hurto',611,2024
EXEC AddNeighborhoodCrime 'Casabó, Pajas Blancas','Hurto',521,2024
EXEC AddNeighborhoodCrime 'Casavalle','Hurto',748,2024
EXEC AddNeighborhoodCrime 'Castro, P. Castellanos','Hurto',388,2024
EXEC AddNeighborhoodCrime 'Centro','Hurto',2514,2024
EXEC AddNeighborhoodCrime 'Cerrito','Hurto',637,2024
EXEC AddNeighborhoodCrime 'Cerro','Hurto',888,2024
EXEC AddNeighborhoodCrime 'Ciudad Vieja','Hurto',1028,2024
EXEC AddNeighborhoodCrime 'Colón Centro y Noroeste','Hurto',1318,2024
EXEC AddNeighborhoodCrime 'Colón Sureste, Abayubá','Hurto',334,2024
EXEC AddNeighborhoodCrime 'Conciliación','Hurto',476,2024
EXEC AddNeighborhoodCrime 'Cordón','Hurto',2972,2024
EXEC AddNeighborhoodCrime 'Flor de Maroñas','Hurto',874,2024
EXEC AddNeighborhoodCrime 'Ituzaingó','Hurto',722,2024
EXEC AddNeighborhoodCrime 'Jacinto Vera','Hurto',488,2024
EXEC AddNeighborhoodCrime 'Jardines del Hipódromo','Hurto',635,2024
EXEC AddNeighborhoodCrime 'La Blanqueada','Hurto',834,2024
EXEC AddNeighborhoodCrime 'La Comercial','Hurto',432,2024
EXEC AddNeighborhoodCrime 'La Figurita','Hurto',349,2024
EXEC AddNeighborhoodCrime 'La Paloma, Tomkinson','Hurto',690,2024
EXEC AddNeighborhoodCrime 'La Teja','Hurto',763,2024
EXEC AddNeighborhoodCrime 'Larrañaga','Hurto',1002,2024
EXEC AddNeighborhoodCrime 'Las Acacias','Hurto',650,2024
EXEC AddNeighborhoodCrime 'Las Canteras','Hurto',684,2024
EXEC AddNeighborhoodCrime 'Lezica, Melilla','Hurto',675,2024
EXEC AddNeighborhoodCrime 'Malvín Norte','Hurto',632,2024
EXEC AddNeighborhoodCrime 'Malvín','Hurto',1329,2024
EXEC AddNeighborhoodCrime 'Manga','Hurto',398,2024
EXEC AddNeighborhoodCrime 'Manga, Toledo Chico','Hurto',501,2024
EXEC AddNeighborhoodCrime 'Maroñas, Parque Guaraní','Hurto',778,2024
EXEC AddNeighborhoodCrime 'Mercado Modelo, Bolívar','Hurto',1242,2024
EXEC AddNeighborhoodCrime 'Nuevo París','Hurto',883,2024
EXEC AddNeighborhoodCrime 'Palermo','Hurto',367,2024
EXEC AddNeighborhoodCrime 'Parque Rodó','Hurto',645,2024
EXEC AddNeighborhoodCrime 'Paso de la Arena','Hurto',760,2024
EXEC AddNeighborhoodCrime 'Paso de las Duranas','Hurto',373,2024
EXEC AddNeighborhoodCrime 'Peñarol, Lavalleja','Hurto',838,2024
EXEC AddNeighborhoodCrime 'Piedras Blancas','Hurto',754,2024
EXEC AddNeighborhoodCrime 'Pocitos','Hurto',2263,2024
EXEC AddNeighborhoodCrime 'Pque. Batlle, V. Dolores','Hurto',2072,2024
EXEC AddNeighborhoodCrime 'Prado, Nueva Savona','Hurto',1307,2024
EXEC AddNeighborhoodCrime 'Pta. Rieles, Bella Italia','Hurto',877,2024
EXEC AddNeighborhoodCrime 'Punta Carretas','Hurto',1173,2024
EXEC AddNeighborhoodCrime 'Punta Gorda','Hurto',597,2024
EXEC AddNeighborhoodCrime 'Reducto','Hurto',440,2024
EXEC AddNeighborhoodCrime 'Sayago','Hurto',543,2024
EXEC AddNeighborhoodCrime 'Tres Cruces','Hurto',1521,2024
EXEC AddNeighborhoodCrime 'Tres Ombúes, Victoria','Hurto',490,2024
EXEC AddNeighborhoodCrime 'Unión','Hurto',3159,2024
EXEC AddNeighborhoodCrime 'Villa Española','Hurto',651,2024
EXEC AddNeighborhoodCrime 'Villa García, Manga Rural','Hurto',624,2024
EXEC AddNeighborhoodCrime 'Villa Muñoz, Retiro','Hurto',536,2024
GO

-- Rapiñas 2024
EXEC AddNeighborhoodCrime 'Aguada','Rapiña',134,2024
EXEC AddNeighborhoodCrime 'Aires Puros','Rapiña',113,2024
EXEC AddNeighborhoodCrime 'Atahualpa','Rapiña',32,2024
EXEC AddNeighborhoodCrime 'Barrio Sur','Rapiña',30,2024
EXEC AddNeighborhoodCrime 'Bañados de Carrasco','Rapiña',143,2024
EXEC AddNeighborhoodCrime 'Belvedere','Rapiña',292,2024
EXEC AddNeighborhoodCrime 'Brazo Oriental','Rapiña',181,2024
EXEC AddNeighborhoodCrime 'Buceo','Rapiña',353,2024
EXEC AddNeighborhoodCrime 'Capurro, Bella Vista','Rapiña',121,2024
EXEC AddNeighborhoodCrime 'Carrasco Norte','Rapiña',117,2024
EXEC AddNeighborhoodCrime 'Carrasco','Rapiña',80,2024
EXEC AddNeighborhoodCrime 'Casabó, Pajas Blancas','Rapiña',281,2024
EXEC AddNeighborhoodCrime 'Casavalle','Rapiña',636,2024
EXEC AddNeighborhoodCrime 'Castro, P. Castellanos','Rapiña',95,2024
EXEC AddNeighborhoodCrime 'Centro','Rapiña',288,2024
EXEC AddNeighborhoodCrime 'Cerrito','Rapiña',144,2024
EXEC AddNeighborhoodCrime 'Cerro','Rapiña',469,2024
EXEC AddNeighborhoodCrime 'Ciudad Vieja','Rapiña',120,2024
EXEC AddNeighborhoodCrime 'Colón Centro y Noroeste','Rapiña',520,2024
EXEC AddNeighborhoodCrime 'Colón Sureste, Abayubá','Rapiña',169,2024
EXEC AddNeighborhoodCrime 'Conciliación','Rapiña',243,2024
EXEC AddNeighborhoodCrime 'Cordón','Rapiña',286,2024
EXEC AddNeighborhoodCrime 'Flor de Maroñas','Rapiña',326,2024
EXEC AddNeighborhoodCrime 'Ituzaingó','Rapiña',215,2024
EXEC AddNeighborhoodCrime 'Jacinto Vera','Rapiña',89,2024
EXEC AddNeighborhoodCrime 'Jardines del Hipódromo','Rapiña',369,2024
EXEC AddNeighborhoodCrime 'La Blanqueada','Rapiña',48,2024
EXEC AddNeighborhoodCrime 'La Comercial','Rapiña',42,2024
EXEC AddNeighborhoodCrime 'La Figurita','Rapiña',42,2024
EXEC AddNeighborhoodCrime 'La Paloma, Tomkinson','Rapiña',362,2024
EXEC AddNeighborhoodCrime 'La Teja','Rapiña',193,2024
EXEC AddNeighborhoodCrime 'Larrañaga','Rapiña',108,2024
EXEC AddNeighborhoodCrime 'Las Acacias','Rapiña',272,2024
EXEC AddNeighborhoodCrime 'Las Canteras','Rapiña',208,2024
EXEC AddNeighborhoodCrime 'Lezica, Melilla','Rapiña',243,2024
EXEC AddNeighborhoodCrime 'Malvín Norte','Rapiña',731,2024
EXEC AddNeighborhoodCrime 'Malvín','Rapiña',240,2024
EXEC AddNeighborhoodCrime 'Manga','Rapiña',190,2024
EXEC AddNeighborhoodCrime 'Manga, Toledo Chico','Rapiña',306,2024
EXEC AddNeighborhoodCrime 'Maroñas, Parque Guaraní','Rapiña',332,2024
EXEC AddNeighborhoodCrime 'Mercado Modelo, Bolívar','Rapiña',192,2024
EXEC AddNeighborhoodCrime 'Nuevo París','Rapiña',318,2024
EXEC AddNeighborhoodCrime 'Palermo','Rapiña',29,2024
EXEC AddNeighborhoodCrime 'Parque Rodó','Rapiña',72,2024
EXEC AddNeighborhoodCrime 'Paso de la Arena','Rapiña',446,2024
EXEC AddNeighborhoodCrime 'Paso de las Duranas','Rapiña',185,2024
EXEC AddNeighborhoodCrime 'Peñarol, Lavalleja','Rapiña',491,2024
EXEC AddNeighborhoodCrime 'Piedras Blancas','Rapiña',385,2024
EXEC AddNeighborhoodCrime 'Pocitos','Rapiña',116,2024
EXEC AddNeighborhoodCrime 'Pque. Batlle, V. Dolores','Rapiña',211,2024
EXEC AddNeighborhoodCrime 'Prado, Nueva Savona','Rapiña',265,2024
EXEC AddNeighborhoodCrime 'Pta. Rieles, Bella Italia','Rapiña',375,2024
EXEC AddNeighborhoodCrime 'Punta Carretas','Rapiña',115,2024
EXEC AddNeighborhoodCrime 'Punta Gorda','Rapiña',83,2024
EXEC AddNeighborhoodCrime 'Reducto','Rapiña',39,2024
EXEC AddNeighborhoodCrime 'Sayago','Rapiña',186,2024
EXEC AddNeighborhoodCrime 'Tres Cruces','Rapiña',138,2024
EXEC AddNeighborhoodCrime 'Tres Ombúes, Victoria','Rapiña',204,2024
EXEC AddNeighborhoodCrime 'Unión','Rapiña',523,2024
EXEC AddNeighborhoodCrime 'Villa Española','Rapiña',151,2024
EXEC AddNeighborhoodCrime 'Villa García, Manga Rural','Rapiña',341,2024
EXEC AddNeighborhoodCrime 'Villa Muñoz, Retiro','Rapiña',46,2024