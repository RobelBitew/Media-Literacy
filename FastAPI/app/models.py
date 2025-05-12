from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Profile(Base):
    __tablename__ = "profiles"
    id = Column(Integer, primary_key=True)
    username = Column(String)
    caption = Column(Text)
    sentiment = Column(String)
