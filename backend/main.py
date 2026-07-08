from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import create_tables, get_connection

create_tables()

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ManagerRegister(BaseModel):
    firstName: str
    lastName: str
    email: str
    telephone: str
    password: str

class ManagerLogin(BaseModel):
    email: str
    password: str

class FurnitureRequest(BaseModel):
    FurnitureName: str
    FurnitureOwnerName: str

class ImportRequest(BaseModel):
    FurnitureId: int
    ImportDate: str
    Quantity: int

class ExportRequest(BaseModel):
    FurnitureId: int
    ExportDate: str
    Quantity: int


@app.post("/api/register")
def register_manager(data: ManagerRegister):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO Manager (firstName, lastName, email, telephone, password) VALUES (?, ?, ?, ?, ?)",
        (data.firstName, data.lastName, data.email, data.telephone, data.password)
    )
    conn.commit()
    conn.close()
    return {"message": "Account created successfully!"}

@app.post("/api/login")
def login_manager(data: ManagerLogin):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM Manager WHERE email = ? AND password = ?",
        (data.email, data.password)
    )   
    user = cursor.fetchone()
    conn.close()   
    
    if user is not None:
        return {"status": "success", "firstName": user["firstName"]}
    else:
        return {"status": "fail", "message": "Invalid credentials"}




@app.post("/api/furniture")
def add_furniture(data: FurnitureRequest): 
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO Furniture (FurnitureName, FurnitureOwnerName) VALUES (?, ?)",
        (data.FurnitureName, data.FurnitureOwnerName)
    )
    conn.commit()
    conn.close()
    return {"message": "Furniture added successfully!"}

@app.get("/api/furniture")
def view_all_furniture():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Furniture")
    rows = cursor.fetchall()
    conn.close()

    return [{
        "FurnitureId": row["FurnitureId"], 
        "FurnitureName": row["FurnitureName"], 
        "FurnitureOwnerName": row["FurnitureOwnerName"]
    } for row in rows]

@app.put("/api/furniture/{id}")
def modify_furniture(id: int, data: FurnitureRequest):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE Furniture SET FurnitureName = ?, FurnitureOwnerName = ? WHERE FurnitureId = ?",
        (data.FurnitureName, data.FurnitureOwnerName, id)
    )
    conn.commit()
    conn.close()
    return {"message": "Furniture updated successfully!"}

@app.delete("/api/furniture/{id}")
def delete_furniture(id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM Furniture WHERE FurnitureId = ?", (id,))
    conn.commit()
    conn.close()
    return {"message": "Furniture deleted successfully!"}




@app.post("/api/import")
def record_import(data: ImportRequest):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO Import (FurnitureId, ImportDate, Quantity) VALUES (?, ?, ?)",
        (data.FurnitureId, data.ImportDate, data.Quantity)
    )
    conn.commit()
    conn.close()
    return {"message": "Import logged successfully!"}

@app.post("/api/export")
def record_export(data: ExportRequest):
    conn = get_connection()
    cursor = conn.cursor()
    

    stock_query = """
        SELECT 
            COALESCE((SELECT SUM(Quantity) FROM Import WHERE FurnitureId = ?), 0) - 
            COALESCE((SELECT SUM(Quantity) FROM Export WHERE FurnitureId = ?), 0) AS CurrentStock
    """
    cursor.execute(stock_query, (data.FurnitureId, data.FurnitureId))
    result = cursor.fetchone()
    current_stock = result["CurrentStock"] if result else 0

    if data.Quantity > current_stock:
        conn.close()
        raise HTTPException(
            status_code=400, 
            detail=f"Transaction blocked: Insufficient stock. Only {current_stock} items remaining."
        )

    cursor.execute(
        "INSERT INTO Export (FurnitureId, ExportDate, Quantity) VALUES (?, ?, ?)",
        (data.FurnitureId, data.ExportDate, data.Quantity)
    )
    conn.commit()
    conn.close()
    return {"message": "Export logged successfully!"}




@app.get("/api/report/status")
def generate_warehouse_status_report():
    conn = get_connection()
    cursor = conn.cursor()
    
    query = """
        SELECT 
            f.FurnitureId,
            f.FurnitureName,
            f.FurnitureOwnerName,
            COALESCE((SELECT SUM(Quantity) FROM Import WHERE FurnitureId = f.FurnitureId), 0) AS TotalImported,
            COALESCE((SELECT SUM(Quantity) FROM Export WHERE FurnitureId = f.FurnitureId), 0) AS TotalExported,
            (
                COALESCE((SELECT SUM(Quantity) FROM Import WHERE FurnitureId = f.FurnitureId), 0) - 
                COALESCE((SELECT SUM(Quantity) FROM Export WHERE FurnitureId = f.FurnitureId), 0)
            ) AS CurrentWarehouseStock
        FROM Furniture f
    """
    cursor.execute(query)
    rows = cursor.fetchall()
    conn.close()

    return [{
        "FurnitureId": row["FurnitureId"],
        "FurnitureName": row["FurnitureName"],
        "FurnitureOwnerName": row["FurnitureOwnerName"],
        "TotalImported": row["TotalImported"],
        "TotalExported": row["TotalExported"],
        "CurrentWarehouseStock": row["CurrentWarehouseStock"]
    } for row in rows]
