USE [kudo_peliculas];

-- Users
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(150) NOT NULL,
    Email NVARCHAR(150) NOT NULL UNIQUE,
    CreatedDate DATETIME DEFAULT GETDATE()
);
GO

-- Categories
CREATE TABLE Categories (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(50) NOT NULL UNIQUE
);
GO

-- Movies

CREATE TABLE Movies (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(150) NOT NULL,
    Description NVARCHAR(MAX),
    ReleaseDate DATE NOT NULL,
    CategoryId INT NOT NULL,
    FOREIGN KEY (CategoryId) REFERENCES Categories(Id)
);
GO

-- MoviesWatched
CREATE TABLE MoviesWatched (
    UserId INT NOT NULL,
    MovieId INT NOT NULL,
    WatchedDate DATE NOT NULL DEFAULT GETDATE(),
    PRIMARY KEY (UserId, MovieId),
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (MovieId) REFERENCES Movies(Id)
);
GO

-- Datos iniciales: Categorías
INSERT INTO Categories (Name) VALUES
    ('Terror'),
    ('Suspenso'),
    ('Drama'),
    ('Comedia');
GO

-- Datos iniciales: Películas
INSERT INTO Movies (Name, Description, ReleaseDate, CategoryId) VALUES
    -- Novedades (menos de 3 semanas)
    ('A Quiet Place: Day One', 'Los orígenes del ataque de criaturas sensibles al sonido.', '2025-06-07', 1),
    ('Inside Out 2', 'Riley lidia con nuevas emociones en la adolescencia.', '2025-06-14', 4),

    -- Películas conocidas
    ('Inception', 'Un ladrón que roba secretos a través de los sueños.', '2010-07-16', 2),
    ('The Shawshank Redemption', 'Un banquero injustamente encarcelado planea escapar.', '1994-09-22', 3),
    ('Get Out', 'Un joven afroamericano descubre un secreto siniestro.', '2017-02-24', 1),
    ('The Dark Knight', 'Batman enfrenta al Joker en una ciudad al borde del caos.', '2008-07-18', 2),
    ('Forrest Gump', 'La vida extraordinaria de un hombre común.', '1994-07-06', 3),
    ('The Hangover', 'Tres amigos pierden al novio antes de su boda.', '2009-06-05', 4),
    ('Hereditary', 'Una familia descubre oscuros secretos tras una muerte.', '2018-06-08', 1),
    ('Knives Out', 'Detective investiga una muerte en una familia rica.', '2019-11-27', 2);
GO
