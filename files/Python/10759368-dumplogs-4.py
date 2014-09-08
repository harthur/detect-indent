"""
Dump IRC logs from MySQL to stdout.
"""

import sys
channel = sys.argv[-1]
filename = channel.split("#")[-1] + ".log"
password = raw_input("root pw: ")

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base

engine = create_engine("mysql://root:{}@localhost/test".format(password), convert_unicode=False, echo=False)
Base = declarative_base()
Base.metadata.reflect(engine)

# id, logged, changed, event, source, target, text, status
class Log(Base):
    __table__ = Base.metadata.tables["irclog"]

from sqlalchemy.orm import scoped_session, sessionmaker, Query
db_session = scoped_session(sessionmaker(bind=engine))

results = db_session.query(Log).filter_by(target=channel).all()

lines = 0

with open(filename, "w") as file_handler:
     for entry in results:
         timestamp = entry.logged
         username = entry.source
         msg = entry.text
     
         if "!" in username:
             username = username.split("!")[0]
     
         output = "{timestamp} < {username}> {msg}".format(
             timestamp=timestamp,
             username=username,
             msg=msg,
         )
     
         file_handler.write(output + "\n")

         lines += 1

print "total lines: ", lines