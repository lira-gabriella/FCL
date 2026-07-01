import sqlite3

DB_FILE = "FAG.db"

def get_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def create_tables():
    conn = get_connection()
    cursor = conn.cursor()

    # Create Manager Table
    cursor.execute("""
            CREATE TABLE IF NOT EXISTS Manager(
                   ManagerId INTEGER PRIMARY KEY AUTOINCREMENT,
                   firstName TEXT NOT NULL,
                   lastName TEXT NOT NULL,
                   email TEXT NOT NULL UNIQUE,
                   telephone TEXT NOT NULL, 
                   password TEXT NOT NULL
                   )
                """)
    
    
    cursor.execute("""
         CREATE TABLE IF NOT EXISTS Furniture(
                   FurnitureId INTEGER PRIMARY KEY AUTOINCREMENT,
                   FurnitureName TEXT NOT NULL,
                   FurnitureOwnerName TEXT NOT NULL
                   )
                """)


    #TABLE FOR IMPORTING HERE 

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS Import (
                ImportId INTEGER PRIMARY KEY AUTOINCREMENT,
                FurnitureId INTEGER NOT NULL,
                ImportDate TEXT NOT NULL,
                Quantity INTEGER NOT NULL
                   
                )
            """)

    #TABLE FOR EXPORTING HERE 

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS Export (
                   ExportId INTEGER PRIMARY KEY AUTOINCREMENT,
                   FurnitureId INTEGER NOT NULL,
                   ExportDate TEXT NOT NULL,
                   Quantity INTEGER NOT NULL
                   
                   )
                """)


    
    
    conn.commit()
    conn.close()
