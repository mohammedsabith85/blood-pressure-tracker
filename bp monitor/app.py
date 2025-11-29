from flask import Flask, render_template, request
import sqlite3
from datetime import datetime

app = Flask(__name__)

# Create database table if not exists
def init_db():
    conn = sqlite3.connect("bp.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS bp_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            systolic INTEGER,
            diastolic INTEGER,
            date TEXT
        )
    """)
    conn.commit()
    conn.close()

init_db()

def analyze_bp(sys, dia):
    if sys < 90 or dia < 60:
        return "Low BP - Increase water & salt intake, eat small frequent meals."
    elif sys <= 120 and dia <= 80:
        return "Normal BP - Keep a healthy lifestyle!"
    elif sys <= 139 or dia <= 89:
        return "Pre-Hypertension - Exercise, reduce salt, manage stress."
    else:
        return "High BP - Consult a doctor. Reduce salt & avoid oily foods."

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        date = request.form["date"]
        systolic = request.form["systolic"]
        diastolic = request.form["diastolic"]

        conn = sqlite3.connect("bp.db")
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO bp_records (systolic, diastolic, date) VALUES (?, ?, ?)",
            (systolic, diastolic, date),
        )
        conn.commit()
        conn.close()

    conn = sqlite3.connect("bp.db")
    cursor = conn.cursor()
    cursor.execute("SELECT systolic, diastolic, date FROM bp_records")
    data = cursor.fetchall()
    conn.close()

    advice = ""
    if data:
        last = data[-1]
        advice = analyze_bp(last[0], last[1])

    return render_template("index.html", readings=data, advice=advice)


if __name__ == "__main__":
    app.run(debug=True)
