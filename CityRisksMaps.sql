IF NOT EXISTS(select * from sys.databases where name='CityRisksMap')
CREATE DATABASE CityRisksMap;
 
USE CityRisksMap;

CREATE TABLE Rols(
idRol INT IDENTITY(1,1) Primary key,
name VARCHAR(10) UNIQUE NOT NULL CHECK(LEN(name)>0),
created DATETIME NOT NULL DEFAULT GETDATE(),
lastModified DATETIME,
);

CREATE TABLE Users(
idUser INT IDENTITY(1,1) Primary key ,
email VARCHAR(40) UNIQUE CHECK(PATINDEX('%@[a-zA-Z]%.com%%',email)>0), 
name VARCHAR(20) NOT NULL CHECK(LEN(name)>0),
lastname VARCHAR(20) NOT NULL CHECK(LEN(lastname)>0),
password VARCHAR(60),   
activated BIT NOT NULL,
auth2FA BIT NOT NULL DEFAULT 0,
created DATETIME NOT NULL DEFAULT GETDATE(),
lastModified DATETIME,
rol INT NOT NULL FOREIGN KEY REFERENCES Rols(idRol) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE Verifications_Codes(
code VARCHAR(60) PRIMARY KEY,
expiration DATETIME NOT NULL CHECK(expiration>GETDATE()),
used BIT NOT NULL DEFAULT 0,
idUser INT NOT NULL FOREIGN KEY REFERENCES Users(idUser) ON UPDATE CASCADE ON DELETE CASCADE,
);

CREATE TABLE Departments(
idDepartment INT IDENTITY(1,1) Primary key, 
name VARCHAR(30) NOT NULL UNIQUE CHECK(LEN(name)>0),
);

CREATE TABLE Neighborhoods(
idNeighborhood INT IDENTITY(1,1) Primary key, 
name VARCHAR(30) CHECK(LEN(name)>0),
department INT NOT NULL FOREIGN KEY REFERENCES Departments(idDepartment) ON UPDATE CASCADE ON DELETE CASCADE
);


CREATE TABLE Population (
idPopulation INT IDENTITY (1,1) Primary key,
neighborhood INT NOT NULL FOREIGN KEY REFERENCES Neighborhoods(idNeighborhood) ON UPDATE CASCADE ON DELETE CASCADE,
quantity INT NOT NULL CHECK(quantity>=0),
year INT NOT NULL CHECK(year<=YEAR(GETDATE()))
);


CREATE TABLE Crimes(
category VARCHAR(20) Primary key,
description VARCHAR(700) NOT NULL,
created DATETIME NOT NULL DEFAULT GETDATE(),
lastModified DATETIME
);


CREATE TABLE Neighborhoods_Crimes(
neighborhood INT FOREIGN KEY REFERENCES Neighborhoods(idNeighborhood) ON UPDATE CASCADE ON DELETE CASCADE,
crime VARCHAR(20) FOREIGN KEY REFERENCES Crimes(category) ON UPDATE CASCADE ON DELETE CASCADE,
quantity INT CHECK(quantity>=0),
increase DECIMAL(5,1),
rate DECIMAL(6,1) CHECK(rate>=0),
year INT NOT NULL CHECK(year<=YEAR(GETDATE())),
Primary key(neighborhood,crime,year)
);


CREATE TABLE Auditory_Neighborhoods_Crimes(
idAuditory INT IDENTITY(1,1) Primary key NOT NULL,
neighborhood INT NOT NULL,
crime VARCHAR(20) NOT NULL,
year INT NOT NULL,
auditoryDate DATETIME NOT NULL DEFAULT GETDATE(),
actionName VARCHAR(6) NOT NULL,
oldValues VARCHAR(70),
newValues VARCHAR(70),
FOREIGN KEY(neighborhood,crime,year) REFERENCES Neighborhoods_Crimes ON UPDATE CASCADE ON DELETE CASCADE
);


CREATE TABLE Zones(
idZone INT Primary key,
description VARCHAR(250) NOT NULL CHECK(LEN(description)>0),
coordinates GEOGRAPHY NOT NULL,
created DATETIME NOT NULL DEFAULT GETDATE(),
lastModified DATETIME,
enable bit NOT NULL

);


CREATE TABLE Zones_Neighborhoods(
zone INT FOREIGN KEY REFERENCES Zones(idZone) ON UPDATE CASCADE ON DELETE CASCADE,
neighborhood INT FOREIGN KEY REFERENCES Neighborhoods(idNeighborhood) ON UPDATE CASCADE ON DELETE CASCADE 
Primary key(zone,neighborhood)
);


GO

--------------------------------------------------------------------------------------------------------------

-----1 Client Error 
-----2 Not found Error
-----3 Conflict Error 
-----4 Server Error 

--Rols PROCEDURES

CREATE OR ALTER PROCEDURE AddRol @name VARCHAR(10)  AS
BEGIN

IF (LEN(@name)=0)
BEGIN
RAISERROR('Nombre no puede estar vacio',16,1)
RETURN 
END

IF EXISTS (select * from Rols where name=@name)
BEGIN
RAISERROR('Ya existe un rol con este nombre en el sistema',16,3)
RETURN 
END


INSERT INTO Rols(name) VALUES(@name);

IF(@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al agregar rol',17,4)
RETURN 
END

END
GO

CREATE OR ALTER PROCEDURE UpdateRol @idRol INT,@name VARCHAR(10) AS
BEGIN

IF (LEN(@name)=0)
BEGIN
RAISERROR('Nombre no puede estar vacio',16,1)
RETURN 
END

IF NOT EXISTS (select * from Rols where idRol=@idRol)
BEGIN
RAISERROR('No se encontro un rol con el ID',16,2)
RETURN 
END

IF EXISTS (select * from Rols where idRol!=@idRol and name=@name)
BEGIN
RAISERROR('Ya existe un rol con este nombre',16,3)
RETURN 
END

UPDATE Rols set name=@name where idRol=@idRol;

IF(@@ERROR<>0)
BEGIN
RAISERROR('Error inesperadoa al actualizar el rol',16,4)
RETURN 
END

END
GO

CREATE OR ALTER PROCEDURE DeleteRol @idRol INT AS
BEGIN

DECLARE @rowsAffected INT

IF NOT EXISTS (select * from Rols where idRol=@idRol)
BEGIN
RAISERROR('No se encontro un rol con este ID',16,2)
RETURN 
END

DELETE FROM Rols where idRol=@idRol
SELECT @rowsAffected=@@ROWCOUNT;

IF(@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al eliminar rol',16,4)
RETURN 
END

IF (@rowsAffected=0)
BEGIN
RAISERROR('Este registro ya ha sido eliminado por otro usuario',16,4)
RETURN 
END

RETURN 1
END
GO

CREATE OR ALTER PROCEDURE AllRols AS
BEGIN

SELECT * FROM Rols;

END
GO

CREATE OR ALTER PROCEDURE RolById @idRol INT AS
BEGIN

SELECT * FROM Rols where idRol=@idRol;

END
GO

CREATE OR ALTER PROCEDURE RolByName @name VARCHAR(10) AS
BEGIN

SELECT * FROM Rols where name=@name;

END
GO

--------------------------------------------------------------------------------------------------------------
--Users PROCEDURES

CREATE OR ALTER PROCEDURE AddUser @email VARCHAR(40),@name VARCHAR(20),@lastname VARCHAR(20),
@rol INT,@activated BIT AS

BEGIN

IF (PATINDEX('%@[a-zA-Z]%.com%%',@email)=0)
BEGIN
RAISERROR('Formato de correo incorrecto',16,1)
RETURN 
END

IF (@name='' OR LEN(@name)=0)
BEGIN
RAISERROR('Nombre no puede estar vacio',16,1)
RETURN 
END

IF (@lastname='' OR LEN(@lastname)=0)
BEGIN
RAISERROR('Apellido no puede estar vacio',16,1)
RETURN 
END

IF NOT EXISTS (select * from Rols where idRol=@rol)
BEGIN
RAISERROR('No se encontro un rol con este ID',16,2)
RETURN 
END

IF EXISTS (select * from Users where email=@email)
BEGIN
RAISERROR('Ya existe un usuario registrado con este correo',16,3)
RETURN 
END

INSERT INTO Users(email,name,lastname,activated,rol) VALUES(@email,@name,@lastname,@activated,@rol);

IF(@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al agregar usuario',16,4)
RETURN 
END


RETURN scope_identity();

END
GO


CREATE OR ALTER PROCEDURE UpdateUser @idUser INT,@email VARCHAR(40),@name VARCHAR(20),@lastname VARCHAR(20),@rol INT AS

BEGIN

IF (PATINDEX('%@[a-zA-Z]%.com%%',@email)=0)
BEGIN
RAISERROR('Formato de correo incorrecto',16,1)
RETURN 
END

IF (@name='' OR LEN(@name)=0)
BEGIN
RAISERROR('Nombre no puede estar vacio',16,1)
RETURN 
END

IF (@lastname='' OR LEN(@lastname)=0)
BEGIN
RAISERROR('Apellido no puede estar vacio',16,1)
RETURN 
END

IF NOT EXISTS (select * from Users where idUser=@idUser)
BEGIN
RAISERROR('No se encontro un usuario con este ID',16,2)
RETURN 
END

IF NOT EXISTS (select * from Rols where idRol=@rol)
BEGIN
RAISERROR('No se encontro un rol con este ID',16,2)
RETURN 
END

IF EXISTS (select * from Users where idUser!=@idUser and email=@email)
BEGIN
RAISERROR('Ya existe un usuario registrado con este correo electronico',16,3)
RETURN 
END

UPDATE Users set email=@email,name=@name,lastname=@lastname,@rol=rol where idUser=@idUser;

IF(@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al actualizar usuario',16,4)
RETURN 
END


END
GO


CREATE OR ALTER PROCEDURE UpdateEmailByIdUser @idUser INT,@email VARCHAR(40) AS

BEGIN

IF (PATINDEX('%@[a-zA-Z]%.com%%',@email)=0)
BEGIN
RAISERROR('Formato de correo incorrecto',16,1)
RETURN 
END

IF NOT EXISTS (select * from Users where idUser=@idUser)
BEGIN
RAISERROR('No se encontro un usuario con este ID',16,2)
RETURN 
END

IF EXISTS (select * from Users where idUser!=@idUser and email=@email)
BEGIN
RAISERROR('Ya existe un usuario registrado con este correo electronico',16,3)
RETURN 
END

UPDATE Users set email=@email where idUser=@idUser;

IF(@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al actualizar correo electronico del usuario',16,4)
RETURN 
END


END
GO

CREATE OR ALTER PROCEDURE UpdateUserPasswordByIdUser @idUser INT,@password VARCHAR(60) AS

IF(LEN(@password)=0)
BEGIN
RAISERROR('Contraseña no puede estar vacia',16,1)
RETURN 
END

IF NOT EXISTS (select * from Users where idUser=@idUser)
BEGIN
RAISERROR('No se encontro un usuario con este ID',16,2)
RETURN 
END

Update Users set password=@password where idUser=@idUser

IF(@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al actualizar contraseña del usuario',16,4)
RETURN 
END


GO

CREATE OR ALTER PROCEDURE UpdateCompleteNameByIdUser @idUser INT,@name VARCHAR(20),@lastname VARCHAR(20) AS

IF(@name='' OR LEN(@name)=0)
BEGIN
RAISERROR('Nombre no puede estar vacio',16,1)
RETURN 
END

IF(@lastname='' OR LEN(@lastname)=0)
BEGIN
RAISERROR('Apellido no puede estar vacio',16,1)
RETURN 
END

IF NOT EXISTS (select * from Users where idUser=@idUser)
BEGIN
RAISERROR('No se encontro un usuario con este ID',16,2)
RETURN 
END

Update Users set name=@name,lastname=@lastname where idUser=@idUser

IF(@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al actualizar el usuario',16,4)
RETURN 
END


GO

CREATE OR ALTER PROCEDURE UpdateStateAuth2FA @idUser INT,@state BIT AS

BEGIN

IF NOT EXISTS (select * from Users where idUser=@idUser)
BEGIN
RAISERROR('No se encontro un usuario con este ID',16,2)
RETURN 
END

UPDATE Users set auth2FA=@state where idUser=@idUser;

IF(@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al activar o desactivar la autenticacion en dos pasos',16,4)
RETURN 
END

END
GO

CREATE OR ALTER PROCEDURE ActivateUserByIdUser @idUser INT,@password VARCHAR(60) AS

IF(@password='' OR LEN(@password)=0)
BEGIN
RAISERROR('Contraseña no puede estar vacia',16,1)
RETURN 
END


IF NOT EXISTS (select * from Users where idUser=@idUser)
BEGIN
RAISERROR('No se  encontro un usuario con este ID',16,2)
RETURN 
END

Update Users set password=@password,activated=1 where idUser=@idUser

IF(@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al activar el usuario',16,4)
RETURN 
END

GO


CREATE OR ALTER PROCEDURE DeleteUser @idUser INT AS

BEGIN

DECLARE @rowsAffected INT;

IF NOT EXISTS (select * from Users where idUser=@idUser)
BEGIN
RAISERROR('No se encontro un usuario con este ID',16,1)
RETURN 
END

DELETE FROM Users where idUser=@idUser;
SET @rowsAffected=@@ROWCOUNT;

IF(@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al eliminar usuario',16,4)
RETURN 
END

IF (@rowsAffected=0)
BEGIN
RAISERROR('Este registro ya ha sido eliminado por otro usuario',16,4)
RETURN 
END

END
GO


CREATE OR ALTER PROCEDURE AllUsers AS
BEGIN
SELECT idUser,name,lastname,email,activated,created,lastModified,rol FROM Users;
END
GO

CREATE OR ALTER PROCEDURE UsersOffset @offset INT AS
BEGIN
SELECT U.idUser,U.name,U.lastname,U.email,U.activated,U.created,U.lastModified,U.rol,
R.name as 'nameRole' FROM Users U INNER JOIN Rols R ON U.rol=R.idRol ORDER BY created OFFSET @offset ROWS FETCH NEXT 10 ROWS ONLY;
END
GO

CREATE OR ALTER PROCEDURE UsersByRole @idRol INT AS
BEGIN
SELECT idUser,name,lastname,email,activated,created,lastModified,rol FROM Users where rol=@idRol;
END
GO

CREATE OR ALTER PROCEDURE UsersByRoleOffset @idRol INT,@offset INT AS
BEGIN
SELECT U.idUser,U.name,U.lastname,U.email,U.activated,U.created,U.lastModified,U.rol
,R.name as 'nameRole' FROM Users U INNER JOIN Rols R ON U.rol=R.idRol where U.rol=@idRol 
ORDER BY created OFFSET @offset ROWS FETCH NEXT 10 ROWS ONLY;
END
GO

CREATE OR ALTER PROCEDURE UserById @idUser INT AS
BEGIN
SELECT * FROM Users where idUser=@idUser;
END

GO

CREATE OR ALTER PROCEDURE UserByEmail @email VARCHAR(40) AS
BEGIN
SELECT * FROM Users where email=@email;
END
GO

CREATE OR ALTER PROCEDURE UserActivatedByEmail @email VARCHAR(40) AS
BEGIN
SELECT * FROM Users where email=@email and activated=1;
END
GO

--------------------------------------------------------------------------------------------------------------
--Department PROCEDURES

CREATE OR ALTER PROCEDURE AddDepartment @name VARCHAR(30) AS
BEGIN

IF(@name='' OR LEN(@name)=0)
BEGIN
RAISERROR('Nombre no puede estar vacio',16,1)
RETURN 
END


IF EXISTS (select * from Departments where name=@name)
BEGIN
RAISERROR('Ya existe un registro de un departamento con este nombre',16,3)
RETURN 
END

INSERT INTO Departments(name) VALUES(@name);

IF(@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al agregar departamento',16,4)
RETURN 
END

END
GO

CREATE OR ALTER PROCEDURE UpdateDepartment @idDepartment INT ,@name VARCHAR(30) AS
BEGIN

IF(@name='' OR LEN(@name)=0)
BEGIN
RAISERROR('Nombre no puede estar vacio',16,1)
RETURN 
END

IF NOT EXISTS (select * from Departments where idDepartment=@idDepartment)
BEGIN
RAISERROR('No se encontro un departamento con este ID',16,2)
RETURN 
END


IF EXISTS (select * from Departments where name=@name and idDepartment!=@idDepartment)
BEGIN
RAISERROR('Ya existe un registro de un departamento con este nombre',16,3)
RETURN 
END

UPDATE Departments set name=@name where idDepartment=@idDepartment;

IF(@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al actualizar departamento',16,4)
RETURN 
END

END
GO


CREATE OR ALTER PROCEDURE DeleteDepartment @idDepartment INT AS
BEGIN

DECLARE @rowsAffected INT;

IF NOT EXISTS(select * from Departments where idDepartment=@idDepartment)
BEGIN
RAISERROR('No se encontro un departamento con este ID',16,2)
RETURN 
END

DELETE from Departments where idDepartment=@idDepartment;

SET @rowsAffected=@@ROWCOUNT

IF(@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al eliminar departamento',16,4)
RETURN 
END

IF (@rowsAffected=0)
BEGIN
RAISERROR('Este registro ya ha sido eliminado por otro usuario',16,4)
RETURN 
END

END
GO

CREATE OR ALTER PROCEDURE AllDepartments AS
BEGIN
select * from Departments;
END
GO

CREATE OR ALTER PROCEDURE DepartmentsOffset @offset INT AS
BEGIN
select * from Departments ORDER BY idDepartment OFFSET @offset ROWS FETCH NEXT 10 ROWS ONLY
END
GO

CREATE OR ALTER PROCEDURE DepartmentByName @name VARCHAR(30) AS
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

IF(@category='' OR LEN(@category)=0)
BEGIN
RAISERROR('Nombre de la categoria no puede estar vacio',16,1)
RETURN 
END

IF(@description='' OR LEN(@description)=0)
BEGIN
RAISERROR('Descripcion no puede estar vacia',16,1)
RETURN 
END

IF EXISTS (select * from Crimes where category=@category)
BEGIN
RAISERROR('Ya existe un registro de una categoria de crimen con este nombre',16,3)
RETURN 
END

INSERT INTO Crimes(category,description) VALUES(@category,@description);

IF(@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al agregar categoria de crimen',16,4)
RETURN 
END

END

GO

CREATE OR ALTER PROCEDURE UpdateCrime @category VARCHAR(20),@description VARCHAR(700) AS
BEGIN

IF(@category='' OR LEN(@category)=0)
BEGIN
RAISERROR('Nombre de la categoria no puede estar vacio',16,1)
RETURN 
END

IF(@description='' OR LEN(@description)=0)
BEGIN
RAISERROR('Descripcion no puede estar vacia',16,1)
RETURN 
END

IF NOT EXISTS (select * from Crimes where category=@category)
BEGIN
RAISERROR('No se encontro una categoria de crimen con este nombre',16,2)
RETURN 
END

UPDATE Crimes set description=@description where category=@category;

IF(@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al actualizar categoria de crimen',16,4)
RETURN 
END

END

GO

CREATE OR ALTER PROCEDURE DeleteCrime @category VARCHAR(20) AS
BEGIN

DECLARE @rowsAffected INT;

IF NOT EXISTS(select * from Crimes where category=@category)
BEGIN
RAISERROR('No se encontro una categoria de crimen con este nombre',16,2)
RETURN 
END

DELETE from Crimes where category=@category;
SET @rowsAffected=@@ROWCOUNT

IF(@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al eliminar categoria de crimen',16,4)
RETURN 
END


IF (@rowsAffected=0)
BEGIN
RAISERROR('Este registro ya ha sido eliminado por otro usuario',16,4)
RETURN 
END

END
GO

CREATE OR ALTER PROCEDURE AllCrimes AS
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

IF (@name='' OR LEN(@name)=0)
BEGIN
RAISERROR('Nombre no puede estar vacio',16,1)
RETURN 
END

IF EXISTS (select * from Neighborhoods where name=@name)
BEGIN
RAISERROR('Ya existe un registro de un barrio con este nombre',16,3)
RETURN 
END

IF NOT EXISTS (select * from Departments where idDepartment=@idDepartment)
BEGIN
RAISERROR('No se encontro un departmento con este ID',16,2)
RETURN 
END

INSERT INTO Neighborhoods VALUES(@name,@idDepartment);

IF(@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al agregar barrio',16,4)
RETURN 
END

END

GO

CREATE OR ALTER PROCEDURE UpdateNeighborhood @idNeighborhood INT, @name VARCHAR(30),@idDepartment INT AS
BEGIN

IF (@name='' OR LEN(@name)=0)
BEGIN
RAISERROR('Nombre no puede estar vacio',16,1)
RETURN 
END

IF NOT EXISTS (select * from Neighborhoods where idNeighborhood=@idNeighborhood)
BEGIN
RAISERROR('No se encontro un barrio con este ID',16,2)
RETURN 
END


IF NOT EXISTS (select * from Departments where idDepartment=@idDepartment)
BEGIN
RAISERROR('No se encontro un departamento con este ID',16,2)
RETURN 
END

IF EXISTS (select * from Neighborhoods where idNeighborhood!=@idNeighborhood and name=@name)
BEGIN
RAISERROR('Ya existe un registro de un barrio con este nombre',16,3)
RETURN 
END

UPDATE Neighborhoods set name=@name,department=@idDepartment where idNeighborhood=@idNeighborhood;

IF(@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al actualizar barrio',16,4)
RETURN 
END


END
GO

CREATE OR ALTER PROCEDURE DeleteNeighborhood @idNeighborhood INT AS
BEGIN

DECLARE @rowsAffected INT

IF NOT EXISTS(select * from Neighborhoods where idNeighborhood=@idNeighborhood )
BEGIN
RAISERROR('No se encontro un barrio con este ID',16,2)
RETURN 
END

DELETE from Neighborhoods where idNeighborhood=@idNeighborhood;
SET @rowsAffected=@@ROWCOUNT

IF(@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al eliminar barrio',16,4)
RETURN 
END

IF (@rowsAffected=0)
BEGIN
RAISERROR('Este registro ya ha sido eliminado por otro usuario',16,4)
RETURN 
END

END
GO

CREATE OR ALTER PROCEDURE AllNeighborhoods AS
BEGIN
select * from Neighborhoods;
END
GO

CREATE OR ALTER PROCEDURE AllNeighborhoodsByNameDepartment @name VARCHAR(30) AS
BEGIN
select * from Neighborhoods N  INNER JOIN Departments D ON N.department=D.idDepartment where D.name=@name;
END
GO

CREATE OR ALTER PROCEDURE NeighborhoodsOffset @offset INT AS
BEGIN
select idNeighborhood,N.name as 'nameNeighborhood',D.name as 'nameDepartment', D.idDepartment 
from Neighborhoods N INNER JOIN Departments D ON N.department=D.idDepartment ORDER BY N.idNeighborhood 
OFFSET @offset ROWS FETCH NEXT 10 ROWS ONLY;
END
GO

CREATE OR ALTER PROCEDURE NeighborhoodsByNameDepartmentOffset @name VARCHAR(30),@offset INT AS
BEGIN
select idNeighborhood,N.name as 'nameNeighborhood',D.name as 'nameDepartment', D.idDepartment 
from Neighborhoods N INNER JOIN Departments D ON N.department=D.idDepartment where D.name=@name ORDER BY N.idNeighborhood 
OFFSET @offset ROWS FETCH NEXT 10 ROWS ONLY;
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

DECLARE @idNeighborhood INT;

IF(@quantity<0)
BEGIN
RAISERROR('Cantidad debe ser mayor a cero',16,1)
RETURN 
END

IF(@year>YEAR(GETDATE()))
BEGIN
RAISERROR('Año debe ser mayor al año actual',16,1)
RETURN 
END

IF NOT EXISTS (select * from Neighborhoods where name=@neighbordhood) 
BEGIN
RAISERROR('No se encontro un barrio con este nombre',16,2)
RETURN 
END


SELECT @idNeighborhood=idNeighborhood from Neighborhoods where name=@neighbordhood

IF EXISTS (select * from Population where neighborhood=@idNeighborhood and year=@year) 
BEGIN
RAISERROR('Ya existe un registro de una poblacion en el barrio y año indicado',16,3)
RETURN 
END

INSERT INTO Population VALUES(@idNeighborhood,@quantity,@year);

IF(@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al agregar poblacion',16,4)
RETURN 
END

END

GO


CREATE OR ALTER PROCEDURE UpdatePopulation @idPopulation INT,@quantity INT,@year INT, @neighborhood VARCHAR(30) AS
BEGIN

DECLARE @idNeighborhood INT;

IF(@quantity<0)
BEGIN
RAISERROR('Cantidad debe ser mayor a cero',16,1)
RETURN 
END

IF(@year>YEAR(GETDATE()))
BEGIN
RAISERROR('Año debe ser mayor al año actual',16,1)
RETURN 
END

IF NOT EXISTS (select * from Population where @idPopulation=idPopulation)
BEGIN
RAISERROR('No se encontro una poblacion con este ID',16,2)
RETURN 
END

IF NOT EXISTS (select * from Neighborhoods where name=@neighborhood)
BEGIN
RAISERROR('No se encontro un barrio con este nombre',16,2)
RETURN 
END

SELECT @idNeighborhood=idNeighborhood from Neighborhoods where name=@neighborhood

IF EXISTS (select * from Population where neighborhood=@idNeighborhood and year=@year and idPopulation!=@idPopulation)
BEGIN
RAISERROR('Ya existe un registro de  esta poblacion en este barrio y año',16,3)
RETURN 
END


UPDATE Population set quantity=@quantity,year=@year,neighborhood=@idNeighborhood where @idPopulation=idPopulation;

IF(@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al actualizar poblacion',16,4)
RETURN 
END

END
GO

CREATE OR ALTER PROCEDURE DeletePopulation @idPopulation INT AS
BEGIN

DECLARE @rowsAffected INT

IF NOT EXISTS(select * from Population where @idPopulation=idPopulation )
BEGIN
RAISERROR('No se encontro una poblacion con este ID',16,2)
RETURN 
END

DELETE from Population where idPopulation=@idPopulation;
SET @rowsAffected=@@ROWCOUNT

IF(@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al eliminar poblacion',16,4)
RETURN 
END

IF (@rowsAffected=0)
BEGIN
RAISERROR('Este registro ya ha sido eliminado por otro usuario',16,4)
RETURN 
END

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

CREATE OR ALTER PROCEDURE PopulationsYears AS
BEGIN

select DISTINCT year from Population;
END
GO


CREATE OR ALTER PROCEDURE AllPopulationsByYear @year INT AS
BEGIN

select * from Population where year=@year;
END
GO

CREATE OR ALTER PROCEDURE PopulationsOffsetByYear @offset INT,@year INT AS
BEGIN

select P.* ,name as 'nameNeighborhood' from Population P INNER JOIN Neighborhoods N ON P.neighborhood=N.idNeighborhood 
where P.year=@year ORDER BY P.idPopulation OFFSET @offset ROWS FETCH NEXT 10 ROWS ONLY;
END
GO

CREATE OR ALTER PROCEDURE PopulationsByNameNeighborhood @name VARCHAR(30) AS
BEGIN

select * from Population P INNER JOIN Neighborhoods N ON P.neighborhood=N.idNeighborhood where N.name=@name;

END
GO

CREATE OR ALTER PROCEDURE PopulationsOffsetByNameNeighborhood @name VARCHAR(30),@offset INT AS
BEGIN

select P.* ,name as 'nameNeighborhood' from Population P INNER JOIN Neighborhoods N ON P.neighborhood=N.idNeighborhood 
where N.name=@name ORDER BY P.year OFFSET @offset ROWS FETCH NEXT 10 ROWS ONLY;

END
GO

CREATE OR ALTER PROCEDURE PopulationByNeighborhoodAndYear @idNeighborhood INT,@year INT AS
BEGIN
select * from population where neighborhood=@idNeighborhood and year=@year;
END
GO


------------------------------------------------------------------------------------------------------------------
--NeighborhoodCrimes PROCEDURES

CREATE TYPE NeighborhoodsCrimeTableType AS TABLE(
idNeighborhood INT NOT NULL,
crime VARCHAR(30) NOT NULL,
quantity INT NOT NULL,
year INT NOT NULL
);

GO


CREATE OR ALTER FUNCTION CalculateIncrease (@idNeighborhood INT,@crime VARCHAR(30),@quantity INT,@year INT) 
returns DECIMAL(5,1) AS 
BEGIN 

DECLARE @increase DECIMAL(5,1);
DECLARE @quantityCrimesPrevYear INT;

select @quantityCrimesPrevYear=quantity from Neighborhoods_Crimes where neighborhood=@idNeighborhood and crime=@crime and year=@year-1;

IF(@quantity IS NOT NULL and @quantityCrimesPrevYear IS NOT NULL)
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

RETURN @increase;

END

GO

CREATE OR ALTER FUNCTION CalculateRate(@idNeighborhood INT,@quantity INT,@year INT) RETURNS DECIMAL(6,1) AS 
BEGIN
DECLARE @population INT;
DECLARE @rate DECIMAL(6,1);

select @population=P.quantity from Population P INNER JOIN Neighborhoods N ON P.neighborhood=N.idNeighborhood 
where N.idNeighborhood=@idNeighborhood and (CASE when @year>=year THEN (@year-year)WHEN year>=@year THEN(year-@year)END)=
(select TOP 1 (CASE when @year>=year THEN (@year-year)WHEN year>=@year THEN(year-@year)END) as 'diferencia' from Population P
where P.neighborhood=@idNeighborhood) 

SET @rate=(CAST(@quantity as decimal)/@population)*100000

RETURN @rate

END

GO

CREATE OR ALTER PROCEDURE AddNeighborhoodsCrime @table dbo.NeighborhoodsCrimeTableType READONLY,@categoryCrime VARCHAR(30),@year INT AS

BEGIN

IF EXISTS (select * from @table where quantity<0)
BEGIN
RAISERROR('Cantidad debe ser mayor a cero',16,1)
RETURN 
END

IF EXISTS (select * from @table where @year>YEAR(GETDATE()))
BEGIN
RAISERROR('Año debe ser mayor igual o menor al año actual',16,1)
RETURN 
END


IF EXISTS (select * from @table T LEFT JOIN Neighborhoods N on T.idNeighborhood=N.idNeighborhood where N.idNeighborhood IS NULL)
BEGIN
RAISERROR('No se encontro un barrio con este ID',16,2)
RETURN 
END

IF NOT EXISTS (select * from Crimes where category=@categoryCrime)
BEGIN
RAISERROR('No se encontro una categoria de crimen con este nombre',16,2)
RETURN 
END

IF EXISTS (select * from @table T INNER JOIN Neighborhoods_Crimes NC ON  T.crime=NC.crime and T.year=NC.year and 
NC.neighborhood=T.idNeighborhood)
BEGIN
RAISERROR('Ya existe un registro de este crimen en este barrio y este año',16,3)
RETURN 
END

BEGIN TRANSACTION

INSERT INTO Neighborhoods_Crimes(neighborhood,crime,quantity,increase,rate,year)
select T.idNeighborhood,@categoryCrime,T.quantity,dbo.CalculateIncrease(T.idNeighborhood,@categoryCrime,T.quantity,T.year),
dbo.CalculateRate(T.idNeighborhood,T.quantity,T.year),T.year from @table T

IF(@@ERROR<>0)
BEGIN
ROLLBACK TRANSACTION
RAISERROR('Error inesperado al agregar crimenes en barrios',16,4)
RETURN 
END

COMMIT TRANSACTION

END
GO


CREATE OR ALTER PROCEDURE AddNeighborhoodCrime @neighborhood VARCHAR(30),@categoryCrime VARCHAR(30),@quantity INT ,@year INT AS

BEGIN

DECLARE @idNeighborhood INT;
DECLARE @increase DECIMAL(5,1);
DECLARE @rate DECIMAL(6,1);

IF(@quantity<0)
BEGIN
RAISERROR('Cantidad debe ser mayor a cero',16,1)
RETURN 
END

IF (@year>YEAR(GETDATE()))
BEGIN
RAISERROR('Año debe ser igual o menor al año actual',16,1)
RETURN 
END

IF NOT EXISTS (select * from Neighborhoods where name=@neighborhood )
BEGIN
RAISERROR('No se encontro un barrio con este ID',16,2)
RETURN 
END

IF NOT EXISTS (select * from Crimes where category=@categoryCrime)
BEGIN
RAISERROR('No se encontro una categoria de crimen con este nombre',16,2)
RETURN 
END

select @idNeighborhood=idNeighborhood from Neighborhoods where name=@neighborhood

IF EXISTS (select * from Neighborhoods_Crimes where neighborhood=@idNeighborhood and crime=@categoryCrime and year=@year)
BEGIN
RAISERROR('Ya existe un registro de este crimen en este barrio y este año',16,3)
RETURN 
END


EXEC @increase=dbo.CalculateIncrease @idNeighborhood,@categoryCrime,@quantity,@year;
EXEC @rate=dbo.CalculateRate @idNeighborhood,@quantity,@year;

INSERT INTO Neighborhoods_Crimes(neighborhood,crime,quantity,increase,rate,year) VALUES (@idNeighborhood,@categoryCrime,@quantity,
@increase,@rate,@year)

IF(@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al agregar crimen en barrio',16,4)
RETURN 
END

END
GO

CREATE OR ALTER PROCEDURE UpdateNeighborhoodsCrime @table dbo.NeighborhoodsCrimeTableType READONLY,@categoryCrime VARCHAR(30),@year INT AS

BEGIN

IF EXISTS (select * from @table where quantity<0)
BEGIN
RAISERROR('Cantidad debe ser mayor a cero',16,1)
RETURN 
END

IF EXISTS (select * from @table where @year>YEAR(GETDATE()))
BEGIN
RAISERROR('Año debe ser igual o menor al año actual',16,1)
RETURN 
END

IF EXISTS (select * from @table T LEFT JOIN Neighborhoods N on T.idNeighborhood=N.idNeighborhood where N.idNeighborhood IS NULL)
BEGIN
RAISERROR('No se encontro un barrio con este ID',16,2)
RETURN 
END

IF NOT EXISTS (select * from Crimes where category=@categoryCrime)
BEGIN
RAISERROR('No se encontro una categoria de crimen con este nombre',16,2)
RETURN 
END


IF NOT EXISTS (select * from @table T INNER JOIN Neighborhoods_Crimes NC ON  T.crime=NC.crime and T.year=NC.year and
NC.neighborhood=T.idNeighborhood)
BEGIN
RAISERROR('No se encontro un registro de este crimen en este barrio y este año',16,2)
RETURN 
END

BEGIN TRANSACTION

UPDATE Neighborhoods_Crimes SET quantity=T.quantity,increase=dbo.CalculateIncrease(T.idNeighborhood,T.crime,T.quantity,T.year),
rate=dbo.CalculateRate(T.idNeighborhood,T.quantity,T.year) 
FROM Neighborhoods_Crimes NC INNER JOIN @table T ON T.crime=NC.crime and T.year=NC.year and NC.neighborhood=T.idNeighborhood


IF(@@ERROR<>0)
BEGIN
ROLLBACK TRANSACTION
RAISERROR('Error inesperado al actualizar crimen en barrios',16,4)
RETURN 
END

COMMIT TRANSACTION

END
GO

CREATE OR ALTER PROCEDURE DeleteNeighborhoodCrime @crime VARCHAR(20),@idNeighborhood INT,@year INT AS
BEGIN

DECLARE @rowsAffected INT

IF NOT EXISTS(select * from Neighborhoods_Crimes where crime=@crime and neighborhood=@idNeighborhood and year=@year)
RETURN -1

DELETE from Neighborhoods_Crimes where crime=@crime and neighborhood=@idNeighborhood and @year=year;
SELECT @rowsAffected=@@ROWCOUNT;

IF(@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al eliminar crimen en barrio',16,4)
RETURN 
END


IF (@rowsAffected=0)
BEGIN
RAISERROR('Este registro ya ha sido eliminado por otro usuario',16,4)
RETURN 
END

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

select @populationYear=P.year from Population P INNER JOIN Neighborhoods N ON P.neighborhood=N.idNeighborhood where(CASE when @year>=year THEN (@year-year)WHEN year>=@year 
THEN(year-@year)END)=(select TOP 1 (CASE when @year>=year THEN (@year-year)WHEN year>=@year THEN(year-@year)END) as 'diferencia' from Population)

select N.idNeighborhood,N.name,P.quantity as 'quantityPopulation',P.year as 'yearPopulation',NC.quantity as 'quantityCrime',NC.year as 'yearCrime',
increase,rate from  Neighborhoods_Crimes NC INNER JOIN  Neighborhoods N on N.idNeighborhood=NC.neighborhood INNER JOIN
Population P ON P.neighborhood=N.idNeighborhood where crime=@crime and NC.year=@year and P.year=@populationYear ORDER BY rate desc;

END

GO

CREATE OR ALTER PROCEDURE QuantityCategoryCrimeInNeighborhood @idNeighborhood INT,@crime VARCHAR(20) AS
BEGIN 

select * from Neighborhoods_Crimes where neighborhood=@idNeighborhood and crime=@crime and year<YEAR(GETDATE()) ORDER BY YEAR;
END

GO

CREATE OR ALTER PROCEDURE NeighborhoodsCrimeByYearSecondVersion @crime VARCHAR(20), @year INT AS 

BEGIN 
select * from Neighborhoods_Crimes where crime=@crime and year=@year;
END

GO

CREATE OR ALTER PROCEDURE AmountOfAnCrimeInNeighborhoodByYear @idNeighborhood INT,@crime VARCHAR(20), @year INT AS 

BEGIN 
select quantity from Neighborhoods_Crimes where neighborhood=@idNeighborhood and crime=@crime and year=@year;
END

GO


CREATE OR ALTER PROCEDURE NeighborhoodsCrimeByYearOffset @crime VARCHAR(20), @year INT,@offset INT AS 

BEGIN 
select NC.*,N.name from Neighborhoods_Crimes NC INNER JOIN Neighborhoods N ON NC.neighborhood=N.idNeighborhood where 
crime=@crime and year=@year ORDER BY rate desc OFFSET @offset ROWS FETCH NEXT 10 ROWS ONLY;
END

GO

----------------------------------------------------------------------------------------------------------------
-- Auditory_Neighborhoods_Crimes 

CREATE OR ALTER PROCEDURE DatesOfAuditoryNeighborhoodsCrimes AS
BEGIN

select DISTINCT CAST(auditoryDate AS date) as auditoryDate from Auditory_Neighborhoods_Crimes ORDER BY CAST(auditoryDate AS date);

END
GO

CREATE OR ALTER PROCEDURE AuditoryNeighborhoodsCrimesByDate @datetime DATETIME AS
BEGIN

select * from Auditory_Neighborhoods_Crimes where CAST(auditoryDate  as date)=CAST(@datetime as date);

END

GO

CREATE OR ALTER PROCEDURE AuditoryNeighborhoodsCrimesOffsetByDate @datetime DATETIME ,@offset INT AS
BEGIN

select * from Auditory_Neighborhoods_Crimes where CAST(auditoryDate  as date)=CAST(@datetime as date)
ORDER BY CAST(auditoryDate as date) desc OFFSET @offset ROWS FETCH NEXT 10 ROWS ONLY;

END

GO

----STORED PROCEDURE TO Statistics

CREATE OR ALTER FUNCTION CalculateAmountIncrease(@crime VARCHAR(20),@year INT,@amount INT) RETURNS DECIMAL(6,1) AS
BEGIN

DECLARE @increase DECIMAL(6,1);
DECLARE @amountCrimesPrevYear INT;

select @amountCrimesPrevYear=SUM(quantity) from Neighborhoods_Crimes where crime=@crime and year=@year-1;

IF(@amount IS NOT NULL and @amountCrimesPrevYear IS NOT NULL)
BEGIN
SET @increase=(
CASE 
WHEN (@amount-@amountCrimesPrevYear)=0 THEN 0
WHEN @amount=0 and @amount>@amountCrimesPrevYear THEN 100
WHEN @amount=0 and @amountCrimesPrevYear>@amount THEN -100
ELSE 
((@amount-@amountCrimesPrevYear)/CAST(@amountCrimesPrevYear as decimal(6,1)))*100

END
)
END

RETURN @increase;

END
GO

CREATE OR ALTER PROCEDURE IncreaseOfOneCrimeInYears @crime VARCHAR(20) AS 

BEGIN 

select year,SUM(quantity) as 'amount',dbo.CalculateAmountIncrease(@crime,year,SUM(quantity)) as 'increase' 
from Neighborhoods_Crimes where crime=@crime and year<YEAR(GETDATE()) GROUP BY year ORDER BY year ASC; 

END

GO

CREATE OR ALTER PROCEDURE IncreaseOfOneCrimeOfInNeighborhood @crime VARCHAR(20),@idNeighborhood INT AS 

BEGIN 
select NC.year, N.name as 'nameNeighborhood',NC.quantity as 'amount',increase from Neighborhoods_Crimes NC 
INNER JOIN Neighborhoods N ON NC.neighborhood=N.idNeighborhood where NC.crime=@crime and NC.neighborhood=@idNeighborhood and 
year<YEAR(GETDATE()) ORDER BY year ASC;
END

GO


CREATE OR ALTER FUNCTION CalculatePercentege(@amount INT,@amountCrimes INT) RETURNS DECIMAL(3,1)
BEGIN
DECLARE @percentege DECIMAL(6,1);

SET @percentege=(SUM(@amount)*100)/CAST(@amountCrimes AS DECIMAL(6,1))

RETURN @percentege
END

GO

CREATE OR ALTER PROCEDURE AmountOfDifferentsCrimesInNeighborhoodInYear @idNeighborhood INT,@year INT AS 
BEGIN 

DECLARE @amountCrimes INT;
DECLARE @percentege DECIMAL;

select @amountCrimes=SUM(quantity) from Neighborhoods_Crimes where neighborhood=@idNeighborhood and year=@year;

select crime,SUM(quantity) as 'amount', dbo.CalculatePercentege(SUM(quantity),@amountCrimes) as 'percentege' from Neighborhoods_Crimes
where neighborhood=@idNeighborhood and year=@year GROUP BY crime;
END

GO

CREATE OR ALTER PROCEDURE AllYearsOfCrimes AS 
BEGIN 

select DISTINCT year from Neighborhoods_Crimes ORDER BY year DESC;  
END

GO

CREATE OR ALTER PROCEDURE AmountOfAnCrimeInNeighborhoodsByYear @crime VARCHAR(20),@year INT,@offset INT AS 

BEGIN 
select N.name,NC.quantity as 'amount',year from Neighborhoods_Crimes NC INNER JOIN Neighborhoods N ON NC.neighborhood=N.idNeighborhood 
where NC.crime=@crime and NC.year=@year ORDER BY NC.quantity DESC OFFSET @offset ROWS FETCH NEXT 15 ROWS ONLY;

END
GO
------------------------------------------------------------------------------------------------------------------
--Zones PROCEDURES

CREATE OR ALTER PROCEDURE AddZone @description VARCHAR(250),@coordinates NVARCHAR(MAX),@enable bit AS
BEGIN 

IF(@enable!=0 or @enable!=1)
BEGIN
RAISERROR('Habilitado debe ser cero o 1',16,1)
RETURN 
END

IF (@description='' OR LEN(@description)=0)
BEGIN
RAISERROR('Descripcion no puede estar vacia',16,1)
RETURN 
END

INSERT INTO Zones(description,coordinates,enable) VALUES(@description,@coordinates,@enable);
IF(@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al agregar zona',16,4)
RETURN 
END

RETURN SCOPE_IDENTITY(); 

END

GO

CREATE OR ALTER PROCEDURE DeleteZone @idZone INT AS
BEGIN 

IF NOT EXISTS(select * from Zones where idZone=@idZone)
RETURN -1

DELETE FROM Zones where idZone=@idZone

IF(@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al eliminar zona',16,4)
RETURN 
END

IF (@@ROWCOUNT=0)
BEGIN
RAISERROR('Este registro ya ha sido eliminado por otro usuario',16,4)
RETURN 
END

RETURN 1
END

GO

CREATE OR ALTER PROCEDURE UpdateZone @idZone INT,@description VARCHAR(250),@coordinates NVARCHAR(MAX),@enable bit AS
BEGIN 

IF(@enable!=0 or @enable!=1)
BEGIN
RAISERROR('Habilitado debe ser cero o 1',16,1)
RETURN 
END

IF (@description='' OR LEN(@description)=0)
BEGIN
RAISERROR('Descripcion no puede estar vacia',16,1)
RETURN 
END


IF NOT EXISTS(select * from Zones where idZone=@idZone)
BEGIN
RAISERROR('No se encontro una zona con este ID',16,2)
RETURN 
END

Update Zones set description=@description,coordinates=@coordinates,enable=@enable where idZone=@idZone

IF(@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al actualizar zona',16,4)
RETURN 
END

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

CREATE OR ALTER PROCEDURE AddZoneNeighborhood @idZone INT,@idNeighborhood INT AS
BEGIN 

IF NOT EXISTS(select * from Neighborhoods where idNeighborhood=@idNeighborhood)
RETURN -1

IF NOT EXISTS(select * from Zones where idZone=@idZone)
RETURN -2

IF EXISTS(select * from Zones_Neighborhoods where zone=@idZone and neighborhood=@idNeighborhood)
RETURN -3

INSERT INTO Zones_Neighborhoods VALUES (@idZone,@idNeighborhood);

IF(@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al agregar zona de barrio',16,4)
RETURN 
END

END

GO

CREATE OR ALTER PROCEDURE DeleteZoneNeighborhood @idZone INT,@idNeighborhood INT AS
BEGIN 

IF NOT EXISTS(select * from Zones_Neighborhoods where zone=@idZone and neighborhood=@idNeighborhood)
BEGIN
RAISERROR('No se encontro una zona de barrio con este ID',16,2)
RETURN 
END

DELETE FROM Zones_Neighborhoods where zone=@idZone and neighborhood=@idNeighborhood;

IF(@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al eliminar zona de barrio',16,4)
RETURN 
END

IF (@@ROWCOUNT=0)
BEGIN
RAISERROR('Este registro ya ha sido eliminado por otro usuario',16,4)
RETURN 
END

END

GO

CREATE OR ALTER PROCEDURE ZonesByNeighborhood @idNeighborhood INT AS
BEGIN 

select * from Zones_Neighborhoods ZN INNER JOIN Zones Z ON ZN.zone=Z.idZone where neighborhood=@idNeighborhood;
END

GO

CREATE OR ALTER PROCEDURE NeighborhoodInZone @idZone INT AS
BEGIN 

select * from Zones_Neighborhoods ZN INNER JOIN Neighborhoods N ON ZN.neighborhood=N.idNeighborhood where zone=@idZone;
END

GO

------------------------------------------------------------------------------------------------------------------
--VerificationsCodes PROCEDURES

CREATE OR ALTER PROCEDURE AddVerificationCode @code VARCHAR(60),@idUser INT,@expiration DATETIME AS

BEGIN

IF @expiration<GETDATE()
BEGIN
RAISERROR('Fecha de expiracion debe ser mayor a la fecha actual',16,1)
RETURN 
END

IF NOT EXISTS (select * from Users where idUser=@idUser)
BEGIN
RAISERROR('No se encontro un usuario con este ID',16,2)
RETURN 
END

IF EXISTS (select * from Verifications_Codes where code=@code)
BEGIN
RAISERROR('Codigo de verificacion ya existente',16,3)
RETURN 
END


INSERT INTO Verifications_Codes(code,expiration,idUser) VALUES(@code,@expiration,@idUser)

IF(@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al agregar codigo de verificacion',16,4)
RETURN 
END

END
GO

CREATE OR ALTER PROCEDURE UpdateVerificationCodeLikeUsed @code VARCHAR(60) AS
BEGIN

IF NOT EXISTS (select * from Verifications_Codes where code=@code)
BEGIN
RAISERROR('No se encontro el codigo de verificacion',16,2)
RETURN 
END

UPDATE Verifications_Codes set used=1 where code=@code;

IF(@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al actualizar codigo de verificacion',16,4)
RETURN 
END

END
GO

CREATE OR ALTER PROCEDURE VerificationCodeMostRecentlyByIdUser @idUser INT AS
BEGIN 

select TOP 1 *  from Verifications_Codes where idUser=@idUser ORDER BY expiration DESC;
END

GO

------------------------------------------------------------------------------------------------------------------
---TRIGGERS---

CREATE OR ALTER TRIGGER UpdateLastModifiedUsers ON Users AFTER Update
AS
BEGIN
DECLARE @idUser INT;
select @idUser=idUser from inserted;

Update users set lastModified=GETDATE() where idUser=@idUser;
END
GO

CREATE OR ALTER TRIGGER UpdateLastModifiedRols ON Rols AFTER Update
AS
BEGIN

DECLARE @idRol INT;
select @idRol=idRol from inserted;

Update rols set lastModified=GETDATE() where idRol=@idRol;
END

GO

CREATE OR ALTER TRIGGER UpdateLastModifiedCrimes ON Crimes AFTER Update
AS
BEGIN

DECLARE @category VARCHAR(20);
select @category=category from inserted;

Update crimes set lastModified=GETDATE() where category=@category;
END

GO

CREATE OR ALTER TRIGGER UpdateLastModifiedZones ON Zones AFTER Update
AS
BEGIN

DECLARE @idZone INT;
select @idZone=idZone from inserted;

Update Zones set lastModified=GETDATE() where idZone=@idZone;
END

GO

------------------------------------------------------------------------------------------------------------------
--Neighborhoods_Crimes TRIGGERS

CREATE OR ALTER TRIGGER AddHoodCrimeAuditoryAfterInsert ON Neighborhoods_Crimes AFTER INSERT AS
BEGIN

INSERT INTO Auditory_Neighborhoods_Crimes(neighborhood,crime,year,actionName,newValues) 
(select neighborhood,crime,year,'INSERT',
('Cantidad:'+CAST(quantity as varchar(6))+' - Tasa:'+CAST(rate as varchar(6))+' - Crecimiento:'+CAST(increase as varchar(6))) from inserted)

END

GO

CREATE OR ALTER TRIGGER AddHoodCrimeAuditoryAfterUpdate ON Neighborhoods_Crimes AFTER UPDATE AS
BEGIN

INSERT INTO Auditory_Neighborhoods_Crimes (neighborhood,crime,year,auditoryDate,actionName,oldValues,newValues) 
(select D.neighborhood,D.crime,D.year,GETDATE(),'UPDATE',
('Cantidad:'+CAST(D.quantity as varchar(6))+' - Tasa:'+CAST(D.rate as varchar(6))+' - Crecimiento:'+CAST(D.increase as varchar(6))),
('Cantidad:'+CAST(I.quantity as varchar(6))+' - Tasa:'+CAST(I.rate as varchar(6))+' - Crecimiento:'+CAST(I.increase as varchar(6)))
from inserted I INNER JOIN deleted D ON D.neighborhood=I.neighborhood and D.crime=I.crime and D.year=I.year)

END

GO

CREATE OR ALTER TRIGGER AddHoodCrimeAuditoryAfterDelete ON Neighborhoods_Crimes AFTER DELETE AS
BEGIN

INSERT INTO Auditory_Neighborhoods_Crimes (neighborhood,crime,year,auditoryDate,actionName,oldValues) 
(select neighborhood,crime,year,GETDATE(),'DELETE',
('Cantidad:'+CAST(quantity as varchar(6))+' - Tasa:'+CAST(rate as varchar(6))+' - Crecimiento:'+CAST(increase as varchar(6))) from deleted)

END

------------------------------------------------------------------------------------------------------------------
--Users INDEXES

CREATE NONCLUSTERED INDEX IX_UserByEmailAndState ON Users(email,activated) 

GO
------------------------------------------------------------------------------------------------------------------
--Neighborhoods INDEXES

CREATE NONCLUSTERED INDEX IX_NeighborhoodByName ON Neighborhoods(name) 

GO
--------------------------------------------------------------------------------------------------------------
--Neighborhoods_Crimes INDEXES

CREATE NONCLUSTERED INDEX IX_CrimeInNeighborhood ON Neighborhoods_Crimes(crime,neighborhood) 

GO
--------------------------------------------------------------------------------------------------------------
--Populations INDEXES
CREATE NONCLUSTERED INDEX IX_PopulationByNeighborhoodAndYear ON Population(neighborhood,year)

CREATE NONCLUSTERED INDEX IX_PopulationsByNeighborhood ON Population(neighborhood)

GO
