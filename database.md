# **Student Attendance Logging System (SQLite3 Compatible)**

This schema records student details and their daily attendance while ensuring:

* Timestamps are automatically set
* Duplicate attendance entries for the same student on the same day are prevented

---

## **1. Table Definitions**

### `student`

Stores basic student information.

```sql
CREATE TABLE student (
    rollnumber TEXT PRIMARY KEY,
    name TEXT NOT NULL
);
```

### `studentlog`

Logs attendance for students. The `log` field captures the current timestamp automatically when a new record is inserted.

```sql
CREATE TABLE studentlog (
    rollnumber TEXT NOT NULL,
    log DATETIME DEFAULT (datetime('now')),
    FOREIGN KEY (rollnumber) REFERENCES student(rollnumber)
);
```

---

## **2. Constraint to Prevent Duplicate Logs on the Same Day**

Use a **UNIQUE INDEX** to ensure a student can log only once per day.

```sql
CREATE UNIQUE INDEX idx_unique_log_per_day
ON studentlog (rollnumber, date(log));
```

This prevents duplicate entries for the same `rollnumber` on the same calendar date.

---

## **3. Trigger to Enforce Duplicate Check with Custom Error**

Even though the unique index enforces the rule, a **trigger can give a clearer message** when a duplicate insert is attempted:

```sql
CREATE TRIGGER prevent_duplicate_log
BEFORE INSERT ON studentlog
FOR EACH ROW
WHEN EXISTS (
    SELECT 1 FROM studentlog
    WHERE rollnumber = NEW.rollnumber
    AND date(log) = date('now')
)
BEGIN
    SELECT RAISE(ABORT, 'Log entry already exists for this student today');
END;
```

This trigger:

* Fires **before** insertion
* Checks if a record already exists for the same student **today**
* Raises an error if such a record is found

---

## **4. Behavior Summary**

| Feature                          | Implementation                              |
| -------------------------------- | ------------------------------------------- |
| Timestamp setting                | `DEFAULT (datetime('now'))` on `log` column |
| Prevent duplicate same-day logs  | `UNIQUE INDEX` + `BEFORE INSERT` trigger    |
| Foreign key reference to student | `FOREIGN KEY (rollnumber)`                  |

---

## **5. Sample Insert**

```sql
INSERT INTO student (rollnumber, name)
VALUES ('S101', 'Alice');

INSERT INTO studentlog (rollnumber)
VALUES ('S101');  -- log will be set automatically
```

Trying to insert again on the same day:

```sql
INSERT INTO studentlog (rollnumber)
VALUES ('S101');  -- will fail due to duplicate on same date
```


