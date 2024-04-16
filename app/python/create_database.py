import mysql.connector
import sys
import re

def main(database_name):
  mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root"
  )

  mycursor = mydb.cursor()
  mycursor.execute("SHOW DATABASES")
  
  myDBlist = []
  for db_name in mycursor:
    # For some reason the data comes back like ('database_name,')
    # This Regex removed the irrelevant stuff
    myDBlist.append(re.findall('[^\(\'].*[^\'^\,^\)]', str(db_name))[0])

  # Don't insert unless it exists
  if database_name in myDBlist:
    print("Error: Database Already Exists")
  else:
    mycursor.execute("CREATE DATABASE " + database_name)
    print("Successfulyl inserted", database_name)

  mycursor.close()
  mydb.close()

  print("Finished")
  
  

if __name__ == "__main__":
  print("Starting")
  main(sys.argv[1])