import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.environ.get("DB_FILE", os.path.join(BASE_DIR, "FAG.db"))

def get_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.execute("PRAGMA foreign_keys = ON;")
    conn.row_factory = sqlite3.Row
    return conn

def create_tables():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
            CREATE TABLE IF NOT EXISTS Manager(
                   ManagerId INTEGER PRIMARY KEY AUTOINCREMENT,
                   firstName TEXT NOT NULL,
                   lastName TEXT NOT NULL,
                   email TEXT NOT NULL UNIQUE,
                   telephone TEXT NOT NULL, 
                   password TEXT NOT NULL,
                   role TEXT NOT NULL DEFAULT 'manager'
                   )
                """)
    
    cursor.execute("""
         CREATE TABLE IF NOT EXISTS Furniture(
                   FurnitureId INTEGER PRIMARY KEY AUTOINCREMENT,
                   FurnitureName TEXT NOT NULL,
                   FurnitureOwnerName TEXT NOT NULL
                   )
                """)

  
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS Import (
                ImportId INTEGER PRIMARY KEY AUTOINCREMENT,
                FurnitureId INTEGER NOT NULL,
                ImportDate TEXT NOT NULL,
                Quantity INTEGER NOT NULL,
                FOREIGN KEY(FurnitureId) REFERENCES Furniture(FurnitureId) ON DELETE CASCADE
                   
                )
            """)
 
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS Export (
                   ExportId INTEGER PRIMARY KEY AUTOINCREMENT,
                   FurnitureId INTEGER NOT NULL,
                   ExportDate TEXT NOT NULL,
                   Quantity INTEGER NOT NULL,
                   FOREIGN KEY(FurnitureId) REFERENCES Furniture(FurnitureId) ON DELETE CASCADE
                   
                   )
                """)

    conn.commit()

    cursor.execute("PRAGMA table_info(Manager)")
    columns = [row[1] for row in cursor.fetchall()]
    if "role" not in columns:
        cursor.execute("ALTER TABLE Manager ADD COLUMN role TEXT NOT NULL DEFAULT 'manager'")
        conn.commit()

    conn.close()
