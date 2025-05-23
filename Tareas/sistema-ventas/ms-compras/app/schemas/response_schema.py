from pydantic import BaseModel

class ResponseSchema(BaseModel):
  status: bool
  status_code: int
  message: str
  data: dict | list = {}