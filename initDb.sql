CREATE TABLE dbo.Users
(
    Id INT IDENTITY PRIMARY KEY,
    Email VARCHAR(320) NOT NULL,
    Password VARCHAR(64) NOT NULL
);

CREATE TABLE dbo.Profiles
(
    UserId INT NOT NULL,
    Username NVARCHAR(16) NOT NULL,
    Motto NVARCHAR(75) NULL,
    
    -- Define foreign key constraint on UserId referencing dbo.Users(Id)
    CONSTRAINT FK_Profiles_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(Id)
);
