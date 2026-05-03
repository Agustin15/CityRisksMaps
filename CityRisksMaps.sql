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
avatar VARCHAR(100),
activated BIT NOT NULL,
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
--Rols PROCEDURES

CREATE OR ALTER PROCEDURE AddRol @name VARCHAR(10)  AS
BEGIN

IF (LEN(@name)=0)
RETURN -1

IF EXISTS (select * from Rols where name=@name)
RETURN -2

INSERT INTO Rols(name) VALUES(@name);

IF(@@ERROR<>0)
RETURN -3

RETURN 1

END
GO

CREATE OR ALTER PROCEDURE UpdateRol @idRol INT,@name VARCHAR(10) AS
BEGIN

IF (LEN(@name)=0)
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
RETURN -1

IF (LEN(@name)=0)
RETURN -2

IF (LEN(@lastname)=0)
RETURN -3

IF NOT EXISTS (select * from Rols where idRol=@rol)
RETURN -4

IF EXISTS (select * from Users where email=@email)
RETURN -5

INSERT INTO Users(email,name,lastname,activated,rol) VALUES(@email,@name,@lastname,@activated,@rol);

IF(@@ERROR<>0)
RETURN -6

RETURN scope_identity();

END
GO


CREATE OR ALTER PROCEDURE UpdateUser @idUser INT,@email VARCHAR(40),@name VARCHAR(20),@lastname VARCHAR(20),@rol INT AS

BEGIN

IF (PATINDEX('%@[a-zA-Z]%.com%%',@email)=0)
RETURN -1

IF (LEN(@name)=0)
RETURN -2

IF (LEN(@lastname)=0)
RETURN -3

IF NOT EXISTS (select * from Users where idUser=@idUser)
RETURN -4

IF NOT EXISTS (select * from Rols where idRol=@rol)
RETURN -5

IF EXISTS (select * from Users where idUser!=@idUser and email=@email)
RETURN -6

UPDATE Users set email=@email,name=@name,lastname=@lastname,@rol=rol where idUser=@idUser;

IF(@@ERROR<>0)
RETURN -7

RETURN 1

END
GO


CREATE OR ALTER PROCEDURE UpdateEmailByIdUser @idUser INT,@email VARCHAR(40) AS

BEGIN

IF (PATINDEX('%@[a-zA-Z]%.com%%',@email)=0)
RETURN -1

IF NOT EXISTS (select * from Users where idUser=@idUser)
RETURN -2

IF EXISTS (select * from Users where idUser=@idUser and email=@email)
RETURN -3

IF EXISTS (select * from Users where idUser!=@idUser and email=@email)
RETURN -4

UPDATE Users set email=@email where idUser=@idUser;

IF(@@ERROR<>0)
RETURN -5

RETURN 1

END
GO

CREATE OR ALTER PROCEDURE UpdateAvatarByIdUser @idUser INT,@avatar VARCHAR(100) AS

BEGIN

IF (LEN(@avatar)=0)
RETURN -1

IF NOT EXISTS (select * from Users where idUser=@idUser)
RETURN -2

UPDATE Users set avatar=@avatar where idUser=@idUser;

IF(@@ERROR<>0)
RETURN -3

RETURN 1

END
GO

CREATE OR ALTER PROCEDURE UpdateUserPasswordByIdUser @idUser INT,@password VARCHAR(60) AS

IF(LEN(@password)=0)
RETURN -1

IF NOT EXISTS (select * from Users where idUser=@idUser)
RETURN -2

Update Users set password=@password where idUser=@idUser

IF(@@ERROR<>0)
RETURN -3

RETURN 1

GO


CREATE OR ALTER PROCEDURE UpdateCompleteNameByIdUser @idUser INT,@name VARCHAR(20),@lastname VARCHAR(20) AS

IF(LEN(@name)=0)
RETURN -1

IF(LEN(@lastname)=0)
RETURN -2

IF NOT EXISTS (select * from Users where idUser=@idUser)
RETURN -3

Update Users set name=@name,lastname=@lastname where idUser=@idUser

IF(@@ERROR<>0)
RETURN -4

RETURN 1

GO

CREATE OR ALTER PROCEDURE ActivateUserByIdUser @idUser INT,@password VARCHAR(60) AS

IF(LEN(@password)=0)
RETURN -1

IF NOT EXISTS (select * from Users where idUser=@idUser)
RETURN -2

Update Users set password=@password,activated=1 where idUser=@idUser

IF(@@ERROR<>0)
RETURN -3

RETURN 1

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
SELECT idUser,name,lastname,email,activated,avatar,created,lastModified,rol FROM Users;
END
GO

CREATE OR ALTER PROCEDURE UsersOffset @offset INT AS
BEGIN
SELECT U.idUser,U.name,U.lastname,U.email,U.activated,U.avatar,U.created,U.lastModified,U.rol,
R.name as 'nameRole' FROM Users U INNER JOIN Rols R ON U.rol=R.idRol ORDER BY created OFFSET @offset ROWS FETCH NEXT 10 ROWS ONLY;
END
GO

CREATE OR ALTER PROCEDURE UsersByRole @idRol INT AS
BEGIN
SELECT idUser,name,lastname,email,activated,avatar,created,lastModified,rol FROM Users where rol=@idRol;
END
GO

CREATE OR ALTER PROCEDURE UsersByRoleOffset @idRol INT,@offset INT AS
BEGIN
SELECT U.idUser,U.name,U.lastname,U.email,U.activated,U.avatar,U.created,U.lastModified,U.rol
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

IF(LEN(@name)=0)
RETURN -1

IF EXISTS (select * from Departments where name=@name)
RETURN -2

INSERT INTO Departments(name) VALUES(@name);

IF(@@ERROR<>0)
RETURN -3

RETURN 1

END
GO

CREATE OR ALTER PROCEDURE UpdateDepartment @idDepartment INT ,@name VARCHAR(30) AS
BEGIN

IF(LEN(@name)=0)
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

IF EXISTS (select * from Crimes where category=@category)
RETURN -1

INSERT INTO Crimes(category,description) VALUES(@category,@description);

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

IF (LEN(@name)=0)
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

CREATE OR ALTER PROCEDURE UpdateNeighborhood @idNeighborhood INT, @name VARCHAR(30),@idDepartment INT AS
BEGIN

IF (LEN(@name)=0)
RETURN -1

IF NOT EXISTS (select * from Departments where idDepartment=@idDepartment)
RETURN -2

UPDATE Neighborhoods set name=@name,department=@idDepartment where idNeighborhood=@idNeighborhood;

IF(@@ERROR<>0)
RETURN -3

RETURN 1

END
GO

CREATE OR ALTER PROCEDURE DeleteNeighborhood @idNeighborhood INT AS
BEGIN

IF NOT EXISTS(select * from Neighborhoods where idNeighborhood=@idNeighborhood )
RETURN -1

DELETE from Neighborhoods where idNeighborhood=@idNeighborhood ;

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
RETURN -1

IF(@year>YEAR(GETDATE()))
RETURN -2

IF NOT EXISTS (select * from Neighborhoods where name=@neighbordhood) 
RETURN -3

SELECT @idNeighborhood=idNeighborhood from Neighborhoods where name=@neighbordhood

IF EXISTS (select * from Population where neighborhood=@idNeighborhood and year=@year) 
RETURN -4

INSERT INTO Population VALUES(@idNeighborhood,@quantity,@year);

IF(@@ERROR<>0)
RETURN -5

RETURN 1

END

GO


CREATE OR ALTER PROCEDURE UpdatePopulation @idPopulation INT,@quantity INT,@year INT, @neighborhood VARCHAR(30) AS
BEGIN

DECLARE @idNeighborhood INT;

IF (@quantity<0)
RETURN -1

IF(@year>YEAR(GETDATE()))
RETURN -2

IF NOT EXISTS (select * from Population where @idPopulation=idPopulation)
RETURN -3

IF NOT EXISTS (select * from Neighborhoods where name=@neighborhood)
RETURN -4

SELECT @idNeighborhood=idNeighborhood from Neighborhoods where name=@neighborhood

IF EXISTS (select * from Population where neighborhood=@idNeighborhood and year=@year and idPopulation!=@idPopulation)
RETURN -5

UPDATE Population set quantity=@quantity,year=@year,neighborhood=@idNeighborhood where @idPopulation=idPopulation;

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

IF EXISTS (select * from @table T LEFT JOIN Neighborhoods N on T.idNeighborhood=N.idNeighborhood where N.idNeighborhood IS NULL)
RETURN -1;

IF NOT EXISTS (select * from Crimes where category=@categoryCrime)
RETURN -2;

IF EXISTS (select * from @table where quantity<0)
RETURN -3;

IF EXISTS (select * from @table where @year>YEAR(GETDATE()))
RETURN -4;

IF EXISTS (select * from @table T INNER JOIN Neighborhoods_Crimes NC ON  T.crime=NC.crime and T.year=NC.year and 
NC.neighborhood=T.idNeighborhood)
RETURN -5;

BEGIN TRANSACTION

INSERT INTO Neighborhoods_Crimes(neighborhood,crime,quantity,increase,rate,year)
select T.idNeighborhood,@categoryCrime,T.quantity,dbo.CalculateIncrease(T.idNeighborhood,@categoryCrime,T.quantity,T.year),
dbo.CalculateRate(T.idNeighborhood,T.quantity,T.year),T.year from @table T

IF(@@ERROR<>0)
BEGIN
ROLLBACK TRANSACTION
RETURN -6
END

COMMIT TRANSACTION
RETURN 1

END
GO


CREATE OR ALTER PROCEDURE AddNeighborhoodCrime @neighborhood VARCHAR(30),@categoryCrime VARCHAR(30),@quantity INT ,@year INT AS

BEGIN

DECLARE @idNeighborhood INT;
DECLARE @increase DECIMAL(5,1);
DECLARE @rate DECIMAL(6,1);

IF NOT EXISTS (select * from Neighborhoods where name=@neighborhood )
RETURN -1;

IF NOT EXISTS (select * from Crimes where category=@categoryCrime)
RETURN -2;

IF(@quantity<0)
RETURN -3;

IF (@year>YEAR(GETDATE()))
RETURN -4;

select @idNeighborhood=idNeighborhood from Neighborhoods where name=@neighborhood

IF EXISTS (select * from Neighborhoods_Crimes where neighborhood=@idNeighborhood and crime=@categoryCrime and year=@year)
RETURN -5;

EXEC @increase=dbo.CalculateIncrease @idNeighborhood,@categoryCrime,@quantity,@year;
EXEC @rate=dbo.CalculateRate @idNeighborhood,@quantity,@year;

INSERT INTO Neighborhoods_Crimes(neighborhood,crime,quantity,increase,rate,year) VALUES (@idNeighborhood,@categoryCrime,@quantity,
@increase,@rate,@year)

IF(@@ERROR<>0)
RETURN -6

RETURN 1

END
GO

CREATE OR ALTER PROCEDURE UpdateNeighborhoodsCrime @table dbo.NeighborhoodsCrimeTableType READONLY,@categoryCrime VARCHAR(30),@year INT AS

BEGIN

IF EXISTS (select * from @table T LEFT JOIN Neighborhoods N on T.idNeighborhood=N.idNeighborhood where N.idNeighborhood IS NULL)
RETURN -1;

IF NOT EXISTS (select * from Crimes where category=@categoryCrime)
RETURN -2;

IF EXISTS (select * from @table where quantity<0)
RETURN -3;

IF EXISTS (select * from @table where @year>YEAR(GETDATE()))
RETURN -4;

IF NOT EXISTS (select * from @table T INNER JOIN Neighborhoods_Crimes NC ON  T.crime=NC.crime and T.year=NC.year and
NC.neighborhood=T.idNeighborhood)
RETURN -5;

BEGIN TRANSACTION

UPDATE Neighborhoods_Crimes SET quantity=T.quantity FROM Neighborhoods_Crimes NC 
INNER JOIN @table T ON T.crime=NC.crime and T.year=NC.year and NC.neighborhood=T.idNeighborhood


IF(@@ERROR<>0)
BEGIN
ROLLBACK TRANSACTION
RETURN -6
END

COMMIT TRANSACTION
RETURN 1

END
GO

CREATE OR ALTER PROCEDURE DeleteNeighborhoodCrime @crime VARCHAR(20),@idNeighborhood INT,@year INT AS
BEGIN

IF NOT EXISTS(select * from Neighborhoods_Crimes where crime=@crime and neighborhood=@idNeighborhood and @year=year)
RETURN -1

DELETE from Neighborhoods_Crimes where crime=@crime and neighborhood=@idNeighborhood and @year=year;

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

CREATE OR ALTER PROCEDURE AmountOfAnCrimeInYears @crime VARCHAR(20) AS 

BEGIN 
select year,SUM(quantity) as 'amount',SUM(increase) as 'increase' from Neighborhoods_Crimes where crime=@crime GROUP BY year ORDER BY year ASC; 
END

GO


CREATE OR ALTER PROCEDURE AmountOfAnCrimeInNeighborhoodsByYear @crime VARCHAR(20),@year INT AS 

BEGIN 
select N.name,NC.quantity as 'amount' from Neighborhoods_Crimes NC INNER JOIN Neighborhoods N ON NC.neighborhood=N.idNeighborhood 
where NC.crime=@crime and NC.year=@year ORDER BY 'amount' DESC;
END

GO

CREATE OR ALTER PROCEDURE AmountOfAnCrimeInNeighborhoodInYears @crime VARCHAR(20),@neighborhood VARCHAR(30) AS 

BEGIN 
select N.name,NC.quantity as 'amount',increase from Neighborhoods_Crimes NC INNER JOIN Neighborhoods N ON NC.neighborhood=N.idNeighborhood 
where NC.crime=@crime and N.name=@neighborhood ORDER BY year ASC;
END

GO


CREATE OR ALTER PROCEDURE TopTenNeighborhoodsWithMoreTypeOfCrime @crime VARCHAR(20) AS 

BEGIN 
select TOP 10 N.name,SUM(NC.quantity) as 'amount' from Neighborhoods_Crimes NC INNER JOIN Neighborhoods N ON NC.neighborhood=N.idNeighborhood 
where NC.crime=@crime GROUP BY N.name ORDER BY 'amount' DESC;
END

GO

CREATE OR ALTER PROCEDURE TopTenNeighborhoodsWithLessTypeOfCrime @crime VARCHAR(20) AS 

BEGIN 
select TOP 10 N.name,SUM(NC.quantity) as 'amount' from Neighborhoods_Crimes NC INNER JOIN Neighborhoods N ON NC.neighborhood=N.idNeighborhood 
where NC.crime=@crime GROUP BY N.name ORDER BY 'amount' ASC;
END

GO


------------------------------------------------------------------------------------------------------------------
--Zones PROCEDURES

CREATE OR ALTER PROCEDURE AddZone @description VARCHAR(250),@coordinates NVARCHAR(MAX),@enable bit AS
BEGIN 

IF(@enable!=0 or @enable!=1)
RETURN -1

IF (LEN(@description)=0)
RETURN -2

INSERT INTO Zones(description,coordinates,enable) VALUES(@description,@coordinates,@enable);
IF(@@ERROR<>0)
RETURN -3

RETURN IDENT_CURRENT('Zones');

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

IF(@enable!=0 or @enable!=1)
RETURN -1

IF (LEN(@description)=0)
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
RETURN -4

END

GO

CREATE OR ALTER PROCEDURE DeleteZoneNeighborhood @idZone INT,@idNeighborhood INT AS
BEGIN 

IF NOT EXISTS(select * from Zones_Neighborhoods where zone=@idZone and neighborhood=@idNeighborhood)
RETURN -1

DELETE FROM Zones_Neighborhoods where zone=@idZone and neighborhood=@idNeighborhood;

IF(@@ERROR<>0)
RETURN -2

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
