def to_dict(model):
  """Converts a SQLAlchemy model into a dictionary."""
  return {key: value for key, value in model.__dict__.items() if not key.startswith("_")}