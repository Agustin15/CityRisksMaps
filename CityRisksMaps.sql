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
RAISERROR('Año debe ser mayor al año actual',16,1)
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
RAISERROR('Año debe ser mayor al año actual',16,1)
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
RAISERROR('Año debe ser mayor al año actual',16,1)
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

UPDATE Neighborhoods_Crimes SET quantity=T.quantity FROM Neighborhoods_Crimes NC 
INNER JOIN @table T ON T.crime=NC.crime and T.year=NC.year and NC.neighborhood=T.idNeighborhood


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

select * from Neighborhoods_Crimes where neighborhood=@idNeighborhood and crime=@crime ORDER BY YEAR;
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


CREATE OR ALTER  PROCEDURE NeighborhoodsCrimeByYearOffset @crime VARCHAR(20), @year INT,@offset INT AS 

BEGIN 
select NC.*,N.name from Neighborhoods_Crimes NC INNER JOIN Neighborhoods N ON NC.neighborhood=N.idNeighborhood where 
crime=@crime and year=@year ORDER BY rate desc OFFSET @offset ROWS FETCH NEXT 10 ROWS ONLY;
END

GO

----STORED PROCEDURE TO Statistics

CREATE OR ALTER PROCEDURE IncreaseOfOneCrimeInYears @crime VARCHAR(20) AS 

BEGIN 
select year,SUM(quantity) as 'amount',SUM(increase) as 'increase' from Neighborhoods_Crimes where crime=@crime GROUP BY year ORDER BY year ASC; 
END

GO

CREATE OR ALTER PROCEDURE IncreaseOfOneCrimeOfInNeighborhood @crime VARCHAR(20),@idNeighborhood INT AS 

BEGIN 
select NC.year, N.name as 'nameNeighborhood',NC.quantity as 'amount',increase from Neighborhoods_Crimes NC 
INNER JOIN Neighborhoods N ON NC.neighborhood=N.idNeighborhood where NC.crime=@crime and NC.neighborhood=@idNeighborhood ORDER BY year ASC;
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
select N.name,NC.quantity as 'amount' from Neighborhoods_Crimes NC INNER JOIN Neighborhoods N ON NC.neighborhood=N.idNeighborhood 
where NC.crime=@crime and NC.year=@year ORDER BY 'amount' DESC OFFSET @offset ROWS FETCH NEXT 15 ROWS ONLY;
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


INSERT INTO Verifications_Codes VALUES(@code,@expiration,@idUser)

IF(@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al agregar codigo de verificacion',16,4)
RETURN 
END

END
GO

CREATE OR ALTER PROCEDURE VerificationCodeMostRecentlyByIdUser @idUser INT AS
BEGIN 

select TOP 1 *  from Verifications_Codes where idUser=@idUser;
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
--------------------------------------------------------------------------------------------------------------


EXEC AddRol 'Admin';

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

GO

EXEC AddCrime 'Homicidio','Por homicidio se entiende la muerte infligida a una persona en forma intencional e ilegal por otra u otras. Se excluyen las muertes causadas por negligencia, suicidio o accidente, así como los decesos que son fruto de actos de funcionarios policiales en cumplimiento de la ley o de acciones realizadas por civiles en legítima defensa.';

EXEC AddCrime 'Hurto','Se entiende por hurto cualquier acto que implique sustraer, tomar o apartar ilegalmente cualquier propiedad o bien mueble de la posesión, control o custodia legítimos de cualquier persona. Incluye delitos como el hurto de vehículos de motor, hurto de piezas de vehículos, hurto de efectos depositados en el interior de viviendas y vehículos, hurto de artículos comerciales del interior de tiendas, el arrebato de carteras o teléfonos celulares, hurto de bicicletas, siempre que no impliquen violencia, amenaza de violencia o fraude.';

EXEC AddCrime 'Rapiña','Se clasifican como rapiñas todos los incidentes en que se sustrajo o intentó sustraer, por medio de la fuerza o amenaza de uso de la fuerza, cualquier objeto o propiedad al cuidado o bajo la custodia de otra u otras personas.';

GO

---------------------------------Homicidios -------------------------------------------------------
EXEC AddNeighborhoodCrime 'Aguada','Homicidio',1,2022;
EXEC AddNeighborhoodCrime 'Aires Puros','Homicidio',3,2022;
EXEC AddNeighborhoodCrime 'Atahualpa','Homicidio',0,2022;
EXEC AddNeighborhoodCrime 'Bañados de Carrasco','Homicidio',3,2022;
EXEC AddNeighborhoodCrime 'Barrio Sur','Homicidio',1,2022;
EXEC AddNeighborhoodCrime 'Belvedere','Homicidio',6,2022;
EXEC AddNeighborhoodCrime 'Brazo Oriental','Homicidio',0,2022;
EXEC AddNeighborhoodCrime 'Buceo','Homicidio',2,2022;
EXEC AddNeighborhoodCrime 'Capurro, Bella Vista','Homicidio',0,2022;
EXEC AddNeighborhoodCrime 'Carrasco','Homicidio',0,2022;
EXEC AddNeighborhoodCrime 'Carrasco Norte','Homicidio',2,2022;
EXEC AddNeighborhoodCrime 'Casabó, Pajas Blancas','Homicidio',11,2022;
EXEC AddNeighborhoodCrime 'Casavalle','Homicidio',13,2022;
EXEC AddNeighborhoodCrime 'Castro, P. Castellanos','Homicidio',1,2022;
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

EXEC AddNeighborhoodCrime 'Aguada','Homicidio',1,2023;
EXEC AddNeighborhoodCrime 'Aires Puros','Homicidio',3,2023;
EXEC AddNeighborhoodCrime 'Atahualpa','Homicidio',0,2023;
EXEC AddNeighborhoodCrime 'Bañados de Carrasco','Homicidio',1,2023;
EXEC AddNeighborhoodCrime 'Barrio Sur','Homicidio',0,2023;
EXEC AddNeighborhoodCrime 'Belvedere','Homicidio',4,2023;
EXEC AddNeighborhoodCrime 'Brazo Oriental','Homicidio',2,2023;
EXEC AddNeighborhoodCrime 'Buceo','Homicidio',0,2023;
EXEC AddNeighborhoodCrime 'Capurro, Bella Vista','Homicidio',0,2023;
EXEC AddNeighborhoodCrime 'Carrasco','Homicidio',0,2023;
EXEC AddNeighborhoodCrime 'Carrasco Norte','Homicidio',1,2023;
EXEC AddNeighborhoodCrime 'Casabó, Pajas Blancas','Homicidio',11,2023;
EXEC AddNeighborhoodCrime 'Casavalle','Homicidio',13,2023;
EXEC AddNeighborhoodCrime 'Castro, P. Castellanos','Homicidio',3,2023;
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

GO

EXEC AddNeighborhoodCrime 'Aguada','Homicidio',0,2024;
EXEC AddNeighborhoodCrime 'Aires Puros','Homicidio',1,2024;
EXEC AddNeighborhoodCrime 'Atahualpa','Homicidio',0,2024;
EXEC AddNeighborhoodCrime 'Bañados de Carrasco','Homicidio',7,2024;
EXEC AddNeighborhoodCrime 'Barrio Sur','Homicidio',1,2024;
EXEC AddNeighborhoodCrime 'Belvedere','Homicidio',1,2024;
EXEC AddNeighborhoodCrime 'Brazo Oriental','Homicidio',0,2024;
EXEC AddNeighborhoodCrime 'Buceo','Homicidio',4,2024;
EXEC AddNeighborhoodCrime 'Capurro, Bella Vista','Homicidio',3,2024;
EXEC AddNeighborhoodCrime 'Carrasco','Homicidio',0,2024;
EXEC AddNeighborhoodCrime 'Carrasco Norte','Homicidio',0,2024;
EXEC AddNeighborhoodCrime 'Casabó, Pajas Blancas','Homicidio',12,2024;
EXEC AddNeighborhoodCrime 'Casavalle','Homicidio',22,2024;
EXEC AddNeighborhoodCrime 'Castro, P. Castellanos','Homicidio',1,2024;
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


---------------------------------Hurtos -------------------------------------------------------

EXEC AddNeighborhoodCrime 'Aguada','Hurto',1121,2022;
EXEC AddNeighborhoodCrime 'Aires Puros','Hurto',406,2022;
EXEC AddNeighborhoodCrime 'Atahualpa','Hurto',363,2022;
EXEC AddNeighborhoodCrime 'Bañados de Carrasco','Hurto',386,2022;
EXEC AddNeighborhoodCrime 'Barrio Sur','Hurto',562,2022;
EXEC AddNeighborhoodCrime 'Belvedere','Hurto',1154,2022;
EXEC AddNeighborhoodCrime 'Brazo Oriental','Hurto',733,2022;
EXEC AddNeighborhoodCrime 'Buceo','Hurto',1558,2022;
EXEC AddNeighborhoodCrime 'Capurro, Bella Vista','Hurto',667,2022;
EXEC AddNeighborhoodCrime 'Carrasco','Hurto',423,2022;
EXEC AddNeighborhoodCrime 'Carrasco Norte','Hurto',479,2022;
EXEC AddNeighborhoodCrime 'Casabó, Pajas Blancas','Hurto',576,2022;
EXEC AddNeighborhoodCrime 'Casavalle','Hurto',1068,2022;
EXEC AddNeighborhoodCrime 'Castro, P. Castellanos','Hurto',454,2022;
EXEC AddNeighborhoodCrime 'Centro','Hurto',2404,2022;
EXEC AddNeighborhoodCrime 'Cerro','Hurto',1047,2022;
EXEC AddNeighborhoodCrime 'Cerrito','Hurto',667,2022;
EXEC AddNeighborhoodCrime 'Ciudad Vieja','Hurto',1174,2022;
EXEC AddNeighborhoodCrime 'Colón Centro y Noroeste','Hurto',1160,2022;
EXEC AddNeighborhoodCrime 'Colón Sureste, Abayubá','Hurto',341,2022;
EXEC AddNeighborhoodCrime 'Conciliación','Hurto',599,2022;
EXEC AddNeighborhoodCrime 'Cordón','Hurto',2677,2022;
EXEC AddNeighborhoodCrime 'Flor de Maroñas','Hurto',1290,2022;
EXEC AddNeighborhoodCrime 'Ituzaingó','Hurto',789,2022;
EXEC AddNeighborhoodCrime 'Jacinto Vera','Hurto',383,2022;
EXEC AddNeighborhoodCrime 'Jardines del Hipódromo','Hurto',692,2022;
EXEC AddNeighborhoodCrime 'La Blanqueada','Hurto',656,2022;
EXEC AddNeighborhoodCrime 'La Comercial','Hurto',466,2022;
EXEC AddNeighborhoodCrime 'Las Canteras','Hurto',1088,2022;
EXEC AddNeighborhoodCrime 'La Figurita','Hurto',423,2022;
EXEC AddNeighborhoodCrime 'Larrañaga','Hurto',964,2022;
EXEC AddNeighborhoodCrime 'La Paloma, Tomkinson','Hurto',838,2022;
EXEC AddNeighborhoodCrime 'Las Acacias','Hurto',737,2022;
EXEC AddNeighborhoodCrime 'La Teja','Hurto',974,2022;
EXEC AddNeighborhoodCrime 'Lezica, Melilla','Hurto',589,2022;
EXEC AddNeighborhoodCrime 'Malvín','Hurto',1155,2022;
EXEC AddNeighborhoodCrime 'Malvín Norte','Hurto',595,2022;
EXEC AddNeighborhoodCrime 'Manga','Hurto',557,2022;
EXEC AddNeighborhoodCrime 'Manga, Toledo Chico','Hurto',583,2022;
EXEC AddNeighborhoodCrime 'Maroñas, Parque Guaraní','Hurto',1160,2022;
EXEC AddNeighborhoodCrime 'Mercado Modelo, Bolívar','Hurto',1058,2022;
EXEC AddNeighborhoodCrime 'Nuevo París','Hurto',1216,2022;
EXEC AddNeighborhoodCrime 'Palermo','Hurto',359,2022;
EXEC AddNeighborhoodCrime 'Pque. Batlle, V. Dolores','Hurto',1814,2022;
EXEC AddNeighborhoodCrime 'Parque Rodó','Hurto',661,2022;
EXEC AddNeighborhoodCrime 'Paso de la Arena','Hurto',926,2022;
EXEC AddNeighborhoodCrime 'Paso de las Duranas','Hurto',435,2022;
EXEC AddNeighborhoodCrime 'Peñarol, Lavalleja','Hurto',725,2022;
EXEC AddNeighborhoodCrime 'Piedras Blancas','Hurto',781,2022;
EXEC AddNeighborhoodCrime 'Pocitos','Hurto',1845,2022;
EXEC AddNeighborhoodCrime 'Prado, Nueva Savona','Hurto',1376,2022;
EXEC AddNeighborhoodCrime 'Punta Carretas','Hurto',1096,2022;
EXEC AddNeighborhoodCrime 'Punta Gorda','Hurto',365,2022;
EXEC AddNeighborhoodCrime 'Pta. Rieles, Bella Italia','Hurto',642,2022;
EXEC AddNeighborhoodCrime 'Reducto','Hurto',483,2022;
EXEC AddNeighborhoodCrime 'Sayago','Hurto',491,2022;
EXEC AddNeighborhoodCrime 'Tres Cruces','Hurto',1502,2022;
EXEC AddNeighborhoodCrime 'Tres Ombúes, Victoria','Hurto',716,2022;
EXEC AddNeighborhoodCrime 'Unión','Hurto',3126,2022;
EXEC AddNeighborhoodCrime 'Villa Española','Hurto',989,2022;
EXEC AddNeighborhoodCrime 'Villa García, Manga Rural','Hurto',671,2022;
EXEC AddNeighborhoodCrime 'Villa Muñoz, Retiro','Hurto',614,2022;


EXEC AddNeighborhoodCrime 'Aguada','Hurto',1108,2023;
EXEC AddNeighborhoodCrime 'Aires Puros','Hurto',519,2023;
EXEC AddNeighborhoodCrime 'Atahualpa','Hurto',344,2023;
EXEC AddNeighborhoodCrime 'Bañados de Carrasco','Hurto',417,2023;
EXEC AddNeighborhoodCrime 'Barrio Sur','Hurto',459,2023;
EXEC AddNeighborhoodCrime 'Belvedere','Hurto',866,2023;
EXEC AddNeighborhoodCrime 'Brazo Oriental','Hurto',721,2023;
EXEC AddNeighborhoodCrime 'Buceo','Hurto',1760,2023;
EXEC AddNeighborhoodCrime 'Capurro, Bella Vista','Hurto',570,2023;
EXEC AddNeighborhoodCrime 'Carrasco','Hurto',493,2023;
EXEC AddNeighborhoodCrime 'Carrasco Norte','Hurto',435,2023;
EXEC AddNeighborhoodCrime 'Casabó, Pajas Blancas','Hurto',484,2023;
EXEC AddNeighborhoodCrime 'Casavalle','Hurto',768,2023;
EXEC AddNeighborhoodCrime 'Castro, P. Castellanos','Hurto',421,2023;
EXEC AddNeighborhoodCrime 'Centro','Hurto',2446,2023;
EXEC AddNeighborhoodCrime 'Cerro','Hurto',888,2023;
EXEC AddNeighborhoodCrime 'Cerrito','Hurto',566,2023;
EXEC AddNeighborhoodCrime 'Ciudad Vieja','Hurto',1137,2023;
EXEC AddNeighborhoodCrime 'Colón Centro y Noroeste','Hurto',1112,2023;
EXEC AddNeighborhoodCrime 'Colón Sureste, Abayubá','Hurto',332,2023;
EXEC AddNeighborhoodCrime 'Conciliación','Hurto',550,2023;
EXEC AddNeighborhoodCrime 'Cordón','Hurto',3037,2023;
EXEC AddNeighborhoodCrime 'Flor de Maroñas','Hurto',908,2023;
EXEC AddNeighborhoodCrime 'Ituzaingó','Hurto',842,2023;
EXEC AddNeighborhoodCrime 'Jacinto Vera','Hurto',376,2023;
EXEC AddNeighborhoodCrime 'Jardines del Hipódromo','Hurto',545,2023;
EXEC AddNeighborhoodCrime 'La Blanqueada','Hurto',784,2023;
EXEC AddNeighborhoodCrime 'La Comercial','Hurto',540,2023;
EXEC AddNeighborhoodCrime 'Las Canteras','Hurto',577,2023;
EXEC AddNeighborhoodCrime 'La Figurita','Hurto',326,2023;
EXEC AddNeighborhoodCrime 'Larrañaga','Hurto',1001,2023;
EXEC AddNeighborhoodCrime 'La Paloma, Tomkinson','Hurto',674,2023;
EXEC AddNeighborhoodCrime 'Las Acacias','Hurto',578,2023;
EXEC AddNeighborhoodCrime 'La Teja','Hurto',690,2023;
EXEC AddNeighborhoodCrime 'Lezica, Melilla','Hurto',844,2023;
EXEC AddNeighborhoodCrime 'Malvín','Hurto',1050,2023;
EXEC AddNeighborhoodCrime 'Malvín Norte','Hurto',556,2023;
EXEC AddNeighborhoodCrime 'Manga','Hurto',422,2023;
EXEC AddNeighborhoodCrime 'Manga, Toledo Chico','Hurto',504,2023;
EXEC AddNeighborhoodCrime 'Maroñas, Parque Guaraní','Hurto',804,2023;
EXEC AddNeighborhoodCrime 'Mercado Modelo, Bolívar','Hurto',966,2023;
EXEC AddNeighborhoodCrime 'Nuevo París','Hurto',974,2023;
EXEC AddNeighborhoodCrime 'Palermo','Hurto',316,2023;
EXEC AddNeighborhoodCrime 'Pque. Batlle, V. Dolores','Hurto',1878,2023;
EXEC AddNeighborhoodCrime 'Parque Rodó','Hurto',565,2023;
EXEC AddNeighborhoodCrime 'Paso de la Arena','Hurto',778,2023;
EXEC AddNeighborhoodCrime 'Paso de las Duranas','Hurto',477,2023;
EXEC AddNeighborhoodCrime 'Peñarol, Lavalleja','Hurto',876,2023;
EXEC AddNeighborhoodCrime 'Piedras Blancas','Hurto',739,2023;
EXEC AddNeighborhoodCrime 'Pocitos','Hurto',1913,2023;
EXEC AddNeighborhoodCrime 'Prado, Nueva Savona','Hurto',1325,2023;
EXEC AddNeighborhoodCrime 'Punta Carretas','Hurto',1080,2023;
EXEC AddNeighborhoodCrime 'Punta Gorda','Hurto',373,2023;
EXEC AddNeighborhoodCrime 'Pta. Rieles, Bella Italia','Hurto',848,2023;
EXEC AddNeighborhoodCrime 'Reducto','Hurto',408,2023;
EXEC AddNeighborhoodCrime 'Sayago','Hurto',577,2023;
EXEC AddNeighborhoodCrime 'Tres Cruces','Hurto',1717,2023;
EXEC AddNeighborhoodCrime 'Tres Ombúes, Victoria','Hurto',475,2023;
EXEC AddNeighborhoodCrime 'Unión','Hurto',3351,2023;
EXEC AddNeighborhoodCrime 'Villa Española','Hurto',740,2023;
EXEC AddNeighborhoodCrime 'Villa García, Manga Rural','Hurto',638,2023;
EXEC AddNeighborhoodCrime 'Villa Muñoz, Retiro','Hurto',511,2023;


EXEC AddNeighborhoodCrime 'Aguada','Hurto',1092,2024;
EXEC AddNeighborhoodCrime 'Aires Puros','Hurto',470,2024;
EXEC AddNeighborhoodCrime 'Atahualpa','Hurto',356,2024;
EXEC AddNeighborhoodCrime 'Bañados de Carrasco','Hurto',390,2024;
EXEC AddNeighborhoodCrime 'Barrio Sur','Hurto',456,2024;
EXEC AddNeighborhoodCrime 'Belvedere','Hurto',971,2024;
EXEC AddNeighborhoodCrime 'Brazo Oriental','Hurto',729,2024;
EXEC AddNeighborhoodCrime 'Buceo','Hurto',2143,2024;
EXEC AddNeighborhoodCrime 'Capurro, Bella Vista','Hurto',581,2024;
EXEC AddNeighborhoodCrime 'Carrasco','Hurto',580,2024;
EXEC AddNeighborhoodCrime 'Carrasco Norte','Hurto',521,2024;
EXEC AddNeighborhoodCrime 'Casabó, Pajas Blancas','Hurto',509,2024;
EXEC AddNeighborhoodCrime 'Casavalle','Hurto',725,2024;
EXEC AddNeighborhoodCrime 'Castro, P. Castellanos','Hurto',368,2024;
EXEC AddNeighborhoodCrime 'Centro','Hurto',2315,2024;
EXEC AddNeighborhoodCrime 'Cerro','Hurto',845,2024;
EXEC AddNeighborhoodCrime 'Cerrito','Hurto',607,2024;
EXEC AddNeighborhoodCrime 'Ciudad Vieja','Hurto',952,2024;
EXEC AddNeighborhoodCrime 'Colón Centro y Noroeste','Hurto',1256,2024;
EXEC AddNeighborhoodCrime 'Colón Sureste, Abayubá','Hurto',313,2024;
EXEC AddNeighborhoodCrime 'Conciliación','Hurto',442,2024;
EXEC AddNeighborhoodCrime 'Cordón','Hurto',2754,2024;
EXEC AddNeighborhoodCrime 'Flor de Maroñas','Hurto',839,2024;
EXEC AddNeighborhoodCrime 'Ituzaingó','Hurto',683,2024;
EXEC AddNeighborhoodCrime 'Jacinto Vera','Hurto',457,2024;
EXEC AddNeighborhoodCrime 'Jardines del Hipódromo','Hurto',604,2024;
EXEC AddNeighborhoodCrime 'La Blanqueada','Hurto',804,2024;
EXEC AddNeighborhoodCrime 'La Comercial','Hurto',410,2024;
EXEC AddNeighborhoodCrime 'Las Canteras','Hurto',652,2024;
EXEC AddNeighborhoodCrime 'La Figurita','Hurto',328,2024;
EXEC AddNeighborhoodCrime 'Larrañaga','Hurto',921,2024;
EXEC AddNeighborhoodCrime 'La Paloma, Tomkinson','Hurto',659,2024;
EXEC AddNeighborhoodCrime 'Las Acacias','Hurto',621,2024;
EXEC AddNeighborhoodCrime 'La Teja','Hurto',715,2024;
EXEC AddNeighborhoodCrime 'Lezica, Melilla','Hurto',637,2024;
EXEC AddNeighborhoodCrime 'Malvín','Hurto',1249,2024;
EXEC AddNeighborhoodCrime 'Malvín Norte','Hurto',602,2024;
EXEC AddNeighborhoodCrime 'Manga','Hurto',376,2024;
EXEC AddNeighborhoodCrime 'Manga, Toledo Chico','Hurto',480,2024;
EXEC AddNeighborhoodCrime 'Maroñas, Parque Guaraní','Hurto',752,2024;
EXEC AddNeighborhoodCrime 'Mercado Modelo, Bolívar','Hurto',1143,2024;
EXEC AddNeighborhoodCrime 'Nuevo París','Hurto',838,2024;
EXEC AddNeighborhoodCrime 'Palermo','Hurto',344,2024;
EXEC AddNeighborhoodCrime 'Pque. Batlle, V. Dolores','Hurto',1989,2024;
EXEC AddNeighborhoodCrime 'Parque Rodó','Hurto',605,2024;
EXEC AddNeighborhoodCrime 'Paso de la Arena','Hurto',712,2024;
EXEC AddNeighborhoodCrime 'Paso de las Duranas','Hurto',345,2024;
EXEC AddNeighborhoodCrime 'Peñarol, Lavalleja','Hurto',785,2024;
EXEC AddNeighborhoodCrime 'Piedras Blancas','Hurto',727,2024;
EXEC AddNeighborhoodCrime 'Pocitos','Hurto',2107,2024;
EXEC AddNeighborhoodCrime 'Prado, Nueva Savona','Hurto',1214,2024;
EXEC AddNeighborhoodCrime 'Punta Carretas','Hurto',1077,2024;
EXEC AddNeighborhoodCrime 'Punta Gorda','Hurto',555,2024;
EXEC AddNeighborhoodCrime 'Pta. Rieles, Bella Italia','Hurto',847,2024;
EXEC AddNeighborhoodCrime 'Reducto','Hurto',417,2024;
EXEC AddNeighborhoodCrime 'Sayago','Hurto',504,2024;
EXEC AddNeighborhoodCrime 'Tres Cruces','Hurto',1420,2024;
EXEC AddNeighborhoodCrime 'Tres Ombúes, Victoria','Hurto',466,2024;
EXEC AddNeighborhoodCrime 'Unión','Hurto',2983,2024;
EXEC AddNeighborhoodCrime 'Villa Española','Hurto',610,2024;
EXEC AddNeighborhoodCrime 'Villa García, Manga Rural','Hurto',585,2024;
EXEC AddNeighborhoodCrime 'Villa Muñoz, Retiro','Hurto',497,2024;


EXEC AddNeighborhoodCrime 'Aguada','Hurto',926,2025;
EXEC AddNeighborhoodCrime 'Aires Puros','Hurto',400,2025;
EXEC AddNeighborhoodCrime 'Atahualpa','Hurto',294,2025;
EXEC AddNeighborhoodCrime 'Bañados de Carrasco','Hurto',397,2025;
EXEC AddNeighborhoodCrime 'Barrio Sur','Hurto',365,2025;
EXEC AddNeighborhoodCrime 'Belvedere','Hurto',942,2025;
EXEC AddNeighborhoodCrime 'Brazo Oriental','Hurto',580,2025;
EXEC AddNeighborhoodCrime 'Buceo','Hurto',1569,2025;
EXEC AddNeighborhoodCrime 'Capurro, Bella Vista','Hurto',567,2025;
EXEC AddNeighborhoodCrime 'Carrasco','Hurto',479,2025;
EXEC AddNeighborhoodCrime 'Carrasco Norte','Hurto',425,2025;
EXEC AddNeighborhoodCrime 'Casabó, Pajas Blancas','Hurto',380,2025;
EXEC AddNeighborhoodCrime 'Casavalle','Hurto',775,2025;
EXEC AddNeighborhoodCrime 'Castro, P. Castellanos','Hurto',455,2025;
EXEC AddNeighborhoodCrime 'Centro','Hurto',2185,2025;
EXEC AddNeighborhoodCrime 'Cerro','Hurto',649,2025;
EXEC AddNeighborhoodCrime 'Cerrito','Hurto',640,2025;
EXEC AddNeighborhoodCrime 'Ciudad Vieja','Hurto',930,2025;
EXEC AddNeighborhoodCrime 'Colón Centro y Noroeste','Hurto',931,2025;
EXEC AddNeighborhoodCrime 'Colón Sureste, Abayubá','Hurto',304,2025;
EXEC AddNeighborhoodCrime 'Conciliación','Hurto',340,2025;
EXEC AddNeighborhoodCrime 'Cordón','Hurto',2512,2025;
EXEC AddNeighborhoodCrime 'Flor de Maroñas','Hurto',814,2025;
EXEC AddNeighborhoodCrime 'Ituzaingó','Hurto',520,2025;
EXEC AddNeighborhoodCrime 'Jacinto Vera','Hurto',437,2025;
EXEC AddNeighborhoodCrime 'Jardines del Hipódromo','Hurto',714,2025;
EXEC AddNeighborhoodCrime 'La Blanqueada','Hurto',612,2025;
EXEC AddNeighborhoodCrime 'La Comercial','Hurto',459,2025;
EXEC AddNeighborhoodCrime 'Las Canteras','Hurto',595,2025;
EXEC AddNeighborhoodCrime 'La Figurita','Hurto',317,2025;
EXEC AddNeighborhoodCrime 'Larrañaga','Hurto',809,2025;
EXEC AddNeighborhoodCrime 'La Paloma, Tomkinson','Hurto',562,2025;
EXEC AddNeighborhoodCrime 'Las Acacias','Hurto',572,2025;
EXEC AddNeighborhoodCrime 'La Teja','Hurto',610,2025;
EXEC AddNeighborhoodCrime 'Lezica, Melilla','Hurto',497,2025;
EXEC AddNeighborhoodCrime 'Malvín','Hurto',1257,2025;
EXEC AddNeighborhoodCrime 'Malvín Norte','Hurto',608,2025;
EXEC AddNeighborhoodCrime 'Manga','Hurto',454,2025;
EXEC AddNeighborhoodCrime 'Manga, Toledo Chico','Hurto',422,2025;
EXEC AddNeighborhoodCrime 'Maroñas, Parque Guaraní','Hurto',673,2025;
EXEC AddNeighborhoodCrime 'Mercado Modelo, Bolívar','Hurto',918,2025;
EXEC AddNeighborhoodCrime 'Nuevo París','Hurto',712,2025;
EXEC AddNeighborhoodCrime 'Palermo','Hurto',335,2025;
EXEC AddNeighborhoodCrime 'Pque. Batlle, V. Dolores','Hurto',1783,2025;
EXEC AddNeighborhoodCrime 'Parque Rodó','Hurto',657,2025;
EXEC AddNeighborhoodCrime 'Paso de la Arena','Hurto',556,2025;
EXEC AddNeighborhoodCrime 'Paso de las Duranas','Hurto',428,2025;
EXEC AddNeighborhoodCrime 'Peñarol, Lavalleja','Hurto',727,2025;
EXEC AddNeighborhoodCrime 'Piedras Blancas','Hurto',817,2025;
EXEC AddNeighborhoodCrime 'Pocitos','Hurto',1914,2025;
EXEC AddNeighborhoodCrime 'Prado, Nueva Savona','Hurto',1214,2025;
EXEC AddNeighborhoodCrime 'Punta Carretas','Hurto',1172,2025;
EXEC AddNeighborhoodCrime 'Punta Gorda','Hurto',432,2025;
EXEC AddNeighborhoodCrime 'Pta. Rieles, Bella Italia','Hurto',1016,2025;
EXEC AddNeighborhoodCrime 'Reducto','Hurto',372,2025;
EXEC AddNeighborhoodCrime 'Sayago','Hurto',490,2025;
EXEC AddNeighborhoodCrime 'Tres Cruces','Hurto',1507,2025;
EXEC AddNeighborhoodCrime 'Tres Ombúes, Victoria','Hurto',410,2025;
EXEC AddNeighborhoodCrime 'Unión','Hurto',2961,2025;
EXEC AddNeighborhoodCrime 'Villa Española','Hurto',604,2025;
EXEC AddNeighborhoodCrime 'Villa García, Manga Rural','Hurto',510,2025;
EXEC AddNeighborhoodCrime 'Villa Muñoz, Retiro','Hurto',559,2025;


---------------------------------Rapiñas -------------------------------------------------------

EXEC AddNeighborhoodCrime 'Aguada','Rapiña',192,2022;
EXEC AddNeighborhoodCrime 'Aires Puros','Rapiña',121,2022;
EXEC AddNeighborhoodCrime 'Atahualpa','Rapiña',66,2022;
EXEC AddNeighborhoodCrime 'Bañados de Carrasco','Rapiña',195,2022;
EXEC AddNeighborhoodCrime 'Barrio Sur','Rapiña',74,2022;
EXEC AddNeighborhoodCrime 'Belvedere','Rapiña',374,2022;
EXEC AddNeighborhoodCrime 'Brazo Oriental','Rapiña',187,2022;
EXEC AddNeighborhoodCrime 'Buceo','Rapiña',385,2022;
EXEC AddNeighborhoodCrime 'Capurro, Bella Vista','Rapiña',123,2022;
EXEC AddNeighborhoodCrime 'Carrasco','Rapiña',57,2022;
EXEC AddNeighborhoodCrime 'Carrasco Norte','Rapiña',160,2022;
EXEC AddNeighborhoodCrime 'Casabó, Pajas Blancas','Rapiña',326,2022;
EXEC AddNeighborhoodCrime 'Casavalle','Rapiña',913,2022;
EXEC AddNeighborhoodCrime 'Castro, P. Castellanos','Rapiña',119,2022;
EXEC AddNeighborhoodCrime 'Centro','Rapiña',376,2022;
EXEC AddNeighborhoodCrime 'Cerro','Rapiña',622,2022;
EXEC AddNeighborhoodCrime 'Cerrito','Rapiña',207,2022;
EXEC AddNeighborhoodCrime 'Ciudad Vieja','Rapiña',149,2022;
EXEC AddNeighborhoodCrime 'Colón Centro y Noroeste','Rapiña',680,2022;
EXEC AddNeighborhoodCrime 'Colón Sureste, Abayubá','Rapiña',203,2022;
EXEC AddNeighborhoodCrime 'Conciliación','Rapiña',351,2022;
EXEC AddNeighborhoodCrime 'Cordón','Rapiña',357,2022;
EXEC AddNeighborhoodCrime 'Flor de Maroñas','Rapiña',314,2022;
EXEC AddNeighborhoodCrime 'Ituzaingó','Rapiña',333,2022;
EXEC AddNeighborhoodCrime 'Jacinto Vera','Rapiña',65,2022;
EXEC AddNeighborhoodCrime 'Jardines del Hipódromo','Rapiña',394,2022;
EXEC AddNeighborhoodCrime 'La Blanqueada','Rapiña',68,2022;
EXEC AddNeighborhoodCrime 'La Comercial','Rapiña',91,2022;
EXEC AddNeighborhoodCrime 'Las Canteras','Rapiña',433,2022;
EXEC AddNeighborhoodCrime 'La Figurita','Rapiña',57,2022;
EXEC AddNeighborhoodCrime 'Larrañaga','Rapiña',132,2022;
EXEC AddNeighborhoodCrime 'La Paloma, Tomkinson','Rapiña',586,2022;
EXEC AddNeighborhoodCrime 'Las Acacias','Rapiña',445,2022;
EXEC AddNeighborhoodCrime 'La Teja','Rapiña',312,2022;
EXEC AddNeighborhoodCrime 'Lezica, Melilla','Rapiña',336,2022;
EXEC AddNeighborhoodCrime 'Malvín','Rapiña',231,2022;
EXEC AddNeighborhoodCrime 'Malvín Norte','Rapiña',440,2022;
EXEC AddNeighborhoodCrime 'Manga','Rapiña',270,2022;
EXEC AddNeighborhoodCrime 'Manga, Toledo Chico','Rapiña',376,2022;
EXEC AddNeighborhoodCrime 'Maroñas, Parque Guaraní','Rapiña',366,2022;
EXEC AddNeighborhoodCrime 'Mercado Modelo, Bolívar','Rapiña',177,2022;
EXEC AddNeighborhoodCrime 'Nuevo París','Rapiña',422,2022;
EXEC AddNeighborhoodCrime 'Palermo','Rapiña',34,2022;
EXEC AddNeighborhoodCrime 'Pque. Batlle, V. Dolores','Rapiña',265,2022;
EXEC AddNeighborhoodCrime 'Parque Rodó','Rapiña',110,2022;
EXEC AddNeighborhoodCrime 'Paso de la Arena','Rapiña',483,2022;
EXEC AddNeighborhoodCrime 'Paso de las Duranas','Rapiña',233,2022;
EXEC AddNeighborhoodCrime 'Peñarol, Lavalleja','Rapiña',480,2022;
EXEC AddNeighborhoodCrime 'Piedras Blancas','Rapiña',369,2022;
EXEC AddNeighborhoodCrime 'Pocitos','Rapiña',176,2022;
EXEC AddNeighborhoodCrime 'Prado, Nueva Savona','Rapiña',327,2022;
EXEC AddNeighborhoodCrime 'Punta Carretas','Rapiña',168,2022;
EXEC AddNeighborhoodCrime 'Punta Gorda','Rapiña',107,2022;
EXEC AddNeighborhoodCrime 'Pta. Rieles, Bella Italia','Rapiña',494,2022;
EXEC AddNeighborhoodCrime 'Reducto','Rapiña',43,2022;
EXEC AddNeighborhoodCrime 'Sayago','Rapiña',216,2022;
EXEC AddNeighborhoodCrime 'Tres Cruces','Rapiña',147,2022;
EXEC AddNeighborhoodCrime 'Tres Ombúes, Victoria','Rapiña',242,2022;
EXEC AddNeighborhoodCrime 'Unión','Rapiña',624,2022;
EXEC AddNeighborhoodCrime 'Villa Española','Rapiña',234,2022;
EXEC AddNeighborhoodCrime 'Villa García, Manga Rural','Rapiña',507,2022;
EXEC AddNeighborhoodCrime 'Villa Muñoz, Retiro','Rapiña',95,2022;


EXEC AddNeighborhoodCrime 'Aguada','Rapiña',151,2023;
EXEC AddNeighborhoodCrime 'Aires Puros','Rapiña',149,2023;
EXEC AddNeighborhoodCrime 'Atahualpa','Rapiña',76,2023;
EXEC AddNeighborhoodCrime 'Bañados de Carrasco','Rapiña',180,2023;
EXEC AddNeighborhoodCrime 'Barrio Sur','Rapiña',54,2023;
EXEC AddNeighborhoodCrime 'Belvedere','Rapiña',355,2023;
EXEC AddNeighborhoodCrime 'Brazo Oriental','Rapiña',195,2023;
EXEC AddNeighborhoodCrime 'Buceo','Rapiña',316,2023;
EXEC AddNeighborhoodCrime 'Capurro, Bella Vista','Rapiña',111,2023;
EXEC AddNeighborhoodCrime 'Carrasco','Rapiña',61,2023;
EXEC AddNeighborhoodCrime 'Carrasco Norte','Rapiña',122,2023;
EXEC AddNeighborhoodCrime 'Casabó, Pajas Blancas','Rapiña',374,2023;
EXEC AddNeighborhoodCrime 'Casavalle','Rapiña',834,2023;
EXEC AddNeighborhoodCrime 'Castro, P. Castellanos','Rapiña',150,2023;
EXEC AddNeighborhoodCrime 'Centro','Rapiña',298,2023;
EXEC AddNeighborhoodCrime 'Cerro','Rapiña',480,2023;
EXEC AddNeighborhoodCrime 'Cerrito','Rapiña',230,2023;
EXEC AddNeighborhoodCrime 'Ciudad Vieja','Rapiña',114,2023;
EXEC AddNeighborhoodCrime 'Colón Centro y Noroeste','Rapiña',600,2023;
EXEC AddNeighborhoodCrime 'Colón Sureste, Abayubá','Rapiña',237,2023;
EXEC AddNeighborhoodCrime 'Conciliación','Rapiña',326,2023;
EXEC AddNeighborhoodCrime 'Cordón','Rapiña',305,2023;
EXEC AddNeighborhoodCrime 'Flor de Maroñas','Rapiña',383,2023;
EXEC AddNeighborhoodCrime 'Ituzaingó','Rapiña',275,2023;
EXEC AddNeighborhoodCrime 'Jacinto Vera','Rapiña',88,2023;
EXEC AddNeighborhoodCrime 'Jardines del Hipódromo','Rapiña',439,2023;
EXEC AddNeighborhoodCrime 'La Blanqueada','Rapiña',58,2023;
EXEC AddNeighborhoodCrime 'La Comercial','Rapiña',65,2023;
EXEC AddNeighborhoodCrime 'Las Canteras','Rapiña',331,2023;
EXEC AddNeighborhoodCrime 'La Figurita','Rapiña',44,2023;
EXEC AddNeighborhoodCrime 'Larrañaga','Rapiña',137,2023;
EXEC AddNeighborhoodCrime 'La Paloma, Tomkinson','Rapiña',557,2023;
EXEC AddNeighborhoodCrime 'Las Acacias','Rapiña',412,2023;
EXEC AddNeighborhoodCrime 'La Teja','Rapiña',232,2023;
EXEC AddNeighborhoodCrime 'Lezica, Melilla','Rapiña',394,2023;
EXEC AddNeighborhoodCrime 'Malvín','Rapiña',230,2023;
EXEC AddNeighborhoodCrime 'Malvín Norte','Rapiña',605,2023;
EXEC AddNeighborhoodCrime 'Manga','Rapiña',276,2023;
EXEC AddNeighborhoodCrime 'Manga, Toledo Chico','Rapiña',431,2023;
EXEC AddNeighborhoodCrime 'Maroñas, Parque Guaraní','Rapiña',414,2023;
EXEC AddNeighborhoodCrime 'Mercado Modelo, Bolívar','Rapiña',200,2023;
EXEC AddNeighborhoodCrime 'Nuevo París','Rapiña',493,2023;
EXEC AddNeighborhoodCrime 'Palermo','Rapiña',28,2023;
EXEC AddNeighborhoodCrime 'Pque. Batlle, V. Dolores','Rapiña',209,2023;
EXEC AddNeighborhoodCrime 'Parque Rodó','Rapiña',78,2023;
EXEC AddNeighborhoodCrime 'Paso de la Arena','Rapiña',464,2023;
EXEC AddNeighborhoodCrime 'Paso de las Duranas','Rapiña',195,2023;
EXEC AddNeighborhoodCrime 'Peñarol, Lavalleja','Rapiña',543,2023;
EXEC AddNeighborhoodCrime 'Piedras Blancas','Rapiña',371,2023;
EXEC AddNeighborhoodCrime 'Pocitos','Rapiña',153,2023;
EXEC AddNeighborhoodCrime 'Prado, Nueva Savona','Rapiña',308,2023;
EXEC AddNeighborhoodCrime 'Punta Carretas','Rapiña',157,2023;
EXEC AddNeighborhoodCrime 'Punta Gorda','Rapiña',86,2023;
EXEC AddNeighborhoodCrime 'Pta. Rieles, Bella Italia','Rapiña',405,2023;
EXEC AddNeighborhoodCrime 'Reducto','Rapiña',70,2023;
EXEC AddNeighborhoodCrime 'Sayago','Rapiña',163,2023;
EXEC AddNeighborhoodCrime 'Tres Cruces','Rapiña',150,2023;
EXEC AddNeighborhoodCrime 'Tres Ombúes, Victoria','Rapiña',223,2023;
EXEC AddNeighborhoodCrime 'Unión','Rapiña',640,2023;
EXEC AddNeighborhoodCrime 'Villa Española','Rapiña',212,2023;
EXEC AddNeighborhoodCrime 'Villa García, Manga Rural','Rapiña',403,2023;
EXEC AddNeighborhoodCrime 'Villa Muñoz, Retiro','Rapiña',55,2023;


EXEC AddNeighborhoodCrime 'Aguada','Rapiña',118,2024;
EXEC AddNeighborhoodCrime 'Aires Puros','Rapiña',100,2024;
EXEC AddNeighborhoodCrime 'Atahualpa','Rapiña',31,2024;
EXEC AddNeighborhoodCrime 'Bañados de Carrasco','Rapiña',135,2024;
EXEC AddNeighborhoodCrime 'Barrio Sur','Rapiña',25,2024;
EXEC AddNeighborhoodCrime 'Belvedere','Rapiña',258,2024;
EXEC AddNeighborhoodCrime 'Brazo Oriental','Rapiña',166,2024;
EXEC AddNeighborhoodCrime 'Buceo','Rapiña',313,2024;
EXEC AddNeighborhoodCrime 'Capurro, Bella Vista','Rapiña',104,2024;
EXEC AddNeighborhoodCrime 'Carrasco','Rapiña',71,2024;
EXEC AddNeighborhoodCrime 'Carrasco Norte','Rapiña',109,2024;
EXEC AddNeighborhoodCrime 'Casabó, Pajas Blancas','Rapiña',260,2024;
EXEC AddNeighborhoodCrime 'Casavalle','Rapiña',586,2024;
EXEC AddNeighborhoodCrime 'Castro, P. Castellanos','Rapiña',89,2024;
EXEC AddNeighborhoodCrime 'Centro','Rapiña',250,2024;
EXEC AddNeighborhoodCrime 'Cerro','Rapiña',438,2024;
EXEC AddNeighborhoodCrime 'Cerrito','Rapiña',132,2024;
EXEC AddNeighborhoodCrime 'Ciudad Vieja','Rapiña',108,2024;
EXEC AddNeighborhoodCrime 'Colón Centro y Noroeste','Rapiña',476,2024;
EXEC AddNeighborhoodCrime 'Colón Sureste, Abayubá','Rapiña',155,2024;
EXEC AddNeighborhoodCrime 'Conciliación','Rapiña',226,2024;
EXEC AddNeighborhoodCrime 'Cordón','Rapiña',255,2024;
EXEC AddNeighborhoodCrime 'Flor de Maroñas','Rapiña',300,2024;
EXEC AddNeighborhoodCrime 'Ituzaingó','Rapiña',203,2024;
EXEC AddNeighborhoodCrime 'Jacinto Vera','Rapiña',82,2024;
EXEC AddNeighborhoodCrime 'Jardines del Hipódromo','Rapiña',342,2024;
EXEC AddNeighborhoodCrime 'La Blanqueada','Rapiña',48,2024;
EXEC AddNeighborhoodCrime 'La Comercial','Rapiña',38,2024;
EXEC AddNeighborhoodCrime 'Las Canteras','Rapiña',182,2024;
EXEC AddNeighborhoodCrime 'La Figurita','Rapiña',38,2024;
EXEC AddNeighborhoodCrime 'Larrañaga','Rapiña',101,2024;
EXEC AddNeighborhoodCrime 'La Paloma, Tomkinson','Rapiña',329,2024;
EXEC AddNeighborhoodCrime 'Las Acacias','Rapiña',248,2024;
EXEC AddNeighborhoodCrime 'La Teja','Rapiña',173,2024;
EXEC AddNeighborhoodCrime 'Lezica, Melilla','Rapiña',220,2024;
EXEC AddNeighborhoodCrime 'Malvín','Rapiña',214,2024;
EXEC AddNeighborhoodCrime 'Malvín Norte','Rapiña',657,2024;
EXEC AddNeighborhoodCrime 'Manga','Rapiña',174,2024;
EXEC AddNeighborhoodCrime 'Manga, Toledo Chico','Rapiña',278,2024;
EXEC AddNeighborhoodCrime 'Maroñas, Parque Guaraní','Rapiña',310,2024;
EXEC AddNeighborhoodCrime 'Mercado Modelo, Bolívar','Rapiña',179,2024;
EXEC AddNeighborhoodCrime 'Nuevo París','Rapiña',290,2024;
EXEC AddNeighborhoodCrime 'Palermo','Rapiña',27,2024;
EXEC AddNeighborhoodCrime 'Pque. Batlle, V. Dolores','Rapiña',193,2024;
EXEC AddNeighborhoodCrime 'Parque Rodó','Rapiña',64,2024;
EXEC AddNeighborhoodCrime 'Paso de la Arena','Rapiña',402,2024;
EXEC AddNeighborhoodCrime 'Paso de las Duranas','Rapiña',174,2024;
EXEC AddNeighborhoodCrime 'Peñarol, Lavalleja','Rapiña',468,2024;
EXEC AddNeighborhoodCrime 'Piedras Blancas','Rapiña',361,2024;
EXEC AddNeighborhoodCrime 'Pocitos','Rapiña',110,2024;
EXEC AddNeighborhoodCrime 'Prado, Nueva Savona','Rapiña',229,2024;
EXEC AddNeighborhoodCrime 'Punta Carretas','Rapiña',101,2024;
EXEC AddNeighborhoodCrime 'Punta Gorda','Rapiña',68,2024;
EXEC AddNeighborhoodCrime 'Pta. Rieles, Bella Italia','Rapiña',347,2024;
EXEC AddNeighborhoodCrime 'Reducto','Rapiña',35,2024;
EXEC AddNeighborhoodCrime 'Sayago','Rapiña',176,2024;
EXEC AddNeighborhoodCrime 'Tres Cruces','Rapiña',122,2024;
EXEC AddNeighborhoodCrime 'Tres Ombúes, Victoria','Rapiña',187,2024;
EXEC AddNeighborhoodCrime 'Unión','Rapiña',475,2024;
EXEC AddNeighborhoodCrime 'Villa Española','Rapiña',141,2024;
EXEC AddNeighborhoodCrime 'Villa García, Manga Rural','Rapiña',311,2024;
EXEC AddNeighborhoodCrime 'Villa Muñoz, Retiro','Rapiña',45,2024;


EXEC AddNeighborhoodCrime 'Aguada','Rapiña',99,2025;
EXEC AddNeighborhoodCrime 'Aires Puros','Rapiña',97,2025;
EXEC AddNeighborhoodCrime 'Atahualpa','Rapiña',50,2025;
EXEC AddNeighborhoodCrime 'Bañados de Carrasco','Rapiña',172,2025;
EXEC AddNeighborhoodCrime 'Barrio Sur','Rapiña',45,2025;
EXEC AddNeighborhoodCrime 'Belvedere','Rapiña',237,2025;
EXEC AddNeighborhoodCrime 'Brazo Oriental','Rapiña',138,2025;
EXEC AddNeighborhoodCrime 'Buceo','Rapiña',245,2025;
EXEC AddNeighborhoodCrime 'Capurro, Bella Vista','Rapiña',102,2025;
EXEC AddNeighborhoodCrime 'Carrasco','Rapiña',56,2025;
EXEC AddNeighborhoodCrime 'Carrasco Norte','Rapiña',64,2025;
EXEC AddNeighborhoodCrime 'Casabó, Pajas Blancas','Rapiña',177,2025;
EXEC AddNeighborhoodCrime 'Casavalle','Rapiña',460,2025;
EXEC AddNeighborhoodCrime 'Castro, P. Castellanos','Rapiña',103,2025;
EXEC AddNeighborhoodCrime 'Centro','Rapiña',269,2025;
EXEC AddNeighborhoodCrime 'Cerro','Rapiña',226,2025;
EXEC AddNeighborhoodCrime 'Cerrito','Rapiña',154,2025;
EXEC AddNeighborhoodCrime 'Ciudad Vieja','Rapiña',84,2025;
EXEC AddNeighborhoodCrime 'Colón Centro y Noroeste','Rapiña',405,2025;
EXEC AddNeighborhoodCrime 'Colón Sureste, Abayubá','Rapiña',144,2025;
EXEC AddNeighborhoodCrime 'Conciliación','Rapiña',210,2025;
EXEC AddNeighborhoodCrime 'Cordón','Rapiña',254,2025;
EXEC AddNeighborhoodCrime 'Flor de Maroñas','Rapiña',262,2025;
EXEC AddNeighborhoodCrime 'Ituzaingó','Rapiña',153,2025;
EXEC AddNeighborhoodCrime 'Jacinto Vera','Rapiña',57,2025;
EXEC AddNeighborhoodCrime 'Jardines del Hipódromo','Rapiña',298,2025;
EXEC AddNeighborhoodCrime 'La Blanqueada','Rapiña',40,2025;
EXEC AddNeighborhoodCrime 'La Comercial','Rapiña',40,2025;
EXEC AddNeighborhoodCrime 'Las Canteras','Rapiña',197,2025;
EXEC AddNeighborhoodCrime 'La Figurita','Rapiña',41,2025;
EXEC AddNeighborhoodCrime 'Larrañaga','Rapiña',73,2025;
EXEC AddNeighborhoodCrime 'La Paloma, Tomkinson','Rapiña',331,2025;
EXEC AddNeighborhoodCrime 'Las Acacias','Rapiña',273,2025;
EXEC AddNeighborhoodCrime 'La Teja','Rapiña',208,2025;
EXEC AddNeighborhoodCrime 'Lezica, Melilla','Rapiña',197,2025;
EXEC AddNeighborhoodCrime 'Malvín','Rapiña',178,2025;
EXEC AddNeighborhoodCrime 'Malvín Norte','Rapiña',478,2025;
EXEC AddNeighborhoodCrime 'Manga','Rapiña',230,2025;
EXEC AddNeighborhoodCrime 'Manga, Toledo Chico','Rapiña',264,2025;
EXEC AddNeighborhoodCrime 'Maroñas, Parque Guaraní','Rapiña',286,2025;
EXEC AddNeighborhoodCrime 'Mercado Modelo, Bolívar','Rapiña',136,2025;
EXEC AddNeighborhoodCrime 'Nuevo París','Rapiña',281,2025;
EXEC AddNeighborhoodCrime 'Palermo','Rapiña',26,2025;
EXEC AddNeighborhoodCrime 'Pque. Batlle, V. Dolores','Rapiña',144,2025;
EXEC AddNeighborhoodCrime 'Parque Rodó','Rapiña',82,2025;
EXEC AddNeighborhoodCrime 'Paso de la Arena','Rapiña',262,2025;
EXEC AddNeighborhoodCrime 'Paso de las Duranas','Rapiña',127,2025;
EXEC AddNeighborhoodCrime 'Peñarol, Lavalleja','Rapiña',318,2025;
EXEC AddNeighborhoodCrime 'Piedras Blancas','Rapiña',312,2025;
EXEC AddNeighborhoodCrime 'Pocitos','Rapiña',112,2025;
EXEC AddNeighborhoodCrime 'Prado, Nueva Savona','Rapiña',271,2025;
EXEC AddNeighborhoodCrime 'Punta Carretas','Rapiña',153,2025;
EXEC AddNeighborhoodCrime 'Punta Gorda','Rapiña',63,2025;
EXEC AddNeighborhoodCrime 'Pta. Rieles, Bella Italia','Rapiña',309,2025;
EXEC AddNeighborhoodCrime 'Reducto','Rapiña',55,2025;
EXEC AddNeighborhoodCrime 'Sayago','Rapiña',134,2025;
EXEC AddNeighborhoodCrime 'Tres Cruces','Rapiña',113,2025;
EXEC AddNeighborhoodCrime 'Tres Ombúes, Victoria','Rapiña',143,2025;
EXEC AddNeighborhoodCrime 'Unión','Rapiña',535,2025;
EXEC AddNeighborhoodCrime 'Villa Española','Rapiña',182,2025;
EXEC AddNeighborhoodCrime 'Villa García, Manga Rural','Rapiña',367,2025;
EXEC AddNeighborhoodCrime 'Villa Muñoz, Retiro','Rapiña',57,2025;